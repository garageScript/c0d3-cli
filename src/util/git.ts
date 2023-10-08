import gitP from 'simple-git/promise'
import { DISALLOWED_FILES } from '../constants'
import {
  CURRENT_BRANCH,
  NOT_MASTER,
  NO_DIFFERENCE,
  WRONG_BRANCH,
  FAILED_GET_LASTCHECKOUT,
  INVALID_CHALLENGE_FILE,
} from '../messages'
import {
  INVALID_SECOND_FILE,
  WRONG_CHALLENGE_TO_SUBMIT,
  SUBMITTING_PLUS_TWO_FILES,
} from './dynamicMessages'

type DiffObject = {
  db: string
  display: string
}

const git = gitP()

const didCheckoutFromMaster = async () => {
  const reflog = await git.raw('reflog')
  const reflogToArray = reflog.split('\n')
  const filterReflogToMoving = reflogToArray.filter((x) =>
    x.includes('checkout: moving')
  )

  const splitLastCheckoutMove = filterReflogToMoving[0]
    // Extracts: moving from <branch> to <branch>
    ?.match(/moving from [\w]+ to [\w]+/)?.[0]
    // Extracts: <branch> to <branch>
    ?.match(/[\w]+ to [\w]+/)?.[0]
    .split('to')

  if (!splitLastCheckoutMove) return FAILED_GET_LASTCHECKOUT

  return splitLastCheckoutMove[0].trim() === 'master'
}

const predictValidFile = (matchWith: string | RegExp) => (e: string) =>
  e.includes('/') ? e.split('/')[1].match(matchWith) : e.match(matchWith)

const validateFiles = (
  changedFilesString: string,
  lessonOrder: string,
  selectedChallengeOrder: string
) => {
  // 3 is js3 or Objects
  if (+lessonOrder > 3) return

  const fileNameRegex = /(^\d+).js/g // Matches 1.js 2.js 3.js ...etc
  const fileNameWithHtmlRegex = /(.+).html/g // Matches *.html
  const predictCorrectFileName = predictValidFile(fileNameRegex)
  const predictCorrectFileNameWithHtml = predictValidFile(fileNameWithHtmlRegex)

  const changedFilesArray = changedFilesString.trim().split('\n')

  // If a single file - [1.js]
  if (changedFilesArray.length === 1 && changedFilesArray[0]) {
    const [challengeFile] = changedFilesArray
    const isFileValid = predictCorrectFileName(challengeFile)
    const changedFileOrder = challengeFile.split('.')[0].split('/')[1]

    if (+lessonOrder === 3) {
      const validHtmlFile = predictCorrectFileNameWithHtml(challengeFile)

      if (validHtmlFile) return
    }

    if (!isFileValid) throw new Error(INVALID_CHALLENGE_FILE)

    // If the challenge to submit is not equal to the modified challenge file
    if (selectedChallengeOrder !== changedFileOrder) {
      throw new Error(
        WRONG_CHALLENGE_TO_SUBMIT(selectedChallengeOrder, changedFileOrder)
      )
    }

    return
  }

  // If more than 2 files - [1.js, 2.js, 2.test.js]
  if (changedFilesArray.length > 2)
    throw new Error(SUBMITTING_PLUS_TWO_FILES(changedFilesArray))

  // If 2 files - [1.js, 1.test.js] || [1.js, 2.js]
  const challengeFiles = changedFilesArray.filter(predictCorrectFileName)

  // If no challenge files
  if (!challengeFiles.length) {
    throw new Error(INVALID_CHALLENGE_FILE)
  }

  // If more than one challenge
  if (challengeFiles.length > 1) {
    throw new Error(SUBMITTING_PLUS_TWO_FILES(changedFilesArray))
  }

  const testFile = changedFilesArray.find((e) => e.includes('test'))

  // If 2nd file is not a test file
  if (!testFile) {
    const is2ndFileHtml = changedFilesArray.find((e) =>
      predictCorrectFileNameWithHtml(e)
    )

    // If lesson is JS3 and 2nd file is HTML
    if (+lessonOrder === 3 && is2ndFileHtml) {
      return
    }

    const invalidFile = changedFilesArray.find(
      (e) => !predictCorrectFileName(e)
    )
    throw new Error(INVALID_SECOND_FILE(invalidFile))
  }
}

export const getDiffAgainstMaster = async (
  lessonOrder: string,
  challengeOrder: number
): Promise<DiffObject> => {
  const { current } = await git.branch()
  if (current === 'master') throw new Error(WRONG_BRANCH)
  console.log(`${CURRENT_BRANCH} ${current}\n`)

  // Files to exclude relative to git root
  const ignoreFileOptions = DISALLOWED_FILES.map(
    (file) => `:(exclude,top)*${file}`
  )

  const changedFilesString = await git.diff([
    `master..${current}`,
    '--diff-filter=d',
    '--name-only',
    ...ignoreFileOptions,
  ])

  const hasDiffFromMaster = !!changedFilesString.length
  if (!hasDiffFromMaster) throw new Error(NO_DIFFERENCE)

  const isMasterBranch = await didCheckoutFromMaster()
  if (typeof isMasterBranch === 'string') console.log(isMasterBranch)
  if (!isMasterBranch) throw new Error(NOT_MASTER)

  validateFiles(changedFilesString, lessonOrder, challengeOrder.toString())

  const [display, db] = await Promise.all([
    git.diff([
      `--color`,
      `master..${current}`,
      '--diff-filter=d',
      ...ignoreFileOptions,
    ]),
    git.diff([`master..${current}`, '--diff-filter=d', ...ignoreFileOptions]),
  ])

  return {
    display,
    db,
  }
}
