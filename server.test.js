// testing library
const request = require('supertest');
// the server / file we are testing
const server = require('./server');
// database connection since we're testing api
const db = require('./data/connection');

describe('server', () => {
    describe('POST /users', () => {  
        // to make tests independent of each other, 
        // we could truncate the table before each test
        beforeEach(async () => {
            await db('users').truncate(); 
        });

        it('should return status 201', () => {
            return request(server)
                    .post("/users")
                    .send({ username: "kp1129" })
                    .then(res => {
                        expect(res.status).toBe(201);
                    });
        });

        it('should return message "new user created"', () => {
            return request(server)
                    .post("/users")
                    .send({ username: "katya" })
                    .then(res => {
                        expect(res.body.message).toBe("new user created")
                    })
        });

        it('should add the new user to the database', async () => {
            const newUsername = "user123";
            // as of now, this username shouldn't exist
            const notExisting = await db('users').where({ username: newUsername });
            expect(notExisting).toHaveLength(0);

            await request(server)
                    .post('/users')
                    .send({ username: newUsername })
                    .then(res => {
                        expect(res.status).toBe(201);
                    });
            // now check the db to make sure the username got added
            const existing = await db('users').where({ username: newUsername });
            expect(existing).toHaveLength(1);
        })
    })

    describe('DELETE /users', () => {
        // to make tests independent of each other, 
        // we could truncate the table before each test
        beforeEach(async () => {
            await db('users').truncate(); 
        });

        it('should return status 200', async () => {
            // since we truncate before each test, 
            // we need to post a new user before we can delete 
            await request(server)
                    .post('/users')
                    .send({ username: 'user12345' })
                    .then(res => {
                        expect(res.status).toBe(201);
                    });
            // now delete
            await request(server)
                    .delete("/users")
                    .send({ id: 1 })
                    .then(res => {
                        expect(res.status).toBe(200);
                    })
        });

        it('should return message "user successfully deleted"', async () => {
            // since we truncate before each test, 
            // we need to post a new user before we can delete 
            await request(server)
            .post('/users')
            .send({ username: 'user54321' })
            .then(res => {
                expect(res.status).toBe(201);
            });
            // now delete
            await request(server)
                    .delete("/users")
                    .send({ id: 1 })
                    .then(res => {
                        expect(res.body.message).toBe("user successfully deleted");
                    })
        });

        it('should remove the user from the database', async () => {
            const newUsername = "user111";
            // as of now, this username shouldn't exist
            const notExisting = await db('users').where({ username: newUsername });
            expect(notExisting).toHaveLength(0);
            // since we truncate before each test, 
            // we need to post a new user before we can delete 
            await request(server)
            .post('/users')
            .send({ username: newUsername })
            .then(res => {
                expect(res.status).toBe(201);
            });
            // now check the db to make sure that username got removed
            const existing = await db('users').where({ username: newUsername });
            expect(existing).toHaveLength(1);
        })
    })
})
