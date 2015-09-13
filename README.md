# sequelize-isunique-validator
A Sequelize plugin to add isUnique validation to models

## Why make this?

I needed to validate a nonpersitent Sequelize instance prior to saving it. Basically, when creating a user instance for my app, I needed to validate the email and username as being unique prior to saving the instance. After failing to find a plugin that would add this feature, I came across a thread on the Sequelize Github board:

[Why is `unique` not a validator?](https://github.com/sequelize/sequelize/issues/2640)

## Installation and Usage

### Install the module
```js
npm install sequelize-isunique-validator -S
```

### Load the module

```js
var Sequelize = require('sequelize');
require('sequelize-isunique-validator')(Sequelize);
```

### Define your columns as unique
```js
var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        isUnique: true,
        validate: {
            isEmail: true,
            isUnique: sequelize.validateIsUnique('email')
        }
    }
});
```
### Build or Create your instance
```javascript
User.create({
    name: 'John Doe',
    email: 'jdoe@example.com', //this email exists
}).catch(function(err){
    console.log(err)
});

```
What you get is 

```
[SequelizeValidationError: Validation error: That email is being used]
name: 'SequelizeValidationError',
message: 'Validation error: That email is being used',
errors: ...

```

## API

#### sequelize.validateIsUnique(`table field`, `optional error message`)

When using `sequelize.validateIsUnique()` the first parameter must the the field to do the check on. For example, `isUnique: sequelize.validateIsUnique('email')`. In order for the validation to pass for an existing instance, the primary keys for that instance will be used to exclude values for that instance. Based on the previous example, the query it performed was something like this ( depending on your database):
```
SELECT count(*) AS `count` FROM `users` AS `User` WHERE `User`.`email` = 'jdoe@example.com' AND `User `.`id`  IS NOT NULL;
```

The second parameter allows you to define a custom error message. The default error message is: `'{{field}} must be unique'`. Using our previous example we could do something like this: 

```javascript
var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        isUnique: true,
        validate: {
            isEmail: true,
            isUnique: sequelize.validateIsUnique('email', 'That email is being used. Please choose a different email address')
        }
    }
});
```
## Branch Strategy
The master branch will be the stable branch. Please submit your PRs against the development branch. Once tests are created for v1.0.0 I will be moving development to master.

## Testing
```
npm test
```

## Issues
If you discover a bug, please create a ticket on Github. 
[https://github.com/angelxmoreno/sequelize-isunique-validator/issues](https://github.com/angelxmoreno/sequelize-isunique-validator/issues)

## Contribution
Pull requests are always welcomed. This is my first module contributed to the NodeJS ecosystem. I'm sure there are a few things that could be improved. Please point them out, provide feedback and suggestions. I am all ears!
