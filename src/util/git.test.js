import { getDiffAgainstMaster } from './git'
import {
  WRONG_BRANCH,
  NO_DIFFERENCE,
  FAILED_GET_LASTCHECKOUT,
  NOT_MASTER,
  INVALID_CHALLENGE_FILE,
  SUBMITTING_PLUS_TWO_FILES,
} from '../messages'
import {
  INVALID_SECOND_FILE,
  WRONG_CHALLENGE_TO_SUBMIT,
} from './dynamicMessages'

jest.mock('simple-git/promise', () =>
  jest.fn(() => {
    return {
      branch: jest
        .fn()
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'master' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' })
        .mockResolvedValueOnce({ current: 'notMaster' }),

      diff: jest
        .fn()
        // Test 1
        // Called with --name-only flag
        .mockResolvedValueOnce('\njs0/1.js')
        // Db Diff
        .mockResolvedValueOnce('\njs0/1.js')
        // Display Diff
        .mockResolvedValueOnce('\njs0/1.js')
        // Test 2
        // Stops at wrong branch error
        // Test 3
        // Called with --name-only flag
        .mockResolvedValueOnce('')
        // no difference
        .mockResolvedValueOnce('\njs0/1.js')
        .mockResolvedValueOnce('\njs0/1.js')
        // FAILED_TO_GET_LASTCHECKOUT
        .mockResolvedValueOnce('\njs0/abc.js')
        .mockResolvedValueOnce('\njs0/abc.js')
        // SUBMITTING_PLUS_TWO_FILES
        .mockResolvedValueOnce('\njs0/1.js\njs0/2.js\njs0/3.js')
        // INVALID_CHALLENGE_FILE for no challenge files
        .mockResolvedValueOnce('\njs0/abc.js\njs0/1.test.js')
        // SUBMITTING_PLUS_TWO_FILES for submitting +2 challenges
        .mockResolvedValueOnce('\njs0/1.js\njs0/2.js')
        // INVALID_SECOND_FILE
        .mockResolvedValueOnce('\nabc.js\n1.js')
        // Should submit with test file
        .mockResolvedValueOnce('\njs0/1.js\njs0/1.test.js')
        .mockResolvedValueOnce('\njs0/1.js\njs0/1.test.js')
        .mockResolvedValueOnce('\njs0/1.js\njs0/1.test.js')
        // Should throw error: WRONG_CHALLENGE_TO_SUBMIT
        .mockResolvedValueOnce('\njs0/2.js')
        // Should throw error: INVALID_CHALLENGE_FILE on wrong file
        .mockResolvedValueOnce('\njs0/abc.js')
        // Should not throw error: INVALID_CHALLENGE_FILE on wrong file
        .mockResolvedValueOnce('\njs0/1.js')
        .mockResolvedValueOnce('\njs0/1.js')
        .mockResolvedValueOnce('\njs0/1.js')
        // Should submit if html file and lesson is JS3
        .mockResolvedValueOnce('\njs3/1.html')
        .mockResolvedValueOnce('\njs3/1.html')
        .mockResolvedValueOnce('\njs3/1.html')
        // Should continue if not valid html file
        .mockResolvedValueOnce('\njs3/1.mdx')
        // Should submit with 2nd file as html for js3
        .mockResolvedValueOnce('\njs3/10.js\njs3/10.html')
        .mockResolvedValueOnce('\njs3/10.js\njs3/10.html')
        .mockResolvedValueOnce('\njs3/10.js\njs3/10.html'),

      raw: jest
        .fn()
        .mockResolvedValueOnce(
          `
        7abfefd HEAD@{0}: checkout: moving from master to branch2
        7abfefd HEAD@{1}: checkout: moving from branch2 to master
        `
        )
        .mockResolvedValueOnce(
          `
        7abfefd HEAD@{0}: checkout: moving from branch3 to branch2
        7abfefd HEAD@{1}: checkout: moving from branch2 to master
        `
        )
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``)
        .mockResolvedValueOnce(``),
    }
  })
)

describe('getDiffAgainstMaster', () => {
  test('Should return diff', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(5, 1)).resolves.toEqual({
      display: '\njs0/1.js',
      db: '\njs0/1.js',
    })
  })

  test('Should throw error: WRONG_BRANCH', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(5, 1)).rejects.toThrow(WRONG_BRANCH)
  })

  test('Should throw error: NO_DIFFERENCE', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(5, 1)).rejects.toThrow(NO_DIFFERENCE)
  })

  test('Should throw error: NOT_MASTER', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(5, 1)).rejects.toThrow(NOT_MASTER)
  })

  test('Should log: FAILED_GET_LASTCHECKOUT', (done) => {
    expect.assertions(1)

    const consoleSpy = jest.spyOn(console, 'log')

    // Assertions become 2 if used await
    getDiffAgainstMaster(5, 1).then(() => {
      expect(consoleSpy).toHaveBeenNthCalledWith(2, FAILED_GET_LASTCHECKOUT)

      consoleSpy.mockClear()
      done()
    })
  })

  test('Should throw error: SUBMITTING_PLUS_TWO_FILES', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(2, 1)).rejects.toThrow(
      SUBMITTING_PLUS_TWO_FILES
    )
  })

  test('Should throw error: INVALID_CHALLENGE_FILE for no challenge files', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(2, 1)).rejects.toThrow(
      INVALID_CHALLENGE_FILE
    )
  })

  test('Should throw error: SUBMITTING_PLUS_TWO_FILES for submitting +2 challenges', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(2, 1)).rejects.toThrow(
      SUBMITTING_PLUS_TWO_FILES
    )
  })

  test('Should throw error: INVALID_SECOND_FILE', () => {
    expect.assertions(1)

    // handles when e.includes('/) is false
    const error = INVALID_SECOND_FILE('abc.js')

    return expect(getDiffAgainstMaster(2, 1)).rejects.toThrow(error)
  })

  test('Should submit with test file', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(2, 1)).resolves.toStrictEqual({
      db: '\njs0/1.js\njs0/1.test.js',
      display: '\njs0/1.js\njs0/1.test.js',
    })
  })

  test('Should throw error: WRONG_CHALLENGE_TO_SUBMIT', () => {
    expect.assertions(1)

    // Chose to submit challenge 1 (1.js) but modified 2.js
    const error = WRONG_CHALLENGE_TO_SUBMIT(1, 2)

    return expect(getDiffAgainstMaster(2, 1)).rejects.toThrow(error)
  })

  test('Should throw error: INVALID_CHALLENGE_FILE on wrong file', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(2, 1)).rejects.toThrow(
      INVALID_CHALLENGE_FILE
    )
  })

  test('Should not throw error: INVALID_CHALLENGE_FILE on wrong file', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(2, 1)).resolves.toStrictEqual({
      db: '\njs0/1.js',
      display: '\njs0/1.js',
    })
  })

  test('Should submit if html file and lesson is JS3', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(3, 10)).resolves.toStrictEqual({
      db: '\njs3/1.html',
      display: '\njs3/1.html',
    })
  })

  test('Should continue if not valid html file', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(3, 10)).rejects.toThrow(
      INVALID_CHALLENGE_FILE
    )
  })

  test('Should submit with 2nd file as html for js3', () => {
    expect.assertions(1)

    return expect(getDiffAgainstMaster(3, 10)).resolves.toStrictEqual({
      db: '\njs3/10.js\njs3/10.html',
      display: '\njs3/10.js\njs3/10.html',
    })
  })
})
