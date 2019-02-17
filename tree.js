/*******************************************************************************
                                     Notes
    It's debatable whether to use regex for strip and validate given that it
    tends to be slower than using regular str obj methods. This will probably be
    have to revisited if speed is an issue.

*******************************************************************************/

/*******************************************************************************
                             Start string functions
*******************************************************************************/

// Escapes certain characters in strings to be used in regex expressions
const regexEscape = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

// Strips a node string of its outermost separators
const strip = (str, sep1, sep2) => {
    return str.replace(new RegExp('^' + regexEscape(sep1), 'g'), '').
               replace(new RegExp(regexEscape(sep2) + '$', 'g'), '')
}

// Trims space characters from the extremes of a string (not all whitespace)
const trimSpace = str => str.replace(/^\040+|\040+$/g, '')

// Returns true if the counts of sep1 and sep2 in str are equal, false otherwise
const validate = (str, sep1, sep2) => {
    return (str.match(new RegExp(regexEscape(sep1), "g")) || []).length ==
           (str.match(new RegExp(regexEscape(sep2), "g")) || []).length
}

/*******************************************************************************
                                    extract
    Given a node expression, extract the category and its content, if any.
    A node containing content is terminal (i.e. has no children e.g. 'N noun').
    The function assumes that strip() has been applied to str first.
*******************************************************************************/

const extract = (str, sep1, sep2) => {
    if (str.indexOf(sep1) == -1) {
        if (str.indexOf(' ') == -1) {
            return [str.substring(0, str.indexOf(sep2)), undefined]
        }
        else {
            return str.split(' ').map(el => trimSpace(el)) //el.trim()
        }
    } else {
        return [undefined, trimSpace(str.substring(0, str.indexOf(sep1)))]
    }
}

/*******************************************************************************
                              End string functions
*******************************************************************************/

/*******************************************************************************
                           Start top-level functions
*******************************************************************************/

/*******************************************************************************
                                    initNode
    Given a name and a category, returns a new node (constituent) object.
    Node objects contain info relating to a word's category (e.g. POS) in
    addition to its content. As implemented in JSyntax, nodes are either of the
    type |name: undefined, category: _, ...| or |name: _, category: _, ...|.
    The former contains subconstituents; the latter is terminal.
*******************************************************************************/

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

/*******************************************************************************
                                 constructTree
    Given a string, a start separator, an end separator, and a parent node,
    produces a new tree initialized at parent.
    Returns true if validate returns true, otherwise false.
    str is an argument vector formed with a valid syntactic notation; it sets
    definitions for nodes, the subconstituents of said nodes, etc.

    The nature of the parser enforces constituency-based relations, although one
    caveat is that terminal nodes have a category and its content together in
    one node. This is not a technical necessity but just a matter of preference.
*******************************************************************************/

function constructTree (str, sep1, sep2, parent) {
    if (!validate(str, sep1, sep2))
        return false

    // Clean str, store info about the node, and initialize node
    str = strip(str, sep1, sep2)
    const [content, phrase] = extract(str, sep1, sep2)
    let node = parent.attachChild(initNode(phrase, content))

    // In the case of a terminal node
    if (content != undefined && phrase != undefined)
        return true

    str = str.substring(str.indexOf(sep1))

    // Set up counters
    let sep1_ct = 0, sep2_ct = 0, gen = str[Symbol.iterator]()
    let lst_acc = [], str_acc = ''

    while (true) {
        let char = gen.next()
        switch (true) {
            // Compare sep1_ct and sep2_ct to capture child nodes
            case char.value == sep1:
                sep1_ct++, str_acc += char.value
                break
            case char.value == sep2:
                sep2_ct++, str_acc += char.value
                if (sep1_ct == sep2_ct)
                    lst_acc.push(str_acc), str_acc = ''
                break
            default:
                str_acc += (char.value === undefined ? '' : char.value)
                if (char.done == true) {
                    for (el of lst_acc) {
                        constructTree(el, sep1, sep2, node)
                    }
                    return true
                }
                break
        }    }
}

// Helper function to help test that a tree has been correctly generated
const treeTester = (head) => {
  for (child of head.children) {
    console.log(`${child.name} (${child.category}) is a child of ${head.name} (${head.category})`)
    if (child.children != undefined)
      treeTester(child)
  }
}

/*******************************************************************************
                            End top-level functions
*******************************************************************************/

exports.constructTree = constructTree
exports.initNode = initNode
