module.exports = {
  dev: !['production', 'test'].includes(process.env.NODE_ENV),
  port: process.env.PORT || 8888,
  db: 'mongodb://localhost:27017/kiper-teste',
  clientId: '5cb63d828ab85bebe7527f13',
  clientSecret: 'kiper',
};
