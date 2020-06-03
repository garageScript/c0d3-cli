import gitP, { SimpleGit } from 'simple-git/promise'
import { WRONG_BRANCH, CURRENT_BRANCH, NO_DIFFERENCE } from '../messages'

type DiffObject = {
  db: string
  display: string
}

const git: SimpleGit = gitP()

export const getDiffAgainstMaster = async (): Promise<DiffObject> => {
  const { current } = await git.branch()
  if (current === 'master') throw new Error(WRONG_BRANCH)
  console.log(`${CURRENT_BRANCH} ${current}\n`)

  // const diff = await git.diff([`--color`, `master..${current}`])
  const diff = {
    display: await git.diff([`--color`, `master..${current}`]),
    db: await git.diff([`master..${current}`]),
  }
  const hasDiffFromMaster = !!diff.db
  if (!hasDiffFromMaster) throw new Error(NO_DIFFERENCE)

  return diff
}
