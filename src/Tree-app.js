import React, {Component} from 'react';
import {constructTree, initNode, validate} from './tree.js';
import {update} from './generate.js';
import AceEditor from 'react-ace'
import 'brace/theme/cobalt'

class Tree extends Component {
  constructor(props) {
    super(props)
    let defaultTree = initNode('Tree', undefined)
    constructTree('[S [NP [DET The][N koala]][VP [V ran]]]', '[', ']', defaultTree)
    this.state = {text: "", tree: defaultTree}
  }
  getData = data => {
    console.log(validate(data, '[', ']'))
    if (validate(data, '[', ']')) {
      const tree = initNode('Tree', undefined)
      constructTree(data, '[', ']', tree)
      console.log(tree)
      this.setState({text: data, tree: tree})
    }
  }
  render = () => {
    const getData = data => data
    // constructTree('[S [NP [DET The][N koala]][VP [V ran]]]', '[', ']', head)
    //constructTree('[S [NP [DET ∅][N Susan]][VP [V thought][CP [C that][S [NP [DET ∅][N Harry]][VP [V knew][CP [C that][S [NP [DET his][N neighbor]][VP [V had hatched][NP [DET an][AdjP [AdvP [Adv extremely]][AdjP [Adj intricate]]][N plan][PP [P of][NP [DET ∅][AdjP [Adj credit card]][N fraud]]]][PP [P by][NP [DET the][N end][PP [P of][NP [DET the][N summer]]]]]]]]]]]]]', '[', ']', head)
    //console.log(head)
    console.log(this.state.tree)
    return (
      <div id="app">
        <Editor getData={this.getData}/>
        <div id="svg">
          {update(this.state.tree)}
        </div>
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
    console.log(e)
    this.props.getData(this.state.text)
    e.preventDefault()
  }
  render = () => {
    return (
      <div id="ace-editor">
        <AceEditor
          theme="cobalt"
          onChange={this.onChange}
          value={this.state.text}
          name="editor"
          editorProps={{$blockScrolling: true}, {$setUseSoftTabs: false}}
        />
        <form onSubmit={this.onSubmit}>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" value="true" id="wsCheck">
            </input>
            <label className="form-check-label" htmlFor="wsCheck">
              Whitespace mode
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Render</button>
        </form>
      </div>
    )
  }
}

export default Tree;
