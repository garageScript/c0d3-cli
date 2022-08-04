import { cyan } from 'chalk'
import enquirer from 'enquirer'
import { PROMPT_ORDER, WRONG_INPUT } from '../messages'
import { getMapFromOptions, getOptionDisplayStr, askForChallenges, askCredentials, askForConfirmation } from './prompt'

jest.mock('enquirer')
jest.mock('../util/boxen')

describe('getMapFromOptions', () => {
  test('should create a map object', () => {
    const arr = [
      {
        order: 5,
        keyOne: 'keyOne',
        keyTwo: 'keyTwo'
      },
      {
        order: 3,
        keyOne: 'keyOne',
        keyTwo: 'keyTwo'
      },
      {
        order: 4,
        keyOne: 'keyOne',
        keyTwo: 'keyTwo'
      }
    ]
    const result = {
      '3': {
        keyOne: 'keyOne',
        keyTwo: 'keyTwo',
        order: 3
      },
      '4': {
        keyOne: 'keyOne',
        keyTwo: 'keyTwo',
        order: 4
      },
      '5': {
        keyOne: 'keyOne',
        keyTwo: 'keyTwo',
        order: 5
      }
    }
    expect(getMapFromOptions(arr)).toEqual(result)
  })
})

describe('getOptionDisplayStr', () => {
  test('should create a string of getOptionDisplayStr', () => {
    const arr = [
      {
        order: 5,
        title: 'Five'
      },
      {
        order: 3,
        title: 'Three'
      },
      {
        order: 4,
        title: 'Four'
      }
    ]
    const result = `Enter ${cyan(5)} to select: ${cyan('Five')}\nEnter ${cyan(
      3
    )} to select: ${cyan('Three')}\nEnter ${cyan(4)} to select: ${cyan(
      'Four'
    )}\n`

    expect(getOptionDisplayStr(arr)).toEqual(result)
  })
})

describe('askForChallenges', () => {
  const lessons = [
    {
      id: 5,
      title: 'Foundations of JavaScript',
      order: 0,
      challenges: [
        {
          id: 110,
          title: 'Is Sum > 10',
          order: 7
        },
        {
          id: 104,
          title: 'Functional Sums',
          order: 10
        }
      ]
    }
  ]
  test('should return lessonID and challengeID', () => {
    enquirer.prompt = jest
      .fn()
      .mockResolvedValueOnce({ lessonOrder: '0' })
      .mockResolvedValueOnce({ challengeOrder: '10' })
      .mockResolvedValueOnce({ lessonOrder: '10' })
    expect(askForChallenges(lessons)).resolves.toEqual({
      challengeId: 104,
      lessonId: 5,
      lessonOrder: '0',
      challengeOrder: "10"
    })
  })

  test('Should display PROMPT_ORDER', async () => {
    enquirer.prompt = jest
      .fn()
      .mockResolvedValueOnce({ lessonOrder: '0' })
      .mockResolvedValueOnce({ challengeOrder: '10' })
      .mockResolvedValueOnce({ lessonOrder: '10' })
    await askForChallenges(lessons)
    const invalidLesson = enquirer.prompt.mock.calls[0][0][0].validate(
      'wrongInput'
    )
    const validLesson = enquirer.prompt.mock.calls[0][0][0].validate(0)
    const invalidChallenge = enquirer.prompt.mock.calls[1][0][0].validate(
      'wrongInput'
    )
    const validChallenge = enquirer.prompt.mock.calls[1][0][0].validate(10)
    const validLessonOrder = enquirer.prompt.mock.calls[1][0][0].validate('10')

    expect(invalidLesson).toBe(PROMPT_ORDER)
    expect(validLesson).toBe(true)
    expect(invalidChallenge).toBe(PROMPT_ORDER)
    expect(validChallenge).toBe(true)
    expect(validLessonOrder).toBe(true)
  })
})

describe('askCredentials', () => {
  test('should return credentials', () => {
    const credentials = { username: 'fakeUsername', password: 'fakePassword' }
    enquirer.prompt = jest.fn().mockResolvedValue(credentials)
    expect(askCredentials()).resolves.toEqual(credentials)
  })

  test('should throw error: WRONG_INPUT', () => {
    const credentials = { username: '', password: '' }
    enquirer.prompt = jest.fn().mockResolvedValue(credentials)
    expect(askCredentials()).rejects.toThrowError(WRONG_INPUT)
  })
})

describe('askForConfirmation', () => {
  test('should return true', () => {
    const answer = { question: true }
    enquirer.prompt = jest.fn().mockResolvedValue(answer)

    expect(askForConfirmation('Testing?')).resolves.toEqual(answer)
  })

  test('should return false', () => {
    const answer = { question: false }
    enquirer.prompt = jest.fn().mockResolvedValue(answer)

    expect(askForConfirmation('Testing?')).resolves.toEqual(answer)
  })
})
