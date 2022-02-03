import React, {useState} from 'react';
import {Container, Segment, Form, Input, Button, Label, Header } from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../../Helper/baseUrl';
import { useRouter } from 'next/router';

export default function Token() {
  
    //Password Show Hide Toggle State
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
    const [submit, setSubmit] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    //password reset handler
    async function changePassword(e) {
        const {token} = router.query;

        const passData = {
                newpassword: e.target[0].value,
                token: token
        }


        try {
            setLoading(true);
            await axios.post(`${baseUrl}/api/reset/token`, passData);
            setSubmit("Password Reset Success");
            setLoading(false);          
            router.push('/login');
        } catch (err) {
            console.log("Submit new Password:- ", err.message);
            setError(err.response.data.message);
            setLoading(false);
        }
    } 


   
return (
        <Container as='div' className='padding25'>
            <Segment padded>
            
                {/*if form is submitted successfully set the submitted flag */}
                {error && <Header content={error} color='red' className='padding20' />}
                {submit && <Header content={submit} color='green' className='padding20' />}
                
                <Form error={error} onSubmit={changePassword}>
                <Label icon="key" content="New Password" size='large' />
          <Input type={showPass ? 'text' : 'password'} placeholder="New Password"
           fluid className='marginB10 marginT2'
           icon={{name: "eye", onClick: () => {setShowPass(prev => !prev)}, circular: true, link: true }}
            iconPosition='left' required />
                  <Button loading={loading} type="submit" positive>Update</Button>
                </Form>
            </Segment>
          </Container>
);

}
