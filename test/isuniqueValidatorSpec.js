/* global require */

var expect = require('chai').expect;
var Sequelize = require('sequelize');
require('../lib/')(Sequelize);
var test_config = require('./config');
var sequelize = new Sequelize(test_config.database, test_config.username, test_config.password, {
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log
});
describe('Is Unique Validator', function () {
    describe('#init()', function () {
        it('should add the `validateIsUnique` function to the sequelize object', function () {
            expect(sequelize.validateIsUnique).to.be.a('function');
        });
    });

});