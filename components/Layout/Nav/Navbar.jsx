import React from 'react';
import classes from './Navbar.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { logout } from '../../../Helper/helper';
import {Link} from 'next/link';
import Head from 'next/head';

export default function Navbar() {
  const router = useRouter();

  //check if we are authenticated or not
  //if it is there change the navbar button to logout
  const isToken = !!Cookies.get('token');


  return <>

  <Head>
    <title>PassCrypt</title>
    <meta name='description' content='PassCrypt a password keeper utility for you, never ever need to remamber the password' />
    <link rel='icon' href='/favicon.ico' />
  </Head>

  <div className={classes.navbar}>
    <h3 className={classes.logo} onClick={() => {isToken ? router.push('/user') : router.push('/')}}>PassCrypt</h3>
      <button className={classes.signupBtn} 
      onClick={() => {isToken ? logout() : (router.pathname === '/login' ? router.push('/signup') : router.push('/login'))}}
      >{isToken ? "Logout" : (router.pathname === '/login' ? "Signup" : "Login" )}</button>
  </div>
  </>
}
