import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {Container, Segment, Form, Input, Button, Label, Header } from 'semantic-ui-react';
import baseUrl from '../../Helper/baseUrl';

//reset page for sending the reset mail to the user
export default function Reset() {

const [loading, setLoading] = useState(false);
const [error, setError] = useState(null); 
const [submit, setSubmit] = useState(null);

//on submit the mail for reset
async function onSubmit(e) {

const email = e.target[0].value;

try {
    setLoading(true)
    await axios.post(`${baseUrl}/api/reset`, {email});
    setLoading(false);
    //reseting the email field
    e.target[0].value = '';
    setSubmit("Sended, Check Your Mail")
} catch (err) {
    setError(err.response.data.message);
    setLoading(false);
}
}

//useEffect for removing the success flag
useEffect(() => {

    if(error) {
        const timeout = setTimeout(() => {
            setSubmit(null);
            setError(null);
        }, 5000);
    
        return () => {
            clearTimeout(timeout);
        }
    }
});


return (
<Container as='div' className='padding25'>
    <Segment padded>
    
        {/*if form is submitted successfully set the submitted flag */}
        {submit && <Header content={submit} color='green' className='padding20' />}
        {error && <Header content={error} color='red' className='padding20' />}
        
        <Form onSubmit={onSubmit}>
          <Label icon="mail" content="Email" size='large' />
          <Input type='email' placeholder="Email" fluid className='marginB10 marginT2' required />
          <Button loading={loading} type="submit" positive>Submit</Button>
        </Form>
    </Segment>
  </Container>
);
}
