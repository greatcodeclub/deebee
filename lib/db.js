var Table = require('./table').Table

function DB() {
  this.tables = {}
}
exports.DB = DB

DB.prototype.table = function(table) {
  return this.tables[table] || (this.tables[table] = new Table())
}
