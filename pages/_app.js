import App from 'next/app';
import Layout from '../components/Layout/Layout';
import { parseCookies } from 'nookies';
import { redirectUser } from '../Helper/helper';

// Global CSS
import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';


//Custom App Component for serving the React Pages
class MyApp extends App {

  //getInitialProps
  static async getInitialProps(context) {
    
    let pageProps = {};
    const {Component, ctx} = context;

    const {token} = parseCookies(ctx);

    //if we are on the protected path the protectedPath Varable become true
    //and if cookie not found we redirect the user to the login page
    const protectedPath = ctx.pathname === '/user' || ctx.pathname === '/user/keys';

    const unprotectedPath = ctx.pathname === '/login' || ctx.pathname === '/signup' || ctx.pathname === '/' || ctx.pathname === '/reset' || ctx.pathname === '/reset/[token]';

    //if token not found and we or the protected route then
    //call the redirct function with the location to redirect the
    //both end front and back for backend we uses the
    //writeHead(302, {loaction: path to redirect}) mehtod of core
    //http server req stream

    if(!token) {
      protectedPath && redirectUser('/login', ctx);
    }

    //if user is logged in and on the unprotected route redirct the user to
    // /user route and only allow user to visit unprotected route when logout
    if(token) {
        unprotectedPath && redirectUser('/user', ctx);
    }

    //check if we have getInitialProps() in out current page component
    //and if yes then execute that getInitialProps and save its return types
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {userData: pageProps};
  }


  

  render() {

    //after calling the static getInitialProps
    //inside the this.props of the our MyApp class
    //the pageProps Data is attached that comes from the
    //components getInitialProps method
    const { Component, userData } = this.props;

    return (
      <Layout {...userData}>
    <Component {...userData} />
      </Layout>
    )
  }
}

export default MyApp
