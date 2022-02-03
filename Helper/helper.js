import cookie from 'js-cookie'
import Router from 'next/router';

//logout
export const logout = () => {

    cookie.remove('token');
    Router.push('/login');
    Router.reload();
}


//for redirection on server and client side
//writeHead(302, {loaction: path to redirect}) mehtod of core
//http server req stream for redirect the user from the backend
//in the next.js because next.js uses the node.js server 
//for rendring the react from the server side
//we can apply all the logic and method's we apply on a 
//normal http server created using the core http module
// or the express.js
export const redirectUser  = (location, ctx) => {

    if(ctx.req) {
        ctx.res.writeHead(302, {location: location});
        ctx.res.end();
    } else {
        Router.push(location);
        Router.reload();
    }

}