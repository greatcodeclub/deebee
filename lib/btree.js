function BTree() {
  this.root = new Node()
}
exports.BTree = BTree

BTree.degree = 2

BTree.prototype.search = function(key) {
  return this.root.search(key)
}

BTree.prototype.insert = function(key, value) {
  if (this.root.isFull()) {
    var oldRoot = this.root
    this.root = new Node()
    this.root.children.push(oldRoot)
    this.root.split(0)
  }

  this.root.insert(key, value)
}

BTree.prototype.inspect = function() {
  return this.root.inspect()
}


function Node() {
  this.children = []
  this.keys = []
  this.values = []
}

Node.prototype.isLeaf = function() {
  return this.children.length === 0
}

Node.prototype.isFull = function() {
  return this.keys.length >= 2 * BTree.degree - 1
}

Node.prototype.search = function(key) {
  var i = 0
  while (key > this.keys[i]) i++

  if (key === this.keys[i]) {
    return this.values[i]
  } else if (this.isLeaf()) {
    return // Not found
  }

  return this.children[i].search(key)
}

Node.prototype.insert = function(key, value) {
  var i = 0
  while (key > this.keys[i]) i++

  if (this.isLeaf()) {
    this.keys.splice(i, 0, key)
    this.values.splice(i, 0, value)
  } else {
    var child = this.children[i]

    if (child.isFull()) {
      this.split(i)
    }

    child.insert(key, value)
  }
}

Node.prototype.split = function(i) {
  var splitChild = this.children[i]
  var newChild = new Node()

  var middle = BTree.degree - 1

  newChild.keys = splitChild.keys.splice(middle + 1)
  newChild.values = splitChild.values.splice(middle + 1)
  newChild.children = splitChild.children.splice(middle + 1)

  this.children.splice(i + 1, 0, newChild)

  this.keys.splice(i, 0, splitChild.keys[middle])
  this.values.splice(i, 0, splitChild.values[middle])

  splitChild.keys.splice(middle)
  splitChild.values.splice(middle)
}

Node.prototype.inspect = function(indent) {
  indent = indent || ""
  var out = indent + this.keys.join(', ')
  this.children.forEach(function(child, i) {
    out += "\n" + child.inspect(indent + "  ")
  })
  return out
}
