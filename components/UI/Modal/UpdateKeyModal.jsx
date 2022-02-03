import React, { useState } from 'react';
import { Modal, Button, Form, Input, Label } from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../../../Helper/baseUrl';
import Cookies from 'js-cookie';


//key updation modal
export default function ModalKeyUpdation({passkey, setShowModal, showModal, setKeys}) {


  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);


  //function for handling the key submission
  async function addKey(e) {
     const updateData = {}

     if(passkey.keyfor !== e.target[0].value) updateData.keyfor = e.target[0].value;
     if(passkey.key !== e.target[1].value) updateData.key = e.target[1].value;

     const token = Cookies.get('token');

     //make post request to post the key data to the server
     setLoading(true);
     await axios.put(`${baseUrl}/api/user/keys/update/${passkey.id}`, updateData, {headers: {authorization: token}});
     setLoading(false);
     //set the show model to false so when the key this submitted then
     //then modal must be gone
     setShowModal(false);

     //reload the page for again reload all keys data
     setKeys(true);
  }


  return (
      <>
    <Modal onClose={() => setShowModal(false)} open={showModal}>
    <Modal.Header>Update the Key</Modal.Header>

    <Modal.Content>
        <Form onSubmit={addKey}>
          <Label content="Update KeyFor" size='large' />
          <Input type='text' placeholder="keyfor" fluid className='marginB10 marginT2' required 
            value={passkey.keyfor}
          />

          <Label icon="key" content="Key" size='large' />
          <Input type={showKey ? 'text' : 'password'} placeholder="Key"
           fluid className='marginB10 marginT2'
           icon={{name: "eye", onClick: () => {setShowKey(prev => !prev)}, circular: true, link: true }}
            iconPosition='left' required />

          <Button
          type="submit"
          content="Update"
          labelPosition='right'
          icon='edit'
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
