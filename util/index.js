module.exports = {
    syslog: require('./logger').syslog,
    bizlog: require('./logger').bizlog,
    redisdb: require('./redisdb'),
    router: require('./router'),
    sessionstore: require('./sessionstore'),
    token: require('./token')
}