var assert = require('assert'),
    BTree = require('../lib/btree').BTree

describe('BTree', function() {
  before(function () {
    this.tree = new BTree()
  })

  // Based on example on http://www.cs.utexas.edu/users/djimenez/utsa/cs3343/lecture17.html

  it('insert 5', function () {
    this.tree.insert(5, 5)

    assert.equal(this.tree.inspect(), "5")
    assert.equal(this.tree.search(5), 5)
  })

  it('insert 9', function () {
    this.tree.insert(9, 9)

    assert.equal(this.tree.inspect(), "5, 9")
    assert.equal(this.tree.search(5), 5)
  })

  it('insert 3', function () {
    this.tree.insert(3, 3)

    assert.equal(this.tree.inspect(), "3, 5, 9")
  })

  it('insert 7', function () {
    this.tree.insert(7, 7)

    assert.equal(this.tree.inspect(), "5\n" +
                                      "  3\n" +
                                      "  7, 9")
    assert.equal(this.tree.search(7), 7)
  })

  it('insert 1', function () {
    this.tree.insert(1, 1)

    assert.equal(this.tree.inspect(), "5\n" +
                                      "  1, 3\n" +
                                      "  7, 9")
  })

  it('insert 2', function () {
    this.tree.insert(2, 2)

    assert.equal(this.tree.inspect(), "5\n" +
                                      "  1, 2, 3\n" +
                                      "  7, 9")
  })

  it('insert 8', function () {
    this.tree.insert(8, 8)

    assert.equal(this.tree.inspect(), "5\n" +
                                      "  1, 2, 3\n" +
                                      "  7, 8, 9")
  })

  it('insert 6', function () {
    this.tree.insert(6, 6)

    assert.equal(this.tree.inspect(), "5, 8\n" +
                                      "  1, 2, 3\n" +
                                      "  6, 7\n" +
                                      "  9")
  })

  it('insert 0', function () {
    this.tree.insert(0, 0)

    assert.equal(this.tree.inspect(), "2, 5, 8\n" +
                                      "  0, 1\n" +
                                      "  3\n" +
                                      "  6, 7\n" +
                                      "  9")
  })

  it('insert 4', function () {
    this.tree.insert(4, 4)

    assert.equal(this.tree.inspect(), "5\n" +
                                      "  2\n" +
                                      "    0, 1\n" +
                                      "    3, 4\n" +
                                      "  8\n" +
                                      "    6, 7\n" +
                                      "    9")
  })

  for (var i = 0; i <= 9; i++) {
    (function(i) {

      it('search for ' + i, function() {
        assert.equal(this.tree.search(i), i)
      })
      
    })(i)
  }
})
