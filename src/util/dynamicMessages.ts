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

export const WRONG_CHALLENGE_TO_SUBMIT = (
  selectedChallengeOrder?: string,
  modifiedChallengeOrder?: string
): string =>
  bold.red(
    `
The challenge you selected (${selectedChallengeOrder}) to be submitted is not the same as the modified challenge file (${modifiedChallengeOrder}.js)\n
${bold.blue(
  `Please either reset the last commit with ${bold.magentaBright(
    'git reset --soft HEAD~'
  )} and modify the correct challenge (${selectedChallengeOrder}.js) or select the modified challenge (${modifiedChallengeOrder})`
)}
`
  )
