var BTree = require('./btree').BTree

function Table() {
  this.records = [
    // { ... }
  ]
  this.indexes = { // by attribute
    // "attributeName": <BTree>("value": [ids])
  }
}
exports.Table = Table

Table.prototype.insert = function(values) {
  var id = this.records.length + 1
  this.records.push(values)

  // Update the indexes
  var table = this
  Object.keys(this.indexes).forEach(function(attribute) {
    table.updateIndex(attribute, values[attribute], id)
  })

  return id
}

Table.prototype.findById = function(id) {
  return this.records[id - 1]
}

Table.prototype.findBy = function(attribute, value) {
  // Use the index if available
  var index = this.indexes[attribute]

  if (index) {
    var ids = index.search(value) || []
    var self = this
    return ids.map(function(id) { return self.findById(id) })

  } else {
    return this.records.filter(function(record) {
      return record[attribute] === value
    })

  }
}

Table.prototype.createIndex = function(attribute) {
  this.indexes[attribute] = new BTree()
}

Table.prototype.updateIndex = function(attribute, value, id) {
  // Check if record has index for attribute
  var index = this.indexes[attribute]

  if (index) {
    // Insert the id of the record in the index
    var ids = index.search(value)

    // No ids yet.
    if (!ids) {
      ids = []
      index.insert(value, ids)
    }

    ids.push(id)
  }
}
