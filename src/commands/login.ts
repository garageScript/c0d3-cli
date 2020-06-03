import ora from 'ora'

import { askCredentials } from '../util/prompt'
import { getToken, saveToken } from '../util/credentials'

const spinner = ora()

const login = async ({ url }: { url: string }): Promise<void> => {
  try {
    const credentials = await askCredentials()
    spinner.start('Login...')
    const newCliToken = await getToken(credentials, url)
    await saveToken(newCliToken)
    spinner.succeed('You are logged in\n')
  } catch (error) {
    spinner.fail(error.message)
  }
}

export default login
