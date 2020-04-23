const express = require('express');
const Users = require('./usersModel');

const server = express();

server.use(express.json());

server.get("/users", (req, res) => {
    res.status(200).json({ message: 'api is up!'})
})

// create
server.post("/users", (req, res) => {
    const newUser = req.body;
    Users.create(newUser)
    .then(response => {
        res.status(201).json({ message: "new user created" })
    })
    
})

// delete
server.delete("/users", (req, res) => {
    const {id} = req.body;

    Users.findById(id)
    .then(user => {
        Users.remove(user)
        .then(response => {
            res.status(200).json({ message: "user successfully deleted" })
        })
        .catch(error => res.status(500).json({ message: "oops! something went wrong" }))
    })
    .catch(error => res.status(500).json({ message: "oops! something went wrong here too" }))
})

module.exports = server;