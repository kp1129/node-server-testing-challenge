
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'user1'},
        {username: 'user2'},
        {username: 'user3'},
        {username: 'user4'},
        {username: 'user5'}
      ]);
    });
};
