import ora from 'ora'
import { promises as fsPromises } from 'fs'

import { HIDDEN_DIR } from '../constants'
import { LOGOUT_ERROR } from '../messages'

const spinner = ora()

const logout = async (): Promise<void> => {
  try {
    await fsPromises.rmdir(HIDDEN_DIR, { recursive: true })
    spinner.succeed('Your are logout\n')
  } catch {
    spinner.fail(LOGOUT_ERROR)
  }
}

export default logout
