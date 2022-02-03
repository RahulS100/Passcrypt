import React, {useState} from 'react';
import { Button, Header, Grid, Segment, Container} from 'semantic-ui-react';
import KeyCard from '../../components/UI/KeyCard/KeyCard';
import baseUrl from '../../Helper/baseUrl';
import { parseCookies } from 'nookies';
import Modal from '../../components/UI/Modal/Modal';
import axios from 'axios';
import Cookies from 'js-cookie';


//artsy/fresnel is best library for making the design responsive 
//without touching the csss media-query in a very easy manner
import {createMedia} from '@artsy/fresnel';


//creating the breakpoint object using the @artsy's createMedia() method
//breakpoint created diff diff media query for size given into the breakpoints
const AppMedia = createMedia({breakpoints: {
    zero: 0,
    mobile: 580,
    computer: 1080
  }});
  
  //creating media style
  const mediaStyle = AppMedia.createMediaStyle();
  
  //destructuring the  media and mediacontextprovider
  //for wraping the element into the mediacontextprovider
  const {Media, MediaContextProvider} = AppMedia;


export default function Keys({keys:allkeys, error}) {

    //state for all the keys
    const [keys, setKeys] = useState(allkeys);
    
    let isEmpty = false;
    if(keys !== undefined){
        //check if keys array is empty
        isEmpty = keys.length <= 0;
    }

    //rerun the useEffect and fetch data again after adding or deleting
    //key using this handler state
    const [reload, setReload] = useState(false);

    //only fetch data if the reload state is true
    //and it is initially false
    async function reloadHandler() {
        if(reload) {
            const token = Cookies.get("token");
            const res = await axios.get(`${baseUrl}/api/user/keys`, 
            {headers: {authorization: token}});
            const keydata = res.data;

            setKeys(keydata);
            setReload(false);
        }
    }

    //call the reload handler
    if(reload) reloadHandler();


    //state for showing the model for new key
    const [showModal, setShowModal] = useState(false); 


     
     //adding a new key handler
     function addnewKey() {
            setShowModal(true);
     }


    //if any error happend then this section handle it
    if(error) {
        return <Segment>
            <Header as="h3">Error While Loading the Keys!</Header>
        </Segment>
    }


//if we have some keys then this section handles that
  return (

      <>

{/* style generated by the artsy/fresnel for mobile and computer screen that i mentioned */}
    <style>{mediaStyle}</style>
      {showModal && <Modal showModal={showModal} setShowModal={setShowModal} setKeys={setReload} />}

      <MediaContextProvider>

        {/* For bigger tv screens */}
        <Media greaterThanOrEqual='computer'>
        <Grid padded>
        <Grid.Row>
            {/* Column for Key */}
            <Grid.Column computer='10'>
               {  isEmpty ? (<Segment>
            <Header as="h3">You not saved any Keys! First save one!</Header>
            </Segment>)
             :
            ( keys.map(key => {
                       return <KeyCard passkey={key} key={key.id} setKeys={setReload} />
            }))
               }
            </Grid.Column>

            {/* Column for Add Button */}
            <Grid.Column computer='4'>
                <Button secondary icon="plus" content="Add Password" labelPosition='left' onClick={addnewKey} />
            </Grid.Column>
        </Grid.Row>
        </Grid>
        </Media>

        {/*For Laptops and tabs  */}
      <Media between={['mobile','computer']}>
        <Grid padded>
        <Grid.Row>
            {/* Column for Key */}
            <Grid.Column computer='10'>
               {  isEmpty ? (<Segment>
            <Header as="h3">You not saved any Keys! First save one!</Header>
            </Segment>)
             :
            ( keys.map(key => {
                       return <KeyCard passkey={key} key={key.id} setKeys={setReload} />
            }))
               }
            </Grid.Column>

            {/* Column for Add Button */}
            <Grid.Column computer='4'>
                <Button secondary icon="plus" content="Add Password" labelPosition='left' onClick={addnewKey} />
            </Grid.Column>
        </Grid.Row>
        </Grid>
        </Media>


        {/* for mobiles */}
        <Media between={['zero', 'mobile']}>
        <Container fluid className='marginT10'>

            {/* Column for Key */}
            <Segment>
               {  isEmpty ? (<Segment>
            <Header as="h3">You not saved any Keys! First save one!</Header>
            </Segment>)
             :
            ( keys.map(key => {
                       return <KeyCard passkey={key} key={key.id} setKeys={setReload} />
            }))
               }
            </Segment>

            {/* Column for Add Button */}
            <Container fluid>
                <Button secondary icon="plus" content="Add Password" labelPosition='left' onClick={addnewKey} />
            </Container>
        </Container>
        </Media>

        </MediaContextProvider>
      </>
  );
}



Keys.getInitialProps = async (ctx) => {

try {

    const {token} = parseCookies(ctx);

    //fetch the all keys data here
    const res = await axios.get(`${baseUrl}/api/user/keys`, {headers: {authorization: token}});
    const keys = res.data;

    return {keys};

} catch (err) {
    return {error: true}
}

}