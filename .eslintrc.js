module.exports = {
  "extends": "standard",
  "plugins": [ "jest" ],
  "env": {
    "jest/globals": true
  },
  "rules": {
    "semi": ["error", "always"],
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error"
  }
};
