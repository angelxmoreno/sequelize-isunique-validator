/* global require */

var expect = require('chai').expect;
var Sequelize = require('sequelize');
require('../lib')(Sequelize);
var db = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './test/database.sqlite',
    logging: false
});
var UserModel;
var isuniqueUsernameMsg = 'Please choose a different username';
var dataset = {
    user1: {
        name: 'John Doe',
        email: 'jdoe@example.com',
        username: 'jdoe'
    },
    user2: {
        name: 'Jane Doe',
        email: 'jdoe@example.com',
        username: 'jdoe1'
    },
    user3: {
        name: 'Jack Does',
        email: 'jackdoes@example.com',
        username: 'jdoe'
    }
};
var initModel = function (done) {
    UserModel = db.define('UserModel', {
        name: Sequelize.STRING,
        email: {
            type: Sequelize.STRING,
            validate: {
                isUnique: db.validateIsUnique('email')
            }
        },
        username: {
            type: Sequelize.STRING,
            validate: {
                isUnique: db.validateIsUnique('username', isuniqueUsernameMsg)
            }
        }
    });

    UserModel.sync({force: true}).then(function () {
        done();
    }).catch(done);
};

describe('Is Unique Validator', function () {
    before('Creating db instance', function (done) {
        return initModel(done);
    });

    describe('#init()', function () {
        it('should add the `validateIsUnique` function to the sequelize object', function () {
            expect(db.validateIsUnique).to.be.a('function');
        });
    });

    describe('usage', function () {
        it('should work ok when no duplicate fields are found', function (done) {
            UserModel.create(dataset.user1).then(function (user) {
                expect(user.name).to.equal(dataset.user1.name);
                expect(user.email).to.equal(dataset.user1.email);
                expect(user.username).to.equal(dataset.user1.username);
                done();
            }).catch(done);
        });

        it('should use the default error message when no message string is given', function (done) {
            UserModel.create(dataset.user2).then(function (user) {
                expect(user).to.be.null;
            }).catch(function (err) {
                expect(err.message).to.equal('Validation error: email must be unique');
            }).finally(function () {
                done();
            });
        });

        it('should use the provided error message when a message string is given', function (done) {
            UserModel.create(dataset.user3).then(function (user) {
                expect(user).to.be.null;
            }).catch(function (err) {
                expect(err.message).to.equal('Validation error: ' + isuniqueUsernameMsg);
            }).finally(function () {
                done();
            });
        });
        
        it('should allow an instance to be saved when it is the only row holding the unique value', function (done) {
            UserModel.findOne({
                where: {
                    email: dataset.user1.email
                }
            }).then(function (user) {
                user.name += ' II';
                user.validate().then(function(err){
                    expect(err).to.be.a('undefined');
                    done();
                });
            }).catch(done);
        });
    });
});