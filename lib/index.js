'use strict';

var validateIsUnique = function (col, msg) {
    var conditions = {where: {}};
    msg = (!msg) ? col + ' must be unique' : msg;
    return function (value, next) {
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