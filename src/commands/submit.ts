import ora from 'ora'

import { DIFF_MSG } from '../messages'
import { displayBoxUI } from '../util/boxen'
import { askForChallenges, askForConfirmation } from '../util/prompt'
import { DEBUG_TOKEN } from '../constants'
import { getDiffAgainstMaster } from '../util/git'
import { getCredentials } from '../util/credentials'
import { getLessons, sendSubmission } from '../util/request'
import * as Sentry from '@sentry/node'

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
    const lessons = await getLessons(url)
    const {
      lessonId,
      challengeId,
      lessonOrder,
      challengeOrder,
    } = await askForChallenges(lessons)
    const diff = await getDiffAgainstMaster(lessonOrder, challengeOrder)

    displayBoxUI(DIFF_MSG + diff.display)
    const confirm = await askForConfirmation('The changes are correct?')

    if (confirm.question) {
      await sendSubmission(url, {
        lessonId,
        challengeId,
        cliToken,
        diff: diff.db,
      })
    }
  } catch (error) {
    Sentry.captureException(error)
    spinner.fail(error.message)
  }
}

export default submit
