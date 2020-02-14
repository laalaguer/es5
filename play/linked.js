/**
 * Node constructor.
 * @param {number} value 
 */
function Node(value) {
    this.value = value
    this.next = null
}

// get value stored in the Node
Node.prototype.getValue = function () {
    return this.value
}

// set next Node
Node.prototype.setNext = function (node) {
    this.next = node
}

// get next Node
Node.prototype.getNext = function () {
    return this.next
}

/**
 * Build a chain a -> b -> c -> null
 * @param {Array<any>} values 
 */
function buildAChain(values) {
    let nodes = []
    // set up nodes.
    for (let i = 0; i < values.length; i++) {
        nodes.push(new Node(values[i]))
    }
    // get them linked.
    for (let y = 0; y < nodes.length; y++) {
        if (y !== nodes.length - 1) {
            nodes[y].setNext(nodes[y+1])
        } else {
            nodes[y].setNext(null)
        }
    }
    // return the head of nodes.
    return nodes[0]
}

/**
 * Print all the nodes in the list.
 * @param {Node} node The head of the linked list.
 */
function printNodes(node) {
    let myPointer = node
    let values = []
    for (;;){
        if (myPointer !== null) {
            values.push(myPointer.getValue())
            myPointer = myPointer.getNext()
            continue
        } else {
            break
        }
    }
    // since we have collected values.
    // use Array.prototype.join
    console.log(values.join('->'))
}

/**
 * Reverse the linked list.
 * @param {Node} node The head of the linked list.
 * @returns {Node} The head of the reversed linked list.
 */
function reverseTheChain(node) {
    // if first node is null
    if (node === null) {
        return null
    }
    // if first node is the only element.
    if (node.getNext() === null) {
        return node
    }
    // node list contains more than 2 elements.
    let next = node.getNext()
    let current = node
    let previous = null

    for (;;) {
        current.setNext(previous) // reverse
        previous = current // move
        current = next // move
        next = next.getNext() // move

        if (next === null) { // reached the end of list.
            current.setNext(previous)
            break;
        }
    }
    return current
}

// Put to test!
var head = buildAChain([1,2,3,4,5,6])
printNodes(head)

var newHead = reverseTheChain(head)
printNodes(newHead)

var head = buildAChain([1,2])
printNodes(head)

var newHead = reverseTheChain(head)
printNodes(newHead)

var head = buildAChain([1])
printNodes(head)

var newHead = reverseTheChain(head)
printNodes(newHead)