import { bold, cyan } from 'chalk'
import { prompt } from 'enquirer'

import {
  GetMapFromOptions,
  GetOptionDisplayStr,
  AskForChallenges,
  Question,
  AskForConfirmation,
} from '../@types/prompt'
import { displayBoxUI } from '../util/boxen'
import { Credential } from '../@types/credentials'
import { PROMPT_ORDER, WRONG_INPUT } from '../messages'

const QUESTIONS = [
  {
    type: 'input',
    name: 'username',
    message: 'Username:',
  },
  {
    type: 'password',
    mask: '*',
    name: 'password',
    message: 'Password:',
  },
]

export const getMapFromOptions: GetMapFromOptions = (array) => {
  return array.reduce((acc, cv) => {
    acc[cv.order] = cv
    return acc
  }, {} as { [key: number]: any })
}

export const getOptionDisplayStr: GetOptionDisplayStr = (array) => {
  return array.reduce((acc, cv) => {
    return (acc += `Enter ${cyan(cv.order)} to select: ${cyan(cv.title)}\n`)
  }, '')
}

export const askForChallenges: AskForChallenges = async (lessons) => {
  const lessonsByOrder = getMapFromOptions(lessons)
  displayBoxUI(getOptionDisplayStr(lessons).trimEnd())
  const { lessonOrder }: { lessonOrder: string } = await prompt([
    {
      type: 'input',
      name: 'lessonOrder',
      message: cyan('What lesson do you want to submit?'),
      validate: (lessonOrder) =>
        !lessonsByOrder[lessonOrder] ? PROMPT_ORDER : true,
    },
  ])

  console.clear()
  console.log(`\n${bold.cyan(`► ${lessonsByOrder[lessonOrder].title}`)}`)

  const challengeByOrder = getMapFromOptions(
    lessonsByOrder[lessonOrder].challenges
  )

  displayBoxUI(
    getOptionDisplayStr(lessonsByOrder[lessonOrder].challenges).trimEnd()
  )

  const { challengeOrder }: { challengeOrder: number } = await prompt([
    {
      type: 'input',
      name: 'challengeOrder',
      message: cyan('What challenge do you want to submit?'),
      validate: (challengeOrder) =>
        !challengeByOrder[challengeOrder] ? PROMPT_ORDER : true,
    },
  ])

  console.clear()
  console.log(`\n${bold.cyan(`▷ ${lessonsByOrder[lessonOrder].title}`)}`)
  console.log(`${bold.cyan(`  ► ${challengeByOrder[challengeOrder].title}`)}`)

  return {
    lessonId: Number(lessonsByOrder[lessonOrder].id),
    challengeId: Number(challengeByOrder[challengeOrder].id),
    lessonOrder,
    challengeOrder,
  }
}

export const askCredentials = async (): Promise<Credential> => {
  const credential: Credential = await prompt(QUESTIONS)
  if (!credential.username || !credential.password) {
    throw new Error(WRONG_INPUT)
  }

  return credential
}

export const askForConfirmation: AskForConfirmation = async (message) => {
  const confirm: Question = await prompt({
    type: 'confirm',
    name: 'question',
    message,
  })

  return confirm
}
