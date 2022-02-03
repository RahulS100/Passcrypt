import React, { useState } from 'react';
import { Modal, Button, Form, Input, Label } from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../../../Helper/baseUrl';
import Cookies from 'js-cookie';


//for showing any kind of modal
export default function ModalShower({setShowModal, showModal, setKeys}) {


  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);


  //function for handling the key submission
  async function addKey(e) {
     const keyData = {
       keyfor: e.target[0].value,
       key: e.target[1].value
     }

     const token = Cookies.get('token');

     //make post request to post the key data to the server
     setLoading(true);
     await axios.post(`${baseUrl}/api/user/keys/newkey`, keyData, {headers: {authorization: token}});
     setLoading(false);
     //set the show model to false so when the key this submitted then
     //then modal must be gone
     setShowModal(false);

     //setting the reload false so we can refetch keys with id
     setKeys(true);
  }


  return (
      <>
    <Modal onClose={() => setShowModal(false)} open={showModal}>
    <Modal.Header>Add a New Key</Modal.Header>

    <Modal.Content>
        <Form onSubmit={addKey}>
          <Label icon="mail" content="Key For" size='large' />
          <Input type='text' placeholder="Service and Account Details Key Related To" fluid className='marginB10 marginT2' required />
          <Label icon="key" content="Key" size='large' />
          <Input type={showKey ? 'text' : 'password'} placeholder="Key"
           fluid className='marginB10 marginT2'
           icon={{name: "eye", onClick: () => {setShowKey(prev => !prev)}, circular: true, link: true }}
            iconPosition='left' required />

          <Button
          type="submit"
          content="Add Key"
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
