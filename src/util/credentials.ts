import fs, { promises as fsPromises } from 'fs'
import * as credentials from './credentials'
import { request } from 'graphql-request'

import {
  Token,
  VerifyToken,
  GetToken,
  SaveToken,
  CreateCredentialsFile,
} from '../@types/credentials'
import { IS_TOKEN_VALID, GET_CLI_TOKEN } from '../graphql'
import { CREDENTIALS_PATH, HIDDEN_DIR } from '../constants'
import { WRONG_CREDENTIALS, SAVE_TOKEN_ERROR, NOT_LOGGED_IN, UNREACHABLE_URL, INVALID_URL, UNSUPPORTED_GRAPHQL_REQUEST, UNHANDLED_ERROR } from '../messages'

export const getCredentials: VerifyToken = async (url) => {
  try {
    const { cliToken } = require(CREDENTIALS_PATH)
    const { isTokenValid } = await request(url, IS_TOKEN_VALID, { cliToken })
    if (!isTokenValid) throw Error

    return cliToken
  } catch {
    throw new Error(NOT_LOGGED_IN)
  }
}

export const getToken: GetToken = async (credentials, url) => {
  try {
    const { login } = await request<Token>(url, GET_CLI_TOKEN, credentials)
    return login.cliToken
  } catch (error) {
    const status = error?.request?.status
    const code = error?.code
    const message = error?.message

    if (status && status === 400) {
      throw new Error(WRONG_CREDENTIALS)
    }

    if (status && status !== 400) {
      throw new Error(UNSUPPORTED_GRAPHQL_REQUEST)
    }

    // If the domain is not found or isn't 
    if (code && (
      code === 'ENOTFOUND' || code === 'CERT_HAS_EXPIRED'
    )
    ) {
      throw new Error(UNREACHABLE_URL)
    }

    if (message && message === 'Only absolute URLs are supported') {
      throw new Error(INVALID_URL)
    }

    throw new Error(UNHANDLED_ERROR)
  }
}

export const saveToken: SaveToken = async (cliToken) => {
  try {
    credentials.createHiddenDir()
    await credentials.createCredentialsFile(cliToken)
  } catch {
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
