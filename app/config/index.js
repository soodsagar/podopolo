module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : '{(p0d0p0l0)}',
  connectDB: require('./db'),
  rateLimitMaxRequests: 30,
  rateLimitPeriod: 60
};