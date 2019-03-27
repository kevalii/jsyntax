import React, {Component} from 'react';
import {constructTree, initNode} from './tree.js';
import {update} from './generate.js';
import AceEditor from 'react-ace'

class Tree extends Component {
  constructor(props) {
    super(props)
    this.state = {text: ""}
  }
  getData = data => this.setState({text: data})
  render = () => {
    const head = initNode('Tree', undefined)
    const getData = data => data

    constructTree('[S [NP [DET The][N koala]][VP [V ran]]]', '[', ']', head)
    //constructTree('[S [NP [DET ∅][N Susan]][VP [V thought][CP [C that][S [NP [DET ∅][N Harry]][VP [V knew][CP [C that][S [NP [DET his][N neighbor]][VP [V had hatched][NP [DET an][AdjP [AdvP [Adv extremely]][AdjP [Adj intricate]]][N plan][PP [P of][NP [DET ∅][AdjP [Adj credit card]][N fraud]]]][PP [P by][NP [DET the][N end][PP [P of][NP [DET the][N summer]]]]]]]]]]]]]', '[', ']', head)
    console.log(head)
    return (
      <div id="app">
        <div id="svg">
          {update(head)}
        </div>
        <Editor getData={this.getData}/>
      </div>
    )
  }
}

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {text: ""}
  }
  onChange = (val, e) => {
    this.setState({text: val})
  }
  onSubmit = e => {
    this.props.getData(this.state.text)
    console.log(e)
    e.preventDefault()
  }
  render = () => {
    return (
      <div id="ace-editor">
        <AceEditor
          mode="java"
          theme="github"
          onChange={this.onChange}
          value={this.state.text}
          name="editor"
          editorProps={{$blockScrolling: true}}
        />
        <form onSubmit={this.onSubmit}>
          <button type="submit">Render</button>
        </form>
      </div>
    )
  }
}

export default Tree;
