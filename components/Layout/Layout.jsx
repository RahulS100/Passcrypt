import React from 'react';
import Navbar from './Nav/Navbar';

export default function Layout(props) {
  return <>
    <Navbar />
    {props.children}
  </>;
}
