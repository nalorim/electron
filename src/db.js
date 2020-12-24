const sqlite3 = require('sqlite3').verbose()
let db

function conn () {
  if (!db || !db.open) {
    db = new sqlite3.Database('base.db')
  }
  return db
}

export const initTable = () => {
    return new Promise((resolve, reject) => {
      let db = conn()
      db.serialize(() => {
        db.run('CREATE TABLE if not exists HistoryTable (id int primary key, name varchar(64))')
        db.run('CREATE TABLE IF NOT EXISTS RecordTable (id int primary key, name varchar(64), parentId int)')
        resolve()
      })
    })
  }