import { getDiffAgainstMaster } from './git'
import {
  WRONG_BRANCH,
  NO_DIFFERENCE,
} from '../messages'

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
        // Test 1
        // Called with --name-only flag
        .mockResolvedValueOnce('index.js')
        // Db Diff
        .mockResolvedValueOnce('fakeDiff')
        // Display Diff
        .mockResolvedValueOnce('fakeDiff')
        // Test 2
        // Stops at wrong branch error
        // Test 3
        // Called with --name-only flag
        .mockResolvedValueOnce(''),
        // no difference
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
