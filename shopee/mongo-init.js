db = db.getSiblingDB('admin');
db.createUser({
  user: 'root',
  pwd: 'password',
  roles: [
    { role: 'root', db: 'admin' },
    { role: 'dbOwner', db: 'mydatabase' }
  ]
});

db = db.getSiblingDB('mydatabase');
db.createCollection('init'); 