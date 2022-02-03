import React, {useState} from 'react';
import {Container, Segment, Form, Input, Button, Label, Divider, Header } from 'semantic-ui-react';
import Link from 'next/link';
import axios from 'axios';
import baseUrl from '../Helper/baseUrl'
import { useRouter } from 'next/router';
import cookie from 'js-cookie';

export default function Signup() {

  //router for navigation
  const router = useRouter();

  //Password Show Hide Toggle State
  const [showPass, setShowPass] = useState(false);

  //loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Show Hide Password Toggle
  function showHidePass() {
    setShowPass(prev => !prev);
  }

  //Form Submition Hander
  async function onSigup(e) {

    const newUser = {name: e.target[0].value,
    email: e.target[1].value,
    password: e.target[2].value
    }

    try {
      //making a post request for registering a new User
        setLoading(true);
        const res = await axios.post(`${baseUrl}/api/auth`, newUser);
        const {token} = res.data;
        setLoading(false);
      if(token) {
        cookie.set("token", token);
        router.push('/user');
      }

    } catch(e) {
      setLoading(false);
      setError(e.response.data.message);
    }
    
  }



return <Container as='div' className='padding25'>

    <Segment padded>

    {error && <Header color='red' as='h4' content={error} />}

        <Form onSubmit={onSigup}>
          <Label icon="user" content="Name" size='large' />
          <Input type='text' placeholder="Name" fluid className='marginB10 marginT2' required />
          <Label icon="mail" content="Email" size='large' />
          <Input type='email' placeholder="Email" fluid className='marginB10 marginT2' required />
          <Label icon="key" content="Password" size='large' />
          <Input type={showPass ? 'text' : 'password'} placeholder="Password"
           fluid className='marginB10 marginT2'
           icon={{name: "eye", onClick: showHidePass, circular: true, link: true }}
            iconPosition='left' required />
          <Button secondary content='Sigup' type="submit" loading={loading} />
        </Form>
        <Divider hidden />
        <Header size='small' >
        Already have a Account? <Link href='/login'>Login</Link>
        </Header>
    </Segment>
  </Container>;
}