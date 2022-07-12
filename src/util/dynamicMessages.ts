import { bold } from 'chalk'

export const INVALID_SECOND_FILE = (invalidFile?: string): string =>
  bold.red(
    `Invalid second file ${
      invalidFile && `(${invalidFile})`
    } to be submitted. Please make sure you are submitting a valid test file ${
      invalidFile &&
      `(${
        invalidFile.includes('.') ? invalidFile.split('.')[0] : invalidFile
      }.test.js)`
    } if it is supposed to be a test file, else remove it and submit`
  )
