const index = require('./index');
const users = require('./users');

module.exports = function(app) {
    app.use(index.routes(), index.allowedMethods());
    app.use(users.routes(), users.allowedMethods());
}