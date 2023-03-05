const moment = require('moment');
const redis = require('redis');
const { rateLimitMaxRequests, rateLimitPeriod } = require('../config');
const redisClient = redis.createClient({ 
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    enable_offline_queue: false 
});

redisClient.connect().then(async (res) => {
    console.log('Redis connected');
  })
  .catch((err) => {
    console.log('Redis error: ' + err);
  });

const rateLimit = async (req, res, next) => {
    const key = `rate-limit:${req.ip}`;
    const redisData = await redisClient.get(key);
    console.log({redisData})
    if (redisData !== null) {
        // user exists in redis
        let data = JSON.parse(redisData);
        let currentTime = moment().unix();
        let difference = (currentTime - data.startTime) / rateLimitPeriod;
        console.log({difference})
        if (difference >= 1) {
            let body = {
                count: 1,
                startTime: moment().unix()
            };
            redisClient.set(key, JSON.stringify(body));

            next();
        }
        if (difference < 1) {
            if (data.count > rateLimitMaxRequests) {
                return res.status(429).json({ message: "Too many requests. Try again later." });
            }
            // update the count
            data.count++;
            redisClient.set(key, JSON.stringify(data));
            next();
        }
    } else {
        // add new user & set request count to 1
        let body = {
            count: 1,
            startTime: moment().unix()
        };
        redisClient.set(key, JSON.stringify(body));

        next();
    }
};

module.exports = rateLimit;