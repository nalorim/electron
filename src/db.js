const sqlite3 = require('sqlite3').verbose()
var path = require('path')
let db = new sqlite3.Database(path.join(__dirname, '..', '/../','db', 'base.db'));

db.serialize(() => {
  db.run('CREATE TABLE if not exists history (id int primary key, name varchar(64))')
  db.run('CREATE TABLE IF NOT EXISTS record (id int primary key, name varchar(64), history_id int)')
})