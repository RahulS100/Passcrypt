import React, {useState} from 'react';
import {Container, Segment, Form, Input, Button, Label, Divider, Header } from 'semantic-ui-react';
import Link from 'next/link';
import axios from 'axios';
import baseUrl from '../Helper/baseUrl';
import cookie from 'js-cookie';
import {useRouter} from 'next/router';

export default function AuthLogin() {

  //router for navigation
  const router = useRouter();

  //Password Show Hide Toggle State
  const [showPass, setShowPass] = useState(false);

  //loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //Show Hide Password Toggle
  function showHidePass() {
    setShowPass(prev => !prev);
  }

  //Form Submition Hander
  async function onLogin(e) {

    const user = {
      email: e.target[0].value,
      password: e.target[1].value
      }

      try {
  //making a post request for registering a new User     
  setLoading(true);
  const res = await axios.post(`${baseUrl}/api/auth/login`, user);
  const {token} = res.data;
        setLoading(false);

  if(token) {
    cookie.set("token", token);
    router.push('/user');
  }

} catch(err) {
  setLoading(false);
  setError(err.response.data.message);
    }
}



return <Container as='div' className='padding25'>
    <Segment padded>

  {error && <Header content={error} color='red' as='h4' />}

        <Form onSubmit={onLogin}>
          <Label icon="mail" content="Email" size='large' />
          <Input type='email' placeholder="Email" fluid className='marginB10 marginT2' required />
          <Label icon="key" content="Password" size='large' />
          <Input type={showPass ? 'text' : 'password'} placeholder="Password"
           fluid className='marginB10 marginT2'
           icon={{name: "eye", onClick: showHidePass, circular: true, link: true }}
            iconPosition='left' required />
          <Button secondary loading={loading}>Login</Button>
        </Form>
        <Divider hidden />

        <Header size='small' >
        <Link href='/reset'>Forgot password?</Link>
        </Header>
    </Segment>
  </Container>;
}
