import path from 'path'
import { homedir } from 'os'

const HOME = homedir()

const DIR = '.c0d3'

const CREDENTIAL_FILE = 'credentials.json'

export const CREDENTIALS_PATH = path.join(HOME, DIR, CREDENTIAL_FILE)

export const HIDDEN_DIR = path.join(HOME, DIR)

export const URL = 'https://www.c0d3.com/api/graphql'

// Token from test account asynchronymouse
export const DEBUG_TOKEN =
  'eyJpZCI6MTIxMCwiY2xpVG9rZW4iOiIxdHhrYndxMHYxa0hoenlHWmFmNTMifQ=='

// Files that should make the submission invalid if present in diff
export const DISALLOWED_FILES = ['package-lock.json', 'yarn.lock']
