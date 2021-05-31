import { bold } from 'chalk'

export const CURRENT_BRANCH = bold.magenta('\nYou are currently on branch: ')

export const NO_DIFFERENCE = `There are ${bold.red('no differences ')}
in your current branch from your master branch.\n`

export const DIFF_MSG = bold.magenta(
  '\nDifferences from your current branch to master:\n\n'
)

export const WRONG_BRANCH = `Submissions must come from branches that are ${bold.red(
  'not master. '
)}
Please make sure that you branch, add, commit, and submit correctly.\n`

export const PROMPT_ORDER = bold.red(`The number needs to be a non-negative integer.
To cancel submission, press Ctrl + d`)

export const WRONG_INPUT = bold.red('Unable to obtain username/password\n')

export const WRONG_CREDENTIALS = bold.red(
  'Invalid credentials, please try again!\n'
)

export const SAVE_TOKEN_ERROR = bold.red(
  'Unable to create hidden directory and save credentials\n'
)

export const FAIL_TO_GET_LESSONS = bold.red(
  'Can not fetch lessons. It might be a network issue. Please try again.\n'
)

export const SUBMISSION_ERROR = bold.red(
  'Your submission was not successfully sent. Please try again.\n'
)

export const SUBMISSION_SUCCEED = bold.green(
  `Your submission was successful!
  You will receive notification in chat when it is reviewed.
  Thank you!\n`
)

export const NOT_LOGGED_IN = `${bold.red('You are currently not logged in.')}\n
Please run ${bold.magenta(
  'c0d3 login'
)} to login first, then run ${bold.magenta('c0d3 submit')}.\n`

export const LOGOUT_ERROR = bold.red('The logout has failed.\n')

export const DISALLOWED_FILES_COMMITTED = (files: string[]): string =>
  bold.red(
    `Your submission contains ${files.join(', ')}, ${
      files.length > 1 ? 'these files are' : 'this file is'
    } not meant to be submitted. Please remove them from your commit. Ask for help on C0D3 Discord if you are unsure how to fix this.`
  )
