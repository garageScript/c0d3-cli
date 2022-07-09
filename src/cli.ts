#!/usr/bin/env node

import 'dotenv/config'
import updateNotifier from 'update-notifier'
import { createCommand } from 'commander'
import { bold } from 'chalk'

import submit from './commands/submit'
import login from './commands/login'
import logout from './commands/logout'
import { URL } from './constants'
import * as Sentry from '@sentry/node'
import '@sentry/tracing'

const SENTRY_DSN = process.env.SENTRY_DSN

SENTRY_DSN &&
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 0 to stop monitoring
    // the performance of transactions
    tracesSampleRate: 1.0,
  })

const pkg = require('../package.json')
const program = createCommand()
updateNotifier({ pkg, updateCheckInterval: 0 }).notify()
console.clear()

export const init = (): void => {
  // List Options
  program
    .version(
      `c0d3 cli version: ${bold.magenta(pkg.version)}`,
      undefined,
      'Show the c0d3 cli version'
    )
    .helpOption(undefined, 'Display help menu').usage(`[options]

  ${bold.magenta('A command line interface (CLI) for c0d3.com')}`)

  // List Commands
  program
    .command('submit')
    .alias('s')
    .description('Submit git diff of challenge to c0d3.com')
    .option('--url <url> ', 'Set url endpoint for http request', URL)
    .option('-d, --debug')
    .action(submit)

  program
    .command('login')
    .alias('l')
    .description('Login to your c0d3.com account')
    .option('--url <url> ', 'Set url endpoint for http request', URL)
    .action(login)

  program
    .command('logout')
    .description('Logout to your c0d3.com account')
    .action(logout)

  program.parse(process.argv)

  if (!program.args.length) {
    program.help()
  }
}

init()
