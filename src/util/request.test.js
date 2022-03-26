jest.mock('./encoding.ts')

import { GraphQLClient, request } from 'graphql-request'
import { decode, encode } from './encoding'
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
    expect.assertions(1)

    decode.mockReturnValue({
      id: 1,
      cliToken: submission.cliToken,
    })

    const res = await sendSubmission('fakeUrl', submission)
    expect(res).toBe(undefined)
  })

  test('Should throw error', () => {
    expect.assertions(1)

    GraphQLClient.mockImplementation(() => {
      return {
          request: () => {
            throw new Error('hi')
          }
        }
    });
    
    expect(sendSubmission('fakeUrl', submission)).rejects.toThrowError()
  })

  test('Should set the authorization header as encoded cliToken and cliVersion', async () => {
    expect.assertions(1)

    GraphQLClient.mockImplementation(() => {
      return {
          request: () => {}
        }
    });

    decode.mockReturnValue({
      id: 1,
      cliToken: submission.cliToken,
    })

    const encodedCliData = encode({
      id: 1,
      cliToken: submission.cliToken,
      cliVersion: '2.1.5'
    })

    await sendSubmission('fakeUrl', submission)

    expect(GraphQLClient).toBeCalledWith('fakeUrl', {
      headers: {
        authorization: `Bearer ${encodedCliData}`,
      },
    })
  })
})

describe('getLessons', () => {
  test('Should not throw error', async () => {
    expect.assertions(1)

    request.mockResolvedValue({lessons: ['lesson']})
    const res = await getLessons('fakeUrl')
    expect(res).toEqual(['lesson'])
  })

  test('Should throw error', () => {
    expect.assertions(1)

    request.mockRejectedValue()
    expect(getLessons('fakeUrl')).rejects.toThrowError()
  })
})
