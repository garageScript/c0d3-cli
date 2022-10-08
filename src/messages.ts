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

export const NOT_MASTER = `Hey, You checked out from the wrong branch! You should checkout from master.\n
 Here's a link to solve this problem: ${bold.magenta(
   'https://github.com/garageScript/c0d3-cli/wiki/Students-issues#checked-out-from-a-branch-other-than-master'
 )}\n`

export const FAILED_GET_LASTCHECKOUT = `Failed to find if the branch was checked out from Master,
please either create an issue on ${bold.magenta(
  'https://github.com/garageScript/c0d3-cli/issues'
)} or on our Discord server C0D3 on ${bold.magenta(
  'https://discord.gg/MJ4PS4dK6J'
)}\n`

export const INVALID_CHALLENGE_FILE = bold.red(
  'A valid challenge file could not be found. Make sure the file is not renamed and it has the following format: 1.js, 2.js, 3.js, 10.html (only for JS3 challenge 10) ...etc\n'
)

export const PROMPT_ORDER = bold.red(`The number needs to be a non-negative integer.
To cancel submission, press Ctrl + d`)

export const WRONG_INPUT = bold.red('Unable to obtain username/password\n')

export const WRONG_CREDENTIALS = bold.red(
  'Invalid credentials, please try again!\n'
)

export const UNREACHABLE_URL = bold.red(
  'Server unreachable. Try again later.\n'
)

export const INVALID_URL = bold.red(
  `Invalid URL. Only absolute URLs are supported (e.g, https://fakegraphql)`
)

export const UNSUPPORTED_GRAPHQL_REQUEST = bold.red(
  'The provided GraphQL server cannot handle this request. Please check your server.'
)

export const UNHANDLED_ERROR = bold.red(
  'Unhandled error. Please create an issue about it with a way to reproduce it in https://github.com/garageScript/c0d3-cli/issues'
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
