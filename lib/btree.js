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
  var i = 1
  while (i <= this.keys.length && key > this.keys[i-1]) {
    i++
  }

  // now i is the least index in the key array such that
	// key <= keys[i], so k will be found here or
	// in the i'th child

  if (i <= this.keys.length && key == this.keys[i-1]) {
    return this.values[i-1]
  } else if (this.leaf) {
    return
  }

  // We could potentially read child block from disk here.
  return this.children[i-1].search(key)
}

Node.prototype.isFull = function() {
  return this.keys.length >= 2 * BTree.degree - 1
}

Node.prototype.insert = function(key, value) {
  var i = this.keys.length - 1

  if (this.leaf) {
    // shift everything over to the "right" up to the
		// point where the new key k should go
    while (i >= 0 && key < this.keys[i]) {
      this.keys[i+1] = this.keys[i]
      this.values[i+1] = this.values[i]
      i--
    }

    this.keys[i+1] = key
    this.values[i+1] = value

  } else {
    // find child where new key belongs:
    while (i >= 0 && key < this.keys[i]) {
			i--
		}

    // if key is in children[i], then key <= keys[i]
		// we'll go back to the last key (least i) where we found this
		// to be true, then read in that child node
    i++

    // HINT: Now would be the time to read children[i] from disk.
    var child = this.children[i]

    if (child && child.isFull()) {
      // uh-oh, this child node is full, we'll have to split it
      this.split(i, child)

      // now children[i] and children[i+1] are the new children,
			// and keys[i] may have been changed.
			// we'll see if key belongs in the first or the second

			if (key > this.keys[i]) i++
    }

    child.insert(key, value)
  }
}

Node.prototype.split = function(i, y) {
  var z = new Node()

  // new node is a leaf if old node was
  z.leaf = y.leaf

  // copy over the "right half" of y into z
  for (var j = 0; j < BTree.degree - 1; j++) {
    z.keys[j] = y.keys[j + BTree.degree]
    z.values[j] = y.values[j + BTree.degree]
  }

  // copy over the child if y isn't a leaf
	if (!y.leaf) {
    for (var j = 0; j < BTree.degree; j++) {
      z.children[j] = y.children[j + BTree.degree]
    }
    y.children.splice(BTree.degree)
	}

  // shift everything in x over from i+1, then stick the new child in x;
	// y will half its former self as ci[x] and z will
	// be the other half as ci+1[x]
  for (var j = this.keys.length; j >= i; j--) {
    this.children[j+1] = this.children[j]
  }
  this.children[i+1] = z

  // the keys have to be shifted over as well...
  for (var j = this.keys.length - 1; j >= i; j--) {
    this.keys[j+1] = this.keys[j]
    this.values[j+1] = this.values[j]
  }

  // ...to accomodate the new key we're bringing in from the middle
	// of y (if you're wondering, since (t-1) + (t-1) = 2t-2, where
	// the other key went, its coming into x)
	this.keys[i] = y.keys[BTree.degree - 1]
	this.values[i] = y.values[BTree.degree - 1]

  // having "chopped off" the right half of y, it now has t-1 keys
  y.keys.splice(BTree.degree - 1)
}

Node.prototype.inspect = function(indent) {
  indent = indent || ""
  var out = indent + this.keys.join(', ')
  this.children.forEach(function(child, i) {
    out += "\n" + child.inspect(indent + "  ")
  })
  return out
}
