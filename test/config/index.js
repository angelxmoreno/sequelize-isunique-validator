/* global module, process */

'use strict';

module.exports = {
    username: process.env.SEQ_TEST_USER || 'test',
    password: process.env.SEQ_TEST_PW || 'test',
    database: process.env.SEQ_TEST_DB || 'test',
    host: process.env.SEQ_TEST_HOST || '127.0.0.1',
    postgres: {
        port: process.env.SEQ_TEST_PORT || 5432
    },
    mysql: {
        port: process.env.SEQ_TEST_PORT || 3306
    },
    buildConfigString: function(dialect){
        return dialect + '://' + this.username + ':' + this.password + '@' + this.host + ':' + this[dialect].port + '/' + this.database;
    }
};
