import gitP from 'simple-git/promise'
import { DISALLOWED_FILES } from '../constants'
import {
  CURRENT_BRANCH,
  DISALLOWED_FILES_COMMITTED,
  NO_DIFFERENCE,
  WRONG_BRANCH,
} from '../messages'

type DiffObject = {
  changedFiles: string[]
  db: string
  display: string
}

const git = gitP()

export const getDiffAgainstMaster = async (): Promise<DiffObject> => {
  const { current } = await git.branch()
  if (current === 'master') throw new Error(WRONG_BRANCH)
  console.log(`${CURRENT_BRANCH} ${current}\n`)

  const changedFilesString = await git.diff([
    `master..${current}`,
    '--name-only',
  ])

  const hasDiffFromMaster = !!changedFilesString.length
  if (!hasDiffFromMaster) throw new Error(NO_DIFFERENCE)

  const changedFiles = changedFilesString.trim().split('\n')

  const conflictingFiles = changedFiles.filter((file) =>
    DISALLOWED_FILES.includes(file)
  )

  if (conflictingFiles.length)
    throw new Error(DISALLOWED_FILES_COMMITTED(conflictingFiles))

  const [display, db] = await Promise.all([
    git.diff([`--color`, `master..${current}`]),
    git.diff([`master..${current}`]),
  ])

  return {
    changedFiles,
    display,
    db,
  }
}
