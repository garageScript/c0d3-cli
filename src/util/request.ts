import ora from 'ora'
import { request, GraphQLClient } from 'graphql-request'
import * as Sentry from '@sentry/node'

import { Lesson } from '../@types/prompt'
import { GetLessons, SendSubmission } from '../@types/request'
import { GET_LESSONS, POST_SUBMISSION } from '../graphql'
import {
  FAIL_TO_GET_LESSONS,
  SUBMISSION_ERROR,
  SUBMISSION_SUCCEED,
} from '../messages'
import { decode, encode } from './encoding'
const pkg = require('../../package.json')

const spinner = ora()

export const getLessons: GetLessons = async (url) => {
  try {
    spinner.start('Loading...')
    const { lessons } = await request<{ lessons: [Lesson] }>(url, GET_LESSONS)
    spinner.stop()
    return lessons
  } catch (error) {
    Sentry.captureException(error)
    spinner.stop()
    throw new Error(FAIL_TO_GET_LESSONS)
  }
}

export const sendSubmission: SendSubmission = async (
  url,
  submission
): Promise<void> => {
  try {
    const encodedCliData = encode({
      ...decode(submission.cliToken),
      cliVersion: pkg.version,
    })

    const graphQLClient = new GraphQLClient(url, {
      headers: {
        authorization: `Bearer ${encodedCliData}`,
      },
    })

    spinner.start('Sending...')

    const { lessonId, challengeId, diff } = submission

    const submissionWithoutCliToken = {
      lessonId,
      challengeId,
      diff,
    }

    await graphQLClient.request(POST_SUBMISSION, submissionWithoutCliToken)
    spinner.succeed(SUBMISSION_SUCCEED)
  } catch (error) {
    Sentry.captureException(error)
    spinner.stop()
    throw new Error(SUBMISSION_ERROR)
  }
}
