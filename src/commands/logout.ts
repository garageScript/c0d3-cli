import ora from 'ora'
import { promises as fsPromises } from 'fs'
import * as Sentry from '@sentry/node'

import { HIDDEN_DIR } from '../constants'
import { LOGOUT_ERROR } from '../messages'

const spinner = ora()

const logout = async (): Promise<void> => {
  try {
    await fsPromises.rmdir(HIDDEN_DIR, { recursive: true })
    spinner.succeed('You have been logged out\n')
  } catch (error) {
    Sentry.captureException(error)
    spinner.fail(LOGOUT_ERROR)
  }
}

export default logout
