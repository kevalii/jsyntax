var d3 = require('d3')

/* initNode : string name -> node
 * Generates a new node. This is the systematic method of producing a node object.
 */
const initNode = (name, category) => {
  return {
    name: name,
    category: category,
    children: [],
    attachChild: function (child) {
      return this.children[this.children.push(child) - 1]
    }
  }
}

/* grantChildren : parent_node, [nodes] -> parent_node
 * Given a parent and a list of child nodes, grant the parent its children.
 * This is distinguished from a node's attachChild method because it enables us
 * to build a tree from the ground-up as opposed to from the head-down.
*/
const grantChildren = (parent, children) => {
  children.map(child => parent.attachChild(child))
  return parent
}

/* splitPreserve : string, separating character # 1, separating character # 2
 * A implementation of that splits at the division of two characters and preserves
 * those characters in the respective items of the returned list. INCOMPLETE
 * strip is adapted from the accepted answer to https://stackoverflow.com/a/32516190/11043049
 */

const splitPreserve = (str, sep1, sep2) => {
  // Remove brackets from the end of the string
  //const [v1, v2] = [str.indexOf(sep2), str.lastIndexOf(sep1)]
  //const argv = str.substring(v1, v2)
  //return argv
  //.split(sep1 + sep2)
  return str.split(sep1 + sep2).map(item => {

    if (item.startsWith(sep2) || item.includes(sep2))
      return item + sep1
    else if (item.endsWith(sep1))
      return sep2 + item
    else if (argv.length != 1)
      return sep2 + item + sep1
    else
      return item
  })
}

const strip = (string) => string.replace(/^\[/g, '').replace(/\]$/g, '')

// [S [NP [DET The][N koala]]]
// right now the issue is that it doesn't read the args of a nested node
const parser = (p, firstChar, secondChar, node) => {
  const [i, j] = [p.indexOf(firstChar), p.indexOf(secondChar, p.indexOf(firstChar))]

  // If the next character is firstChar, then generate a new node
  if (p.indexOf(firstChar) != -1) {
    node.attachChild(initNode(p))
  } else if (p.indexOf(firstChar) != -1) {
      // We initialize a child node with the syntactic symbol
      const sym = p.substring(i + 1, p.indexOf(' ', i))
      console.log(sym)
      const child = node.attachChild(initNode(sym))
      if (p.indexOf(' ', i)) {
        p = p.substring(p.indexOf(' ', i) + 1)
      }

      let items = splitPreserve(strip(p), ']', '[')
      console.log(items)
      for (item of items) {
        parser(item, firstChar, secondChar, child)
      }
    }
}


let treeTester = (head) => {
  for (child of head.children) {
    console.log(`${child.name} (${child.category}) is a child of ${head.name} (${head.category})`)
    if (child.children != undefined)
      treeTester(child)
  }
}

// Testing
/*
let head = initNode('Tree', 'test')
let child = head.attachChild(initNode('', 'S'))
let oneth = child.attachChild(initNode('', 'NP'))
let twoeth = child.attachChild(initNode('', 'VP'))
oneth.attachChild(initNode('The', 'DET'))
oneth.attachChild(initNode('koala', 'N'))
twoeth.attachChild(initNode('ran', 'V'))
treeTester(head)
*/

console.log(splitPreserve('[S [NP [DET The][N koala]][VP [V ran][PP [P to][NP [DET the][N store]]]]]', ']', '['))
 //parser('[S [NP [DET the][N koala]][VP ran][PP to]]', '[', ']', head)

//console.log(head.children[0].children[0].children[0])
//var head = initNode('Tree')
//argParser('[S [NP The koala][VP [V created][NP a syntax tree]]]', head)
//console.log(head.children)
/*
const child_with_child = initNode('word')
child_with_child.attachChild(initNode('ex'))
const some_nodes = [child_with_child, initNode('y'), initNode('ness')]
const a_parent = grantChildren(initNode('wordiness'), some_nodes)
console.log(a_parent)
/const head = d3.hierarchy(a_parent)
var cluster = d3.cluster()
cluster.size([400, 400])
console.log(head)

const argParser = (arg, node) => {
  const [first, second] = [arg.indexOf('[') + 1, arg.indexOf(']') + 1]

  if (first == 0)
    return

  const selection = arg.substring(first, (second == arg.length) ? second - 1: second)
  const category = selection.substring(0, selection.indexOf(' '))

  // Testing statements
  console.log(`original: ${arg}`)
  console.log(`selection: ${selection}`)
  console.log(`category: ${category}`)

  const r1 = initNode(category)
  const reference = node.attachChild(r1)

  //console.log(reference)
  //console.log(node.children)
  // argParser(selection, node)
  if (selection.indexOf(']') != -1)
    argParser(arg.substring(second, arg.lastIndexOf(']')), node.children[reference - 1])
} */

// Notes
/*
  d3.hierarchy should only be called on the head; that is, the completed tree.
  Mutating the structure of the tree afterwards is to be avoided.
*/
