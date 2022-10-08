const { INVALID_SECOND_FILE } = require("./dynamicMessages");
import { bold } from 'chalk'

describe('Dynamic messages', () => {
    it('Should add string to INVALID_SECOND_FILE', () => {
        expect(INVALID_SECOND_FILE('abc.js')).toEqual(
            bold.red("Invalid second file (abc.js) to be submitted. Please make sure you are submitting a valid test file (abc.test.js) if it is supposed to be a test file.\nIf it's supposed to be the HTML script file, please include it in the HTML file.")
        )
    })

    it('Should remove parent dir and add string to INVALID_SECOND_FILE', () => {
        expect(INVALID_SECOND_FILE('abc')).toEqual(
            bold.red("Invalid second file (abc) to be submitted. Please make sure you are submitting a valid test file (abc.test.js) if it is supposed to be a test file.\nIf it's supposed to be the HTML script file, please include it in the HTML file.")
        )
    })
})