import { getDiffAgainstMaster } from './git'
import {
  WRONG_BRANCH,
  NO_DIFFERENCE,
  FAILED_GET_LASTCHECKOUT,
  NOT_MASTER,
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
        .mockResolvedValueOnce('')
        // no difference
        .mockResolvedValueOnce('fakeDiff')
        .mockResolvedValueOnce('fakeDiff'),
      

      raw: jest
        .fn()
        .mockResolvedValueOnce(`
        7abfefd HEAD@{0}: checkout: moving from master to branch2
        7abfefd HEAD@{1}: checkout: moving from branch2 to master
        `)
        .mockResolvedValueOnce(`
        7abfefd HEAD@{0}: checkout: moving from branch3 to branch2
        7abfefd HEAD@{1}: checkout: moving from branch2 to master
        `)
        .mockResolvedValueOnce(``)
    }
  })
)

describe('getDiffAgainstMaster', () => {
  test('Should return diff', () => {
    expect.assertions(1)
    
    return expect(getDiffAgainstMaster()).resolves.toEqual({
      display: 'fakeDiff',
      db: 'fakeDiff',
    })
  })

  test('Should throw error: WRONG_BRANCH', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster()).rejects.toThrow(WRONG_BRANCH)
  })

  test('Should throw error: NO_DIFFERENCE', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster()).rejects.toThrow(NO_DIFFERENCE)
  })

  test('Should throw error: NOT_MASTER', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster()).rejects.toThrow(NOT_MASTER)
  })

  test('Should log: FAILED_GET_LASTCHECKOUT', (done) => {
    expect.assertions(1)

    const consoleSpy = jest.spyOn(console, 'log');

    // Assertions become 2 if used await
    getDiffAgainstMaster().then(() => {
      expect(consoleSpy).toHaveBeenNthCalledWith(2, FAILED_GET_LASTCHECKOUT)
    
      consoleSpy.mockClear()
      done()
    })
  })
})
