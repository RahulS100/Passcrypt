import React, { useState } from 'react';
import { Modal, Button, Form, Input, Label, Header } from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../../../Helper/baseUrl';
import Cookies from 'js-cookie';


//for showing any kind of modal
export default function ModalForUpdation({user, setUser, setShowModal, showModal}) {


  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState(null);


  //on password change method
  function onPasswordEnter(e) {
    setError(null);
  }


  //function for handling the key submission
  async function addKey(e) {
     const updateData = {
       name: e.target[0].value,
       email: e.target[1].value,
       password: e.target[2].value
     }

     const token = Cookies.get('token');

     try {
      //make post request to post the key data to the server
     setLoading(true);
     await axios.put(`${baseUrl}/api/user/profile/update`, updateData, {headers: {authorization: token}});
     setLoading(false);

     //set the show model to false so when the key this submitted then
     //then modal must be gone
     setShowModal(false);

      //Update the profile state
      setUser({name: updateData.name ? updateData.name : user.name, email: updateData.email});
     } catch (err) {
       setError(err.response.data.message);
       setLoading(false);
     }
  }


  return (
      <>
    <Modal onClose={() => setShowModal(false)} open={showModal}>
    <Modal.Header>Update Profile</Modal.Header>

    <Modal.Content>

    {error && <Header content={error} color='red' className='padding20'/>}

        <Form onSubmit={addKey}>
          <Label icon="person" content="Name for updating" size='large' />
          <Input type='text' placeholder="Name" fluid className='marginB10 marginT2' />
          <Label icon="email" content="Email for updating" size='large' />
          <Input type='email' placeholder="Email" fluid className='marginB10 marginT2' required />

          <Label icon="key" content="Password" size='large' />
          <Input type={showKey ? 'text' : 'password'} placeholder="Key"
           fluid className='marginB10 marginT2'
           icon={{name: "eye", onClick: () => {setShowKey(prev => !prev)}, circular: true, link: true }}
            iconPosition='left' required onChange={onPasswordEnter} />

          <Button
          type="submit"
          content="Update"
          labelPosition='right'
          icon='key'
          positive
          loading={loading}
        />

        </Form>
    </Modal.Content>

    {/* Put Any Action Here, Close Button or Continue Buttons Etc. */}
    <Modal.Actions>
    <Button color='black' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
    </Modal.Actions>
    </Modal>
      </>
  );
}
