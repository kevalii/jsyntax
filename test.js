/*
Notes
        It's debatable whether to use regex for strip and validate given
    that it tends to be slower than using regular str obj methods. This will probably
    be have to revisited if speed is an issue.

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

// Strips a node string of its outermost brackets
const strip = (str) => str.replace(/^\[/g, '').replace(/\]$/g, '')

// Returns true if the counts of sep1 and sep2 in str are equal, false otherwise
const validate = (str, sep1, sep2) => {
    const regexEscape = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    return (str.match(new RegExp(regexEscape('['), "g")) || []).length == (str.match(new RegExp(regexEscape(']'), "g")) || []).length
}

/*
    Given a node expression, extract the category and its content, if any
    A node containing content has no children e.g. '[N noun]'
    The function assumes that strip() has been applied to str first
*/
const extract = (str, sep1, sep2) => {
    if (str.indexOf(sep1) == -1) {
        if (str.indexOf(' ') == -1) {
            return [str.substring(0, str.indexOf(sep2)), undefined]
        }
        else {
            return str.split(' ').map(el => el.trim())
        }
    } else {
        return [undefined, str.substring(0, str.indexOf(sep1)).trim()]
    }
}

// Accepts a node and returns its child nodes in a list
function vectorize (str, sep1, sep2, parent) {
    // Clean str, store info about the node, and initialize node
    str = strip(str)
    const [content, phrase] = extract(str, sep1, sep2)
    let node = parent.attachChild(initNode(phrase, content))

    // A node whose content and category are both defined is a terminal node
    if (content != undefined && phrase != undefined)
        return
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
                        vectorize(el, sep1, sep2, node)
                    }
                    return
                }
                break
        }    }
}

let head = initNode('Tree', undefined)
vectorize('[S [NP [DET The][N koala]][VP [V ran][PP [P to][NP [DET the][N store]]]]]', '[', ']', head)

let treeTester = (head) => {
  for (child of head.children) {
    console.log(`${child.name} (${child.category}) is a child of ${head.name} (${head.category})`)
    if (child.children != undefined)
      treeTester(child)
  }
}

treeTester(head)
