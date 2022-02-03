import React, {useState} from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import baseUrl from '../../Helper/baseUrl';
import { Container, Segment, Header, Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import ModalForUpdation from '../../components/UI/Modal/ModalForUpdation';

export default function Deshboard({userData, error}) {

  //router for navigation
  const router = useRouter();

  //for User Data
  const [user, setUser] = useState(userData);

  //show the model for updation of email and name
  const [updateModal, setUpdateModal] = useState(false);

  function updateModalHandler() {
    setUpdateModal(true);
  }


  //if error render an error page
  if(error) {
    <Segment padded textAlign='center'>
      <Header content="Error While Loading User Data!" />
    </Segment>
  }

  return (
  <>

    {updateModal && <ModalForUpdation user={user}
    setUser={setUser}
    setShowModal={setUpdateModal} 
    showModal={updateModal} />}

  <Container className='padding20' fluid>
      <Segment padded>
      <Header as='h3' content={user.name} />
      <Header as='h4' content={user.email} color='teal' icon='mail' />

      {/* button for updating the mail */}
      <Button icon="edit" content="Update" labelPosition='left' onClick={updateModalHandler} />
      
      </Segment>
    <Button secondary icon="key"
     content="All Keys" 
     labelPosition='left' 
     floated='right' 
      onClick={() => {router.push('/user/keys')}}      
     />
  </Container>
  </>
  );
}

Deshboard.getInitialProps = async (ctx) => {

  try {
    
    //parse the token from the req.headers.cookie
   const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/user`, {headers: {Authorization: token}});

    const userData = res.data;

    //sending the user data to the getInitialProps() static function
    //of the MyApp class that next.js uses to render all the pages
    return {userData};

  } catch (error) {
    console.log("Deshboard:- ", error.message);
    return {error: true};
  }

}