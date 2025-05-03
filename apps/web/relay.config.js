module.exports = {
  src: './src',
  artifactDirectory: './src/__generated__',
  schema: './data/schema.graphql',
  exclude: ['**/node_modules/**', '**/dist/**', '**/__generated__/**'],
  language: 'typescript',
};
