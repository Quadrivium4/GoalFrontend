import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { isMobile } from './utils';
import { Capacitor } from '@capacitor/core';
const androidClientId = '487547214-rjii29egdk19ccann40s7bg6r009nq1m.apps.googleusercontent.com';
const iosClientId = '487547214-9vuupcbd3o4ieahtk4h4t6497r2upjdo.apps.googleusercontent.com' ;
const webClientId = '487547214-ehru2imfnlr7556i3g9lqqci4ihnmvm1.apps.googleusercontent.com';
const CLIENT_ID =  Capacitor.getPlatform() == "web"?  
'487547214-ehru2imfnlr7556i3g9lqqci4ihnmvm1.apps.googleusercontent.com' : Capacitor.getPlatform() == "ios"?
'487547214-9vuupcbd3o4ieahtk4h4t6497r2upjdo.apps.googleusercontent.com' : Capacitor.getPlatform() == "android" ?
'487547214-rjii29egdk19ccann40s7bg6r009nq1m.apps.googleusercontent.com' : null;
//  //-- console.log({CLIENT_ID})
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  /* global google */
  <React.StrictMode>
   
    {CLIENT_ID?<GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>: <App />}
   </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals( //-- console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

