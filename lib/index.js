/* global module */

'use strict';

var validateIsUnique = function (col, msg, primary_key) {
    var conditions = {where: {}};
    msg = (!msg) ? col + ' must be unique' : msg;
    primary_key = (!primary_key) ? 'id' : primary_key;
    
    return function (value, next) {
        conditions.where[primary_key] = {'$not':this[primary_key]};
        conditions.where[col] = value;
        return this.Model.count(conditions).then(function (found) {
            return (found !== 0) ? next(msg) : next();
        }).catch(next);
    };
};

module.exports = function (Sequelize) {
    Sequelize = !Sequelize ? require('sequelize') : Sequelize;
    Sequelize.prototype.validateIsUnique = validateIsUnique;
    return Sequelize;
};