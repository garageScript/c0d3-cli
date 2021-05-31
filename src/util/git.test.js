import { getDiffAgainstMaster } from './git'
import {
  WRONG_BRANCH,
  NO_DIFFERENCE,
  DISALLOWED_FILES_COMMITTED,
} from '../messages'

jest.mock('simple-git/promise', () =>
  jest.fn(() => {
    return {
      branch: jest
        .fn()
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'master' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
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
        .mockResolvedValueOnce({ current: 'notMaster' })
        // no difference
        // Test 4
        // Called with --name-only flag
        .mockResolvedValueOnce('package-lock.json\nindex.js')
        // Disallowed files
        // Test 5
        // Called with --name-only flag
        .mockResolvedValueOnce('package-lock.json\nyarn.lock'),
        // Disallowed files
    }
  })
)

describe('getDiffAgainstMaster', () => {
  test('Should return diff', () => {
    expect(getDiffAgainstMaster()).resolves.toEqual({
      changedFiles: ['index.js'],
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

  test('Should throw error: (single) DISALLOWED_FILES_COMMITTED', () => {
    expect(getDiffAgainstMaster()).rejects.toThrow(
      DISALLOWED_FILES_COMMITTED(['package-lock.json'])
    )
  })

  test('Should throw error: (multiple) DISALLOWED_FILES_COMMITTED', () => {
    expect(getDiffAgainstMaster()).rejects.toThrow(
      DISALLOWED_FILES_COMMITTED(['package-lock.json, yarn.lock'])
    )
  })
})
