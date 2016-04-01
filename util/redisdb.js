var redis = require('redis');
var redisClient = redis.createClient(6379);

redisClient.on('error', function (err) {
    console.log('Redis error: ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready to go.');
});

module.exports.redis = redis;
module.exports.redisClient = redisClient;