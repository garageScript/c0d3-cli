import submit from './submit'
import { FAIL_TO_GET_LESSONS, SUBMISSION_ERROR } from '../messages'
import { DEBUG_TOKEN } from '../constants'
import { getDiffAgainstMaster } from '../util/git'
import { askForChallenges } from '../util/prompt'
// import { displayBoxUI } from '../util/boxen'
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
          id: '110',
          title: 'Is Sum > 10',
          order: 7,
        },
      ],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Should submit without error', async () => {
    const args = { url: 'fakeURL', debug: false }
    getDiffAgainstMaster.mockResolvedValue('fakeDiff')
    askForChallenges.mockResolvedValue({
      lessonId: 'fakeLessonID',
      challengeId: 'fakeChallengeId',
    })
    expect(await submit(args)).toBe(undefined)
  })

  test('Should throw error', () => {
    const args = { url: 'fakeURL', debug: false }
    getDiffAgainstMaster.mockResolvedValue('fakeDiff')
    getLessons.mockRejectedValue()
    expect(submit(args)).rejects.toThrowError()
  })

  test('Should use debug token', async () => {
    const args = { url: 'fakeURL', debug: true }
    const params = [
      args.url,
      {
        lessonId: 'fakeLessonID',
        challengeId: 'fakeChallengeId',
        cliToken: DEBUG_TOKEN,
        diff: 'fakeDiff',
      },
    ]
    getDiffAgainstMaster.mockResolvedValue('fakeDiff')
    getLessons.mockResolvedValueOnce({ lessons }).mockResolvedValueOnce()
    askForChallenges.mockResolvedValue({
      lessonId: 'fakeLessonID',
      challengeId: 'fakeChallengeId',
    })

    const res = await submit(args)
    expect(res).toBe(undefined)
    expect(sendSubmission).toHaveBeenCalledTimes(1)
    expect(sendSubmission).toHaveBeenNthCalledWith(1, ...params)
  })
})
