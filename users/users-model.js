const db = require('../data/dbConfig')

async function add(user) {
    const [id] = await db("users").insert(user)
    return getById(id)
}

function findBy(filter){
    return db('users as u').where(filter)
}

function getById(id) {
    return db('users as u')
      .where('id', id)
      .first()
}

module.exports = {
    add,
    findBy,
    getById,
  }