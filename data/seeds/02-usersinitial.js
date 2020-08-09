const hashpw = '$2y$14$2IVaGIT/b6pV5/5caGZK.uYxVJDA8FdcyMBJItPIIMOr/XzWGJ1Lm';
exports.seed = function (knex) {
  return knex('users').then(function () {
    // Inserts seed entries
    return knex('users').insert([
      { username: 'jobob', password: hashpw, department: 'admin' },
      { username: 'don juan', password: hashpw, department: 'sales' },
      { username: 'janey gunn', password: hashpw, department: 'security' },
      {
        username: 'harley quinn',
        password: hashpw,
        department: 'enforcement',
      },
    ]);
  });
};
