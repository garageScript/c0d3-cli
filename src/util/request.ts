import ora from 'ora'
import request from 'graphql-request'

import { Lesson } from '../@types/prompt'
import { GetLessons, SendSubmission } from '../@types/request'
import { GET_LESSONS, POST_SUBMISSION } from '../graphql'
import {
  FAIL_TO_GET_LESSONS,
  SUBMISSION_ERROR,
  SUBMISSION_SUCCEED,
} from '../messages'

const spinner = ora()

export const getLessons: GetLessons = async (url) => {
  try {
    spinner.start('Loading...')
    const { lessons } = await request<{ lessons: [Lesson] }>(url, GET_LESSONS)
    spinner.stop()
    return lessons
  } catch {
    spinner.stop()
    throw new Error(FAIL_TO_GET_LESSONS)
  }
}

export const sendSubmission: SendSubmission = async (
  url,
  submission
): Promise<void> => {
  try {
    spinner.start('Sending...')
    await request(url, POST_SUBMISSION, submission)
    spinner.succeed(SUBMISSION_SUCCEED)
  } catch {
    spinner.stop()
    throw new Error(SUBMISSION_ERROR)
  }
}
