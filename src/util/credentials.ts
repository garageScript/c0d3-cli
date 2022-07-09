import fs, { promises as fsPromises } from 'fs'
import * as credentials from './credentials'
import { request } from 'graphql-request'
import * as Sentry from '@sentry/node'

import {
  Token,
  VerifyToken,
  GetToken,
  SaveToken,
  CreateCredentialsFile,
} from '../@types/credentials'
import { IS_TOKEN_VALID, GET_CLI_TOKEN } from '../graphql'
import { CREDENTIALS_PATH, HIDDEN_DIR } from '../constants'
import {
  WRONG_CREDENTIALS,
  SAVE_TOKEN_ERROR,
  NOT_LOGGED_IN,
  UNREACHABLE_URL,
  INVALID_URL,
  UNSUPPORTED_GRAPHQL_REQUEST,
  UNHANDLED_ERROR,
} from '../messages'

enum LoginErrors {
  invalidPassword = 'Password is invalid',
  userDoesNotExist = 'User does not exist',
}

enum URLErrors {
  notAbsoluteURL = 'Only absolute URLs are supported',
  httpURL = 'Only HTTP(S) protocols are supported',
}

export const handleGetTokenError = (error: {
  response: { status: number; errors: { message: string }[] }
  code: string
  message: string
}): never => {
  const status = error?.response?.status
  const code = error?.code
  const message = error?.message
  const graphqlMessage = error?.response?.errors?.[0].message

  const isWrongCreds =
    graphqlMessage === LoginErrors.invalidPassword ||
    graphqlMessage === LoginErrors.userDoesNotExist

  const isInvalidURL =
    message === URLErrors.notAbsoluteURL || message === URLErrors.httpURL

  if (isWrongCreds) {
    throw new Error(WRONG_CREDENTIALS)
  }

  /* 
    If the domain is not found or no 
    graphql server to handle the request
  */
  if (
    code &&
    ['ENOTFOUND', 'CERT_HAS_EXPIRED', 'ECONNREFUSED'].includes(code)
  ) {
    throw new Error(UNREACHABLE_URL)
  }

  if (isInvalidURL) {
    throw new Error(INVALID_URL)
  }

  if (status && status !== 400) {
    throw new Error(UNSUPPORTED_GRAPHQL_REQUEST)
  }

  throw new Error(UNHANDLED_ERROR)
}

export const getCredentials: VerifyToken = async (url) => {
  try {
    const { cliToken } = require(CREDENTIALS_PATH)
    const { isTokenValid } = await request(url, IS_TOKEN_VALID, { cliToken })
    if (!isTokenValid) throw Error

    return cliToken
  } catch (error) {
    Sentry.captureException(error)
    throw new Error(NOT_LOGGED_IN)
  }
}

export const getToken: GetToken = async (credentials, url) => {
  try {
    const { login } = await request<Token>(url, GET_CLI_TOKEN, credentials)
    return login.cliToken
  } catch (error) {
    Sentry.captureException(error)
    return handleGetTokenError(error)
  }
}

export const saveToken: SaveToken = async (cliToken) => {
  try {
    credentials.createHiddenDir()
    await credentials.createCredentialsFile(cliToken)
  } catch (error) {
    Sentry.captureException(error)
    throw new Error(SAVE_TOKEN_ERROR)
  }
}

export const createHiddenDir = (): boolean => {
  if (!fs.existsSync(HIDDEN_DIR)) {
    fs.mkdirSync(HIDDEN_DIR)
    return true
  }
  return false
}

export const createCredentialsFile: CreateCredentialsFile = async (
  cliToken
) => {
  await fsPromises
    .writeFile(CREDENTIALS_PATH, JSON.stringify({ cliToken }))
    .catch((err) => {
      throw new Error(err)
    })
}
