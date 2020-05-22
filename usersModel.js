const db = require('./data/connection');

module.exports = {
    create,
    findById,
    remove
}

function findById(id){
    return db('users').where({ id }).first()
}

async function create(user) {
    const [id] = await db('users').insert(user, "id");

    return findById(id);
}

function remove(user) {
    return db('users').where({ id: user.id }).del()
}