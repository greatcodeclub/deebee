var Table = require('./lib/table').Table

var table = new Table()

table.createIndex("username")

for (var i = 0; i < 500000; i++) {
  table.insert({
    "username": "user" + i,
    "name": "The User #" + i,
    "status": i % 1000 === 0 ? 'active' : 'canceled'
  })
}

// var record = table.findById(id)
// console.log(record)

console.time('findBy username')
var record = table.findBy('username', 'marc')
console.timeEnd('findBy username')
