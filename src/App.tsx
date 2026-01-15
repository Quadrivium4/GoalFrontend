import React, { useEffect, useState } from 'react';
import Navigator from './Navigator';

import "./root.css";
import "./App.css"
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import Message from './components/Message';
import { ErrorBoundary } from 'react-error-boundary';
import { PopProvider } from './context/PopContext';
import { GlobalProvider } from './GlobalState';
import { NotificationProvider } from './pages/Settings/Notifications/Notifications';
import { isMobile } from './utils';
import NavigatorV2 from './NavigatorV2';

// function App() {
//   return (
// {/* <ErrorBoundary fallbackRender={(props)=>{
//    //-- console.log(props)
//   return <div>Error</div>}
//   }> */}
//      <MessageProvider>
//     <AuthProvider>
        
//         <Message />
//         <Navigator></Navigator>

//     </AuthProvider>
//     </MessageProvider>
//     {// </ErrorBoundary>}
//   );
// }

function App() {
  return (
      <PopProvider >
        <MessageProvider>
          <AuthProvider>
              <Message />
              <NavigatorV2 />
          </AuthProvider>
        </MessageProvider>
      </PopProvider>
  );
}
export default App;
