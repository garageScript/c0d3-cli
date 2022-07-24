import submit from './submit'
import { DEBUG_TOKEN } from '../constants'
import { getDiffAgainstMaster } from '../util/git'
import { askForChallenges, askForConfirmation } from '../util/prompt'
import { getLessons, sendSubmission } from '../util/request'

jest.mock('../util/credentials.ts')
jest.mock('../util/request')
jest.mock('../util/prompt')
jest.mock('../util/boxen')
jest.mock('../util/git')

describe('c0d3 submit', () => {
  const lessons = [
    {
      id: '5',
      title: 'Foundations of JavaScript',
      challenges: [
        {
          id: 110,
          title: 'Is Sum > 10',
          order: 7,
        },
      ],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Should submit if the answer is true', async () => {
    const args = { url: 'fakeURL', debug: false }
    
    getDiffAgainstMaster.mockResolvedValue({
      db: 'fakeDiff',
      display: 'fakeDiff',
    })

    askForChallenges.mockResolvedValue({
      lessonId: 666,
      challengeId: 666,
      lessonOrder: 666,
    })

    askForConfirmation.mockResolvedValue({
      question: true
    })

    await submit(args)

    expect(sendSubmission).toHaveBeenCalled()
  })

  test('Should not submit if the answer is false', async () => {
    const args = { url: 'fakeURL', debug: false }
    
    getDiffAgainstMaster.mockResolvedValue({
      db: 'fakeDiff',
      display: 'fakeDiff',
    })

    askForChallenges.mockResolvedValue({
      lessonId: 666,
      challengeId: 666,
      lessonOrder: 666,
    })

    askForConfirmation.mockResolvedValue({
      question: false
    })

    await submit(args)

    expect(sendSubmission).toHaveBeenCalledTimes(0)
  })

  test('Should submit without error', async () => {
    const args = { url: 'fakeURL', debug: false }
    getDiffAgainstMaster.mockResolvedValue({
      db: 'fakeDiff',
      display: 'fakeDiff',
    })
    askForChallenges.mockResolvedValue({
      lessonId: 666,
      challengeId: 666,
      lessonOrder: 666,
    })
    expect(await submit(args)).toBe(undefined)
  })

  test('Should throw error', () => {
    const args = { url: 'fakeURL', debug: false }
    getDiffAgainstMaster.mockResolvedValue({
      db: 'fakeDiff',
      display: 'fakeDiff',
    })
    getLessons.mockRejectedValue()
    expect(submit(args)).rejects.toThrowError()
  })

  test('Should use debug token', async () => {
    const args = { url: 'fakeURL', debug: true }
    const params = [
      args.url,
      {
        lessonId: 666,
        challengeId: 666,
        cliToken: DEBUG_TOKEN,
        diff: 'fakeDiff',
      },
    ]
    getDiffAgainstMaster.mockResolvedValue({
      db: 'fakeDiff',
      display: 'fakeDiff',
    })
    getLessons.mockResolvedValueOnce({ lessons }).mockResolvedValueOnce()
    askForChallenges.mockResolvedValue({
      lessonId: 666,
      challengeId: 666,
      lessonOrder: 666,
    })

    askForConfirmation.mockResolvedValue({
      question: true
    })


    const res = await submit(args)
    expect(res).toBe(undefined)
    expect(sendSubmission).toHaveBeenCalledTimes(1)
    expect(sendSubmission).toHaveBeenNthCalledWith(1, ...params)
  })
})
