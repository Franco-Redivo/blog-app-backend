const Blog = require('./blog');
const User = require('./user');

Blog.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Blog, { foreignKey: 'userId' });

//Blog.sync({ alter: true });
//User.sync({ alter: true });

module.exports = {
    Blog,
    User
}
