const router = require('express').Router();
const { restricted } = require('../middleware/restricted')
const bcrypt = require('bcryptjs')
const Jokes = require('../../users/users-model')
const { JWT_SECRET } = require('../../secrets/index')
const jwt = require('jsonwebtoken')
const makeToken = require('./auth-token-builder')
const db = require('../../data/dbConfig');

router.post('/register',(req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)  
  Jokes.add({ username, password: hash })
    .then(newReg => {
      res.status(201).json(newReg)
    })
    .catch(next)
});

router.post('/login', (req, res, next) => {
let { username, password } = req.body

Jokes.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = makeToken(user)
        res.status(200).json({ message: `Welcome back ${user.username}...`, token })
      } else {
        next({ status: 401, message: 'invalid credentials' })
      }
    })
    .catch(next)
});

module.exports = router;
