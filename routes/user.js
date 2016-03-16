var config = require('./config');

app.get('/', routes,posts.list);

app.get('/post/all', jwt({secret: config.secretToken}), tokenManager.verifyToken, routes.posts.listAll);

app.get('/post/:id', routes.posts.read);

app.post('/post', jwt({secret: config.secretToken}), tokenManager.verifyToken, routes.posts.create);

app.put('/post/:id', jwt({secret: config.secretToken}), tokenManager.verifyToken, routes.posts.update);

app.delete('/post/:id', jwt({secret: config.secretToken}), tokenManager.verifyToken, routes.posts.delete);

