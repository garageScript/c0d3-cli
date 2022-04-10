import gitP from 'simple-git/promise'
import { DISALLOWED_FILES } from '../constants'
import {
  CURRENT_BRANCH,
  NOT_MASTER,
  NO_DIFFERENCE,
  WRONG_BRANCH,
  FAILED_GET_LASTCHECKOUT,
} from '../messages'

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

  const isMaster = splitLastCheckoutMove[0].trim() === 'master'

  return isMaster
}

export const getDiffAgainstMaster = async (): Promise<DiffObject> => {
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

  const [display, db] = await Promise.all([
    git.diff([`--color`, `master..${current}`, ...ignoreFileOptions]),
    git.diff([`master..${current}`, ...ignoreFileOptions]),
  ])

  return {
    display,
    db,
  }
}
