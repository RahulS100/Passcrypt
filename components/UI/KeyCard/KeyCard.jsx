import React, {useEffect, useState} from 'react';
import { Segment, Input, Header, Popup, Button, Divider, Container} from 'semantic-ui-react';
import axios from 'axios';
import baseUrl from '../../../Helper/baseUrl';
import Cookies from 'js-cookie';
import ModalKeyUpdation from '../Modal/UpdateKeyModal';

//Card For Password
export default function KeyCard({passkey, setKeys}) {

    //state for showing the update model
    const [updateModal, setUpdateModal] = useState(false);
    
    function updateKeyHandler() {
        setUpdateModal(true);
    }


    //copy popup
    const [popup, setPopup] = useState(false);


    //remove the popup after 4sec
    useEffect(() => {
        setTimeout(() => {
            if(popup) {
                setPopup(false);
            }
        } ,4000);
    }, [popup]);


    //deleteKey Handler
    async function deleteKey () {
        //getting the cookie
        const token = Cookies.get("token"); 

        //making a delete key request
        await axios.delete(`${baseUrl}/api/user/keys/delete/${passkey.id}`, { headers: {authorization: token}});

        //reload the keys page for fething the keys with id
        setKeys(true);
    }


  return (
      <>
      {updateModal && <ModalKeyUpdation passkey={passkey}
        setKeys={setKeys}
        setShowModal={setUpdateModal}
        showModal={updateModal}
        />}
    <Segment padded>
    <Input fluid type='text' placeholder="Password For" icon="google" iconPosition='left' value={passkey.keyfor} className='marginB10' readOnly /> 
    <Input fluid type="password" placeholder="Password" iconPosition='left' value={passkey.key} readOnly 
    icon={{name: "copy",
            circular: true,
            link: true,
            onClick: () => {
                navigator.clipboard.writeText(passkey.key);
                setPopup(true);
            }
    }}/>  
     {popup && <Header as='h5' content="Copied!" />}



{/* Popup for Deleting the Key */}
    <Divider hidden />

    <Container textAlign='right'>

    {/* Button for password updation */}
    <Button positive icon='edit' content="Update" labelPosition='left' onClick={updateKeyHandler} />

     <Popup wide trigger={<Button icon='trash' color='red' />} on='click'>
     <Header as='h4' content="Are you wanna delete this key?" />
     <Button negative content="Delete Key" onClick={deleteKey} />
     </Popup>
    </Container>

    </Segment>
    </>
  );
}
