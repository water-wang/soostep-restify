var config = {
    
    PORT: 3002,
    
    DB_CONNECTION: 'mongodb://localhost/test',
    
    LOG_PATH: __dirname + '/log',
    
    SECRET_TOKEN: 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx',
    
    TOKEN_EXPIRATION_SEC: 60000 * 60,
    
    SECRET_SESSION: 'soostep',
    
    SESSION_TRY_TIMES: 3,
    
    SALT_WORK_FACTOR: 10,
    
    CORS: {
        origins: ['*'],
        headers: ['X-Requested-With', 'content-type', 'Authorization']
    }
};

module.exports = config;