import React from 'react';
import classes from './Button.module.css'

export default function Button(props) {
  return (<button 
  style={props.size === "large" 
  ? ({width: 300, height: 45, margin: 20}) : ({})} className={classes.button}
  onClick={props.onClick}
  >
  {props.children}</button>);
}
