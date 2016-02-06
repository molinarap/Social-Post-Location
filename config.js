module.exports = {
    //db: process.env.db || 'mongodb://23.97.199.59:27017/social-db',
    db: process.env.db || 'mongodb://127.0.0.1:27017/social-db',
    clientSecret: process.env.clientSecret || 'a18c44ad660240dda4e2af1fbf0a5abf',
    tokenSecret: process.env.tokenSecret || 'socialPostApp'
};
