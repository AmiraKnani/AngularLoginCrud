const jwt = require('jsonwebtoken');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

/**
 * Login handling
 */
server.post('/login', (req, res) => {
  const users = router.db.get('users').value();
  const { email, password } = req.body;
  const privateKey = 'private-fake-key';

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ sub: user.id }, privateKey, { expiresIn: '1h' });
    res.send({ access_token: token });
  } else {
    res.status(401).send({ message: 'Credentials are incorrect.' });
  }
});

/**
 * Fetch all users
 */
server.get('/users', (req, res) => {
  const users = router.db.get('users').value();
  res.send(users);
});

/**
 * Add a new user
 */
server.post('/users', (req, res) => {
  const newUser = req.body;
  const users = router.db.get('users');
  const maxId = Math.max(...users.value().map(u => u.id));
  newUser.id = maxId + 1;
  users.push(newUser).write();
  res.status(201).send(newUser);
});

/**
 * Update an existing user
 */
server.put('/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const updatedUser = req.body;
  const users = router.db.get('users');

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1, updatedUser).write();
    res.send(updatedUser);
  } else {
    res.status(404).send({ message: 'User not found.' });
  }
});

/**
 * Delete a user
 */
server.delete('/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const users = router.db.get('users');

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1).write();
    res.status(204).send();
  } else {
    res.status(404).send({ message: 'User not found.' });
  }
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
