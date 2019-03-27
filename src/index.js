import React from 'react';
import ReactDOM from 'react-dom'
import {constructTree, initNode} from './tree.js';
import {update} from './generate.js';
import Tree from './Tree-app'
import './style.css';

 ReactDOM.render(
  <Tree />, document.getElementById('root')
 )
