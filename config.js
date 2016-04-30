module.exports = {
    //db: process.env.db || 'mongodb://23.97.199.59:27017/social-db',
    db: process.env.db || 'mongodb://127.0.0.1:27017/social-db',
    client_id_newAPI: '7c83df2dd8004cb683d5a861065507fd',
    clientSecret: process.env.clientSecret || 'a18c44ad660240dda4e2af1fbf0a5abf',
    tokenSecret: process.env.tokenSecret || 'socialPostApp',
    client_id_oldAPI: '0fbcf8f88e6d45b89ae445fd961a752f'
};
