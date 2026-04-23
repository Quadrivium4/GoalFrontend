import { createBrowserRouter, Link, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register/Register';
import Verify from './auth/Verify';
import ResetPassword from './auth/ResetPassword';
import VerifyResetPassword from './auth/VerifyResetPassword';
import LandingPage from './auth/LandingPage';
import DeleteAccount from './shared/DeleteAccount';
import DownloadPage from './auth/DownloadPage';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import { colors } from './constants';
import { useAuth } from './context/AuthContext';
import appStoreDownload from "./assets/images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
import googlePlayDownload from "./assets/images/GetItOnGooglePlay_Badge_Web_color_English.svg"
import { Capacitor } from '@capacitor/core';

const Layout = () =>(
    <>
         <HeaderAuth />

            <Outlet />
          
         
         <FooterAuth />
    </>
)
const authRouter = createBrowserRouter([{
    element: <Layout />, 
    
    children: [{

    index: true,
    path: "/:reload?/*",
    element: <LandingPage />

},
{
    path: "/download",
    element: <DownloadPage />
},
{
    path: "/login",
    element: <Login />
}, {
    path: "/register",
    element: <Register />
}, {
    path: "/verify/:userId/:token",
    element: <Verify />
},{
    path: "/reset-password",
    element: <ResetPassword />
},{
    path: "/verify-password/:userId/:token",
    element: <VerifyResetPassword />
},   
{
    path: "/delete-account/:id/:token",
    element: <DeleteAccount />
},
{
        path: "/privacy-policy",
        element: <PrivacyPolicy />
    }]}]
)

export const HeaderAuth = () =>{
    return (
    <div id="header" style={{backgroundColor: colors.backgroundDark, width: "100%", padding: "8px 20px", paddingTop: "max(env(safe-area-inset-top), 10px)"}}>
        <a href='/'><h1 className="logo">G<span>o</span>al</h1></a>
        <div className="nav-links">

        </div>
      </div>
    )
}
export const FooterAuth = () =>{
    const platform = Capacitor.getPlatform();
    const isWeb = platform == "web";
    return (
        <>
    <div id="auth-footer" style={{display: "flex", width: "100%", justifyContent: "center", gap: 20, backgroundColor: "var(--background-dark)", padding: 10, flexWrap: "wrap", marginTop: "auto", paddingBottom: 'max(env(safe-area-inset-bottom), 90px)', }}>
        <p>@{new Date().getFullYear()} Goal</p>
        <p>All rights reserved</p>
        <Link to={"/privacy-policy"}>Privacy Policy</Link>
        <Link to={"/terms-of-service"}>Terms of Service</Link>
        <Link to={"/support"}>Help</Link>
        {isWeb && <Link to={"/"}>Home</Link>}
        {/* <p>Email: support@goalapp.it</p> */}
        {/* <a href='/'><h1 className="logo">G<span>o</span>al</h1></a> */}
         
      </div>
      {
        isWeb && <div className='buttons-floating'>
                             {/* {window.matchMedia("(display-mode: standalone)").matches? <Link to={"/login"}><button>Login</button></Link>: <button onClick={handleDownload}>download</button>}*/}
                           
                            <a target='_blank' href='https://play.google.com/store/apps/details?id=com.goalapp.it.app&hl=en'><img src={googlePlayDownload} className='download-button'></img></a>
                            <a target='_blank' href='https://apps.apple.com/us/app/goaling/id6758761488'><img src={appStoreDownload} className='download-button'></img></a>
                        </div>
        }
      </>
    )
}
export const AuthLayout = () =>{
    const {user, logged} = useAuth();
    if(user && logged) return <Navigate to="/" />
    return <div id='auth-page'>
        <HeaderAuth />

            <Outlet />
          
         
         <FooterAuth />
         
    </div>
}
const AuthNavigator = () =>{
    return (
        <>
        <div id='auth-page'>
        <RouterProvider router={authRouter}></RouterProvider>
        </div>

        </>
    )
}
export default AuthNavigator