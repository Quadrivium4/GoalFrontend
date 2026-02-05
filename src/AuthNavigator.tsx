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
    <div id="header" style={{backgroundColor: colors.backgroundDark, width: "100%", padding: "8px 20px", paddingTop: "env(safe-area-inset-top)"}}>
        <a href='/'><h1 className="logo">G<span>o</span>al</h1></a>
        <div className="nav-links">

        </div>
      </div>
    )
}
export const FooterAuth = () =>{
    return (
    <div id="auth-footer" style={{display: "flex", width: "100%", justifyContent: "center", gap: 20, backgroundColor: "rgb(30,30,30)", padding: 10, flexWrap: "wrap", marginTop: "auto", paddingBottom: 'max(env(safe-area-inset-bottom), 10px)', }}>
        <p>@{new Date().getFullYear()} Goal</p>
        <p>All rights reserved</p>
        <Link to={"/privacy-policy"}>Privacy Policy</Link>
        <Link to={"/terms-of-service"}>Terms of Service</Link>
        <Link to={"/support"}>Help</Link>
        {/* <p>Email: support@goalapp.it</p> */}
        {/* <a href='/'><h1 className="logo">G<span>o</span>al</h1></a> */}
      </div>
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