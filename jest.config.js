module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    "roots": [
      "<rootDir>/tests",
      "<rootDir>/src"
    ],
    // "testMatch": [
    //   "modules/**/*.sepc.ts",
    //   "modules/**/?(*.)+(spec|test).ts",
    //   "modules/slack/SeminarReminder.sepc.ts"
    // ],
  }