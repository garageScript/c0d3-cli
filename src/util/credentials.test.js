import fs, { promises as fsPromises } from 'fs'
import { SAVE_TOKEN_ERROR, WRONG_CREDENTIALS, NOT_LOGGED_IN } from '../messages'
import * as constants from '../constants'
import { request } from 'graphql-request'
import * as credentials from './credentials'
import {
  getCredentials,
  getToken,
  createHiddenDir,
  createCredentialsFile,
} from './credentials'

jest.mock('graphql-request')
jest.mock('../constants')
jest.mock('fs', () => {
  return {
    promises: {
      writeFile: jest.fn(),
    },
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
  }
})

describe('createHiddenDir', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create directory', () => {
    constants.HIDDEN_DIR = './fakeDir'
    fs.existsSync.mockReturnValue(false)
    fs.mkdirSync.mockReturnValue(true)
    expect(createHiddenDir()).toEqual(true)
    expect(fs.existsSync).toBeCalled()
    expect(fs.existsSync).toHaveBeenCalledWith(constants.HIDDEN_DIR)
    expect(fs.mkdirSync).toBeCalled()
    expect(fs.mkdirSync).toHaveBeenCalledWith(constants.HIDDEN_DIR)
  })

  test('should not create directory', () => {
    constants.HIDDEN_DIR = './fakeDir'
    fs.existsSync.mockReturnValue(true)
    expect(createHiddenDir()).toEqual(false)
    expect(fs.existsSync).toBeCalled()
    expect(fs.existsSync).toHaveBeenCalledWith(constants.HIDDEN_DIR)
    expect(fs.mkdirSync).not.toBeCalled()
  })
})

describe('getCredentials', () => {
  constants.CREDENTIALS_PATH = './credentials.test.json'

  test('should return a valid token', () => {
    request.mockResolvedValue({ isTokenValid: true })
    expect(getCredentials('fakeUrl')).resolves.toEqual('fakeCliToken')
  })

  test('should throw error FAIL_VERIFY_TOKEN', () => {
    request.mockResolvedValue({ isTokenValid: false })
    expect(getCredentials('fakeUrl')).rejects.toThrowError(NOT_LOGGED_IN)
  })

  test('should throw error FAIL_VERIFY_TOKEN', () => {
    request.mockRejectedValue()
    expect(getCredentials('fakeUrl')).rejects.toThrowError(NOT_LOGGED_IN)
  })
})

describe('getToken', () => {
  test('should return token', () => {
    request.mockResolvedValue({ login: { cliToken: 'fakeCliToken' } })
    expect(getToken('fakeCredentials', 'fakeUrl')).resolves.toEqual(
      'fakeCliToken'
    )
  })

  test('should throw error: WRONG_CREDENTIALS', () => {
    request.mockRejectedValue()
    expect(
      credentials.getToken('fakeCredentials', 'fakeUrl')
    ).rejects.toThrowError(WRONG_CREDENTIALS)
  })
})

describe('createCredentialsFile', () => {
  test('should create credentials file', async () => {
    constants.CREDENTIALS_PATH = './src/util/credentials.test.json'
    fsPromises.writeFile.mockResolvedValue()
    const res = await createCredentialsFile('fakeCliToken')
    expect(res).toEqual(undefined)
  })

  test('should create credentials file', () => {
    fsPromises.writeFile.mockRejectedValue()
    expect(createCredentialsFile('fakeCliToken')).rejects.toThrowError()
  })
})

describe('saveToken', () => {
  test('should save the token', () => {
    const spyCreateHiddenDir = jest.spyOn(credentials, 'createHiddenDir')
    const spyCreateCredentialsFile = jest.spyOn(
      credentials,
      'createCredentialsFile'
    )
    spyCreateHiddenDir.mockReturnValue()
    spyCreateCredentialsFile.mockResolvedValue()
    expect(credentials.saveToken('fakeCliToken')).resolves.not.toThrowError()
    expect(credentials.saveToken('fakeCliToken')).resolves.toBe(undefined)
    expect(spyCreateCredentialsFile).toBeCalledWith('fakeCliToken')
  })

  test('should throw error SAVE_TOKEN_ERROR', () => {
    const spyCreateHiddenDir = jest.spyOn(credentials, 'createHiddenDir')
    const spyCreateCredentialsFile = jest.spyOn(
      credentials,
      'createCredentialsFile'
    )
    spyCreateHiddenDir.mockReturnValue()
    spyCreateCredentialsFile.mockRejectedValue()
    expect(credentials.saveToken('fakeCliToken')).rejects.toThrowError(
      SAVE_TOKEN_ERROR
    )
  })
})
