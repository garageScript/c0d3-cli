import { GraphQLClient, request } from 'graphql-request'
import { getLessons, sendSubmission } from './request'

jest.mock('graphql-request')

describe('sendSubmission', () => {
  const submission = {
    lessonId: 'fakeLessonId',
    challengeId: 'fakeChallengeId',
    cliToken: 'fakeCliToken',
    diff: 'fakeDiff',
  }

  test('Should not throw error', async () => {
    const res = await sendSubmission('fakeUrl', submission)
    expect(res).toBe(undefined)
  })

  test('Should throw error', () => {
    GraphQLClient.mockImplementation(() => {
      return {
          request: () => {
            throw new Error('hi')
          }
        }
    });
    
    expect(sendSubmission('fakeUrl', submission)).rejects.toThrowError()
  })
})

describe('getLessons', () => {
  test('Should not throw error', async () => {
    request.mockResolvedValue({lessons: ['lesson']})
    const res = await getLessons('fakeUrl')
    expect(res).toEqual(['lesson'])
  })

  test('Should throw error', () => {
    request.mockRejectedValue()
    expect(getLessons('fakeUrl')).rejects.toThrowError()
  })
})
