// B-Tree implementation based on MIT's Analysis of Algorithms book.
// Online reference: http://www.cs.utexas.edu/users/djimenez/utsa/cs3343/lecture16.html

function BTree() {
  this.root = new Node()
  this.root.leaf = true
}
exports.BTree = BTree

// Degree (t) t >= 2
// Every node other than the root must have at least t-1 keys. Every internal node other than the root thus has at least t children.
// Every node can contain at most 2t-1 keys. Therefore, an internal node can have at most 2t children. We say that a node is full if it contains exactly 2t-1 keys.
BTree.degree = 2

BTree.prototype.search = function(key) {
  return this.root.search(key)
}

BTree.prototype.insert = function(key, value) {
  var node = this.root

  // Try to insert at the root (since it's likely in RAM). And split it if full.
  if (node.isFull()) {
    // Root is full, add a new one.
    this.root = new Node()
    this.root.leaf = false
    this.root.children.push(node)
    this.root.split(0, node)
    node = this.root
  }

  node.insert(key, value)
}

BTree.prototype.inspect = function() {
  return this.root.inspect()
}


function Node() {
  this.children = []
  this.keys = []
  this.values = []
  this.leaf = true
}

Node.prototype.search = function(key) {
  var i = 0

  // Advance up to the position where the key might be
  while (key > this.keys[i]) i++

  // now i is the least index in the key array such that
	// key <= keys[i], so key will be found here or
	// in the i'th child

  if (key === this.keys[i]) {
    return this.values[i]
  } else if (this.leaf) {
    return
  }

  return this.children[i].search(key)
}

Node.prototype.isFull = function() {
  return this.keys.length >= 2 * BTree.degree - 1
}

Node.prototype.insert = function(key, value) {
  // Find where the new key belongs.
  var i = 0
  while (key > this.keys[i]) i++

  if (this.leaf) {
    // shift everything over to the "right" up to the
    // point where the new key should go
    this.keys.splice(i, 0, key)
    this.values.splice(i, 0, value)

  } else {
    var child = this.children[i]

    if (child && child.isFull()) {
      // uh-oh, this child node is full, we'll have to split it
      this.split(i, child)

      // Now children[i] and children[i+1] are the new children,
			// and keys[i] may have been changed.

			// We see if key belongs in the first or the second
			if (key > this.keys[i]) i++
    }

    child.insert(key, value)
  }
}

// Split the `fullChild` node in the middle.
// Pulling the middle item in the parent node (`this`),
// and the right part in a new child node (`newChild`).
//
// Before the split:
//              this
//             /   
//   fullChild:[1,2,3]    
//
// After the split:
//             this:[2]
//             /    \
//   fullChild:[1]  newChild:[3]   
//
// i: index of fullChild in this.children.
Node.prototype.split = function(i, fullChild) {
  var newChild = new Node()

  // new node is a leaf if old node was
  newChild.leaf = fullChild.leaf

  // copy over the "right half" of y into z
  for (var j = 0; j < BTree.degree - 1; j++) {
    newChild.keys[j] = fullChild.keys[j + BTree.degree]
    newChild.values[j] = fullChild.values[j + BTree.degree]
  }

  // copy over the children if y isn't a leaf
	if (!fullChild.leaf) {
    for (var j = 0; j < BTree.degree; j++) {
      newChild.children[j] = fullChild.children[j + BTree.degree]
    }
    fullChild.children.splice(BTree.degree)
	}

  // shift everything in x over from i+1, then stick the new child in x;
	// y will half its former self as ci[x] and z will
	// be the other half as ci+1[x]
  for (var j = this.keys.length; j >= i; j--) {
    this.children[j+1] = this.children[j]
  }
  this.children[i+1] = newChild

  // the keys have to be shifted over as well...
  for (var j = this.keys.length - 1; j >= i; j--) {
    this.keys[j+1] = this.keys[j]
    this.values[j+1] = this.values[j]
  }

  // ...to accommodate the new key we're bringing in from the middle
	// of y (if you're wondering, since (t-1) + (t-1) = 2t-2, where
	// the other key went, its coming into x)
	this.keys[i] = fullChild.keys[BTree.degree - 1]
	this.values[i] = fullChild.values[BTree.degree - 1]

  // having "chopped off" the right half of y, it now has t-1 keys
  fullChild.keys.splice(BTree.degree - 1)
}

Node.prototype.inspect = function(indent) {
  indent = indent || ""
  var out = indent + this.keys.join(', ')
  this.children.forEach(function(child, i) {
    out += "\n" + child.inspect(indent + "  ")
  })
  return out
}
