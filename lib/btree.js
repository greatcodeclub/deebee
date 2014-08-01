// ...


// Uncomment these and use btree.inspect() to dump the internal structure of
// a tree to string.

// BTree.prototype.inspect = function() {
//   return this.root.inspect()
// }

// Node.prototype.inspect = function(indent) {
//   indent = indent || ""
//   var out = indent + this.keys.join(', ')
//   this.children.forEach(function(child, i) {
//     out += "\n" + child.inspect(indent + "  ")
//   })
//   return out
// }
