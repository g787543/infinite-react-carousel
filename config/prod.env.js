module.exports = {
  NODE_ENV: '"production"',
  OPENPAAS: JSON.stringify(process.env.OPENPAAS) || 'http://localhost:8080'
};
