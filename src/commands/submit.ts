import ora from 'ora'

import { DIFF_MSG } from '../messages'
import { displayBoxUI } from '../util/boxen'
import { askForChallenges } from '../util/prompt'
import { DEBUG_TOKEN } from '../constants'
import { getDiffAgainstMaster } from '../util/git'
import { getCredentials } from '../util/credentials'
import { getLessons, sendSubmission } from '../util/request'

const spinner = ora()

const submit = async ({
  url,
  debug,
}: {
  url: string
  debug: boolean
}): Promise<void> => {
  try {
    const cliToken = debug ? DEBUG_TOKEN : await getCredentials(url)
    const diff = await getDiffAgainstMaster()
    const lessons = await getLessons(url)
    const { lessonId, challengeId } = await askForChallenges(lessons)
    displayBoxUI(DIFF_MSG + diff)
    await sendSubmission(url, {
      lessonId,
      challengeId,
      cliToken,
      diff,
    })
  } catch (error) {
    spinner.fail(error.message)
  }
}

export default submit
