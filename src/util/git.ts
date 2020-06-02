import gitP, { SimpleGit } from 'simple-git/promise'
import { WRONG_BRANCH, CURRENT_BRANCH, NO_DIFFERENCE } from '../messages'

const git: SimpleGit = gitP()

export const getDiffAgainstMaster = async (): Promise<string> => {
  const { current } = await git.branch()
  if (current === 'master') throw new Error(WRONG_BRANCH)
  console.log(`${CURRENT_BRANCH} ${current}\n`)

  const diff = await git.diff([`--color`, `master..${current}`])
  const hasDiffFromMaster = !!diff
  if (!hasDiffFromMaster) throw new Error(NO_DIFFERENCE)

  return diff
}
