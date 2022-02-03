import React from 'react';
import classes from './Heading.module.css';
import Button from '../UI/Button';
import { useRouter } from 'next/router';

export default function Heading() {

    const router = useRouter();

function signUpHandle() {
    router.push('/signup');
}


  return <div className={classes.headingContainer}>
        <h1 className={classes.landingHeading}>PassCrypt</h1>
        <p className={classes.landingSubheading}>The Password Keeper Tool Keeps Your Passwords Safe</p>
        <Button size="large" onClick={signUpHandle}>Signup</Button>
  </div>;
}
