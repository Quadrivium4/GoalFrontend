import AppNavigator from './AppNavigator';
import { useAuth } from './context/AuthContext';
import AuthNavigator, { AuthLayout } from './AuthNavigator';
import { useEffect } from 'react';
import { DaysProvider } from './context/DaysContext';
import { createBrowserRouter, Link, Navigate, Outlet, Route, RouteObject, RouterProvider, Routes, useRoutes } from 'react-router-dom';
import DeleteAccount from './shared/DeleteAccount';
import { AppLoadingProvider, useAppLoading } from './context/AppLoadingContext';
import { StatsProviderV2 } from './context/StatsContextV2';
import Goals from './pages/Goals/Goals';
import Stats from './pages/Stats/Stats';
import Friends from './pages/Friends/Friends';
import Settings from './pages/Settings/Settings';
import User from './pages/User/User';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import LandingPage from './auth/LandingPage';
import DownloadPage from './auth/DownloadPage';
import Login from './auth/Login';
import Register from './auth/Register/Register';
import Verify from './auth/Verify';
import ResetPassword from './auth/ResetPassword';
import VerifyResetPassword from './auth/VerifyResetPassword';
import Header from './components/Header';
import Pop from './components/Pop/Pop';
import Footer from './components/Footer';
import Loader from './components/Loader/Loader';
import { NotificationProvider } from './pages/Settings/Notifications/Notifications';

const LoadingLayer = () =>{
    const {loading} = useAppLoading();
    return <div style={{position: "fixed", width: "100%", height: "100%", overflow: "hidden", zIndex: 1000, backgroundColor: "rgba(0,0,0,0.5)", display: loading? "none": "none"}}>
        <Loader size={50}/>
    </div>
}
const AppLayout = () => {
    const {user} = useAuth();
    if(! user) return <div> invalid</div>
    return (
        <AppLoadingProvider>
            <NotificationProvider>
                <DaysProvider>
                    <StatsProviderV2 user={user}>
                       <Header></Header>
         <LoadingLayer />
         <Pop />
         <div id='app-spinner' style={{maxHeight: 0, overflow: "hidden",  transition: "max-height 0.3s"}}> <Loader size={30}/></div>
        
         <div id='page'>
            
            <div className='page-content'>
                <Outlet />
            </div>
         </div>
         <Footer></Footer> 
                    </StatsProviderV2>
              </DaysProvider>
              </NotificationProvider>
            </AppLoadingProvider>
    )
}
const appRoutes: RouteObject[] = [{
        index: true,
        path: "/*",
        element: <Goals />
    },{
        path: "/stats",
        element: <Stats />
    },{
        path: "/friends",
        element: <Friends />
    },{
        path: "/settings",
        element: <Settings />
    },{
        path: "/user/:userId",
        element: <User />
    },
    {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
    }];
const authRoutes: RouteObject[] = [{

    index: true,
    path: "/home",
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
    element: <Register/>
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
}]
const AppRoutes = () =>{
    const {logged, user} = useAuth();
    if(logged && user) return <AppLayout />
    return <Navigate to={"/home"} />

}
const appRouter = createBrowserRouter([{
    element: <AppRoutes />,
    children: appRoutes,
},{
    element: <AuthLayout />,
    children: authRoutes
},{
    path: "/verify/:userId/:token",
    element: <Verify />
}
]);
const loader = document.getElementById("app-loader");
export const removeLoader = () =>{
    if(!loader) return;
    loader.style.display = "none"
}
export const setLoader = () =>{
    if(!loader) return;
    loader.style.display = "flex"
}
const NavigatorV2 = () =>{
    const {logged, user, loading} = useAuth();
    
    useEffect(()=>{
        //-- console.log("navigator",{logged, user, loading})
    }, [logged, user, loading])
    useEffect(() =>{
        if(!loader) return
        if(loading) setLoader()
        else if(!loading) removeLoader()

    },[loading])
    if(loading) return null;
    return <RouterProvider router={appRouter} />
//    if(loading) return null;
//     //-- console.log("not loading", {user, logged, loading, url: window.location.href})
//     return (
//         <>
//         {logged && user? 
//             <AppLoadingProvider>
//                 <DaysProvider>
//                     <StatsProviderV2 user={user}>
//                         <AppNavigator  />
//                     </StatsProviderV2>
//                 </DaysProvider>
//             </AppLoadingProvider>
//         : <AuthNavigator/>}

//         </>
// )
    
}
export default NavigatorV2