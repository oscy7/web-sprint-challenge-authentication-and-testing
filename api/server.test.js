// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')

test('sanity', () => {
  expect(true).not.toBe(false)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('Get Jokes /', () => {
  test('returns a status 401 because token auth wont give access', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
  })
})

describe('Register: Post to /api/auth/register', () => {
  it('create a new user in the database', async () => {
    await request(server).post('/api/auth/register').send({ username: 'Dad', password: '1234' })
    const Dad = await db('users').where('username', 'Dad').first()
    expect(Dad).toMatchObject({ username: 'Dad' })
  })
  it('saves the user with a bcrypted password', async () => {
    await request(server).post('/api/auth/register').send({ username: 'Dad', password: '1234' })
    const Dad = await db('users').where('username', 'Dad').first()
    expect(bcrypt.compareSync('1234', Dad.password)).toBeTruthy()
  })
});

describe('Login: post to/api/auth/login', () => {
    it('responds with the correct message on valid credentials', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'Dad', password: '1234' })
      expect(res.body.message).toMatch(/Welcome back Dad/i)
    })
  
    it('responds with the correct status and message on invalid credentials', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'Padre', password: '12345' })
      expect(res.body.message).toMatch(/invalid credentials/i)
      expect(res.status).toBe(401)
    })
  });
