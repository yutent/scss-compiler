const testRunner = require('vscode/lib/testrunner')

testRunner.configure({
  ui: 'tdd', // the TDD UI is being used in extension.test.ts (suite, test, etc.)
  useColors: true, // colored output from test results
  timeout: 10000
})

module.exports = testRunner
