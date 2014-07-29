var DB = require("./lib/db").DB

var db = new DB()
var table = db.table("users")

table.createIndex("username")

for (var i = 0; i < 500000; i++) {
  table.insert({
    "username": "user" + i,
    "name": "The User #" + i,
    "age": 30
  })
}

var record = table.findById(1)
console.log(record)

console.time("findAllByAttribute")
var records = table.findBy({ username: "user10000", age: 30 })
console.timeEnd("findAllByAttribute")
console.log(records)
