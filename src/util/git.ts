import gitP from 'simple-git/promise'
import { DISALLOWED_FILES } from '../constants'
import { CURRENT_BRANCH, NO_DIFFERENCE, WRONG_BRANCH } from '../messages'

type DiffObject = {
  db: string
  display: string
}

const git = gitP()

export const getDiffAgainstMaster = async (): Promise<DiffObject> => {
  const { current } = await git.branch()
  if (current === 'master') throw new Error(WRONG_BRANCH)
  console.log(`${CURRENT_BRANCH} ${current}\n`)

  const ignoreFileOptions = DISALLOWED_FILES.map((file) => `:!*${file}`)

  const changedFilesString = await git.diff([
    `master..${current}`,
    '--name-only',
    '--',
    '.',
    ...ignoreFileOptions,
  ])

  const hasDiffFromMaster = !!changedFilesString.length
  if (!hasDiffFromMaster) throw new Error(NO_DIFFERENCE)

  const [display, db] = await Promise.all([
    git.diff([
      `--color`,
      `master..${current}`,
      '--',
      '.',
      ...ignoreFileOptions,
    ]),
    git.diff([`master..${current}`, '--', '.', ...ignoreFileOptions]),
  ])

  return {
    display,
    db,
  }
}
