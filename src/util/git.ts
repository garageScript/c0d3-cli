import gitP from 'simple-git/promise'
import { DISALLOWED_FILES } from '../constants'
import {
  CURRENT_BRANCH,
  NOT_MASTER,
  NO_DIFFERENCE,
  WRONG_BRANCH,
  FAILED_GET_LASTCHECKOUT,
  INVALID_CHALLENGE_FILE,
  SUBMITTING_PLUS_TWO_FILES,
} from '../messages'
import { INVALID_SECOND_FILE } from './dynamicMessages'

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

const validateFiles = (changedFilesString: string, lessonId: number) => {
  // 4 is js3 or Objects
  if (lessonId > 4) return

  const predictValidFile = (e: string) =>
    e.includes('/')
      ? e.split('/')[1].match(fileNameRegex)
      : e.match(fileNameRegex)

  const changedFilesArray = changedFilesString.trim().split('\n')
  const fileNameRegex = /(^\d+).js/g // Matches 1.js 2.js 3.js ...etc

  // If a single file - [1.js]
  if (changedFilesArray.length === 1 && changedFilesArray[0]) {
    const isFileValid = changedFilesArray[0].split('/')[1]?.match(fileNameRegex)

    if (!isFileValid) throw new Error(INVALID_CHALLENGE_FILE)

    return
  }

  // If more than 2 files - [1.js, 2.js, 2.test.js]
  if (changedFilesArray.length > 2) throw new Error(SUBMITTING_PLUS_TWO_FILES)

  // If 2 files - [1.js, 1.test.js] || [1.js, 2.js]
  const challengeFiles = changedFilesArray.filter(predictValidFile)

  // If no challenge files
  if (!challengeFiles.length) {
    throw new Error(INVALID_CHALLENGE_FILE)
  }

  // If more than one challenge
  if (challengeFiles.length > 1) {
    throw new Error(SUBMITTING_PLUS_TWO_FILES)
  }

  const testFile = changedFilesArray.find((e) => e.includes('test'))

  // If 2nd file is not a test file
  if (!testFile) {
    const invalidFile = changedFilesArray.find((e) => !predictValidFile(e))
    throw new Error(INVALID_SECOND_FILE(invalidFile))
  }
}

export const getDiffAgainstMaster = async (
  lessonId: number
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
    '--name-only',
    ...ignoreFileOptions,
  ])

  const hasDiffFromMaster = !!changedFilesString.length
  if (!hasDiffFromMaster) throw new Error(NO_DIFFERENCE)

  const isMasterBranch = await didCheckoutFromMaster()
  if (typeof isMasterBranch === 'string') console.log(isMasterBranch)
  if (!isMasterBranch) throw new Error(NOT_MASTER)

  validateFiles(changedFilesString, lessonId)

  const [display, db] = await Promise.all([
    git.diff([`--color`, `master..${current}`, ...ignoreFileOptions]),
    git.diff([`master..${current}`, ...ignoreFileOptions]),
  ])

  return {
    display,
    db,
  }
}
