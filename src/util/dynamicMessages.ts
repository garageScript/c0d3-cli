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
    } if it is supposed to be a test file.\nIf it's supposed to be the HTML script file, please include it in the HTML file.`
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

export const SUBMITTING_PLUS_TWO_FILES = (files: string[]): string =>
  bold.red(`
More than 2 files are being submitted. Please make sure there is no branching issues. 

The files:

${files.reduce((acc, file) => `${acc}- ${file}\n`, '')}

${bold.cyan('If there is, you can solve it by following the links below:')}
${bold.magenta(`
- https://www.c0d3.com/docs/setup#reusing-your-branches
- https://github.com/garageScript/c0d3-cli/wiki/Students-issues#checked-out-from-a-branch-other-than-master`)}

${bold.magenta(
  `If the links above didn't help, please reach on Discord (https://discord.gg/MJ4PS4dK6J)!`
)}
`)
