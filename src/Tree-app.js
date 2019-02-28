import React, {Component} from 'react';
import {constructTree, initNode} from './tree.js';
import {update} from './generate.js';
import AceEditor from 'react-ace'

class Tree extends Component {
  constructor(props) {
    super(props)
  }
  render = () => {
    const head = initNode('Tree', undefined)
    constructTree('[S [NP [DET The][N koala]][VP [V ran]]]', '[', ']', head)
    return (
      <div id="app">
        <div id="svg">
          {update(head)}
        </div>
        <div id="editor">
          <AceEditor />
        </div>
      </div>
    )
  }
}


export default Tree;
