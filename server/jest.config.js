/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  reporters: [
    "default",
    ["jest-summary-reporter", { "failuresOnly": false }]
  ]
}