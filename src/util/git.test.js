import { getDiffAgainstMaster } from './git'
import { WRONG_BRANCH, NO_DIFFERENCE } from '../messages'

jest.mock('simple-git/promise', () =>
  jest.fn(() => {
    return {
      branch: jest
        .fn()
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'master' })
        .mockResolvedValueOnce({ current: 'notMaster' }),
      diff: jest
        .fn()
        .mockResolvedValueOnce('fakeDiff')
        .mockResolvedValueOnce('fakeDiff')
        .mockResolvedValueOnce(''),
    }
  })
)

describe('getDiffAgainstMaster', () => {
  test('Should return diff', () => {
    expect(getDiffAgainstMaster()).resolves.toEqual({
      display: 'fakeDiff',
      db: 'fakeDiff',
    })
  })

  test('Should throw error: WRONG_BRANCH', () => {
    expect(getDiffAgainstMaster()).rejects.toThrow(WRONG_BRANCH)
  })

  test('Should throw error: NO_DIFFERENCE', () => {
    expect(getDiffAgainstMaster()).rejects.toThrow(NO_DIFFERENCE)
  })
})
