module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'jquery': true,
  },
  'extends': ['eslint:recommended', 'google'],
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'rules': {
    'no-unused-vars': 'off',
    'no-console': 'warn',
    'no-undef': 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'require-jsdoc': 'off',
    'max-len': 'off',
    'linebreak-style': 0,
  },
  'ignorePatterns': ['gulpfile.js', 'build', 'src/js/vendor'],
};
