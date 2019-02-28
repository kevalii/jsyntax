import React from 'react';
import ReactDOM from 'react-dom'
import {constructTree, initNode} from './tree.js';
import {update} from './generate.js';
import Tree from './Tree-app'
import './style.css';
import {Ace} from 'ace-builds'
 //constructTree('[S [NP [DET The][N koala]][VP [V ran][PP [P to][NP [DET the][N store]]]]]', '[', ']', head)

 ReactDOM.render(
  <Tree />, document.getElementById('root')
 )
Ace.edit("editor")
