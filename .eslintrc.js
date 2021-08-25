module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-extraneous-dependencies': 0,
    'react/prop-types': [2, { ignore: ['children'] }],
    'no-plusplus': 0,
    'react/forbid-prop-types': 1,
    'no-unused-vars': 1,
    'react/jsx-props-no-spreading': 0,
    'no-console': 0,
    'no-use-before-define': 1,
    'arrow-parens': [2, 'as-needed'],
    'comma-dangle': [2, 'never'],
    'no-multi-spaces': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-unused-expressions': 0
  }
};
