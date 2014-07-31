var BTree = require('./btree').BTree

function Table() {
  this.records = [
    // {...}
  ]

  this.indexes = {
    // "attributeName": { "value": [ids...] }
  }
}
exports.Table = Table

Table.prototype.insert = function(values) {
  this.records.push(values)

  var id = this.records.length

  var self = this
  Object.keys(this.indexes).forEach(function(attribute) {
    self.updateIndex(attribute, values[attribute], id)
  })

  return id
}


Table.prototype.findById = function(id) {
  return this.records[id - 1]
}

Table.prototype.findBy = function(attribute, value) {
  var index = this.indexes[attribute]

  if (index) {
    var ids = index.search(value) || []
    var self = this
    return ids.map(function(id) { return self.findById(id) })
  }

  return this.records.filter(function(record) {
    return record[attribute] === value
  })
}

Table.prototype.createIndex = function(attribute) {
  this.indexes[attribute] = new BTree()
}

Table.prototype.updateIndex = function(attribute, value, id) {
  var index = this.indexes[attribute]

  var ids = index.search(value)

  if (!ids) {
    ids = []
    index.insert(value, ids)
  }

  ids.push(id)
}
