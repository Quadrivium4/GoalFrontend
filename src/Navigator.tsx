import AppNavigator from './AppNavigator';
import { useAuth } from './context/AuthContext';
import AuthNavigator from './AuthNavigator';
import { useEffect } from 'react';
import { createBrowserRouter, Link, RouterProvider, Routes } from 'react-router-dom';
import DeleteAccount from './shared/DeleteAccount';
import { AppLoadingProvider } from './context/AppLoadingContext';
import { StatsProviderV2 } from './context/StatsContextV2';
import { DaysProvider } from './context/DaysContext';
// const commonRouter = createBrowserRouter([
//     {
//         path: "/delete-account/:id/:token",
//         element: <DeleteAccount />
//     }
// ])
const loader = document.getElementById("app-loader");
export const removeLoader = () =>{
    if(!loader) return;
    loader.style.display = "none"
}
export const setLoader = () =>{
    if(!loader) return;
    loader.style.display = "flex"
}
const Navigator = () =>{
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
    //-- console.log("not loading", {user, logged, loading, url: window.location.href})
    return (
        <>
        {logged && user? 
            <AppLoadingProvider>
                <DaysProvider>
                    <StatsProviderV2 user={user}>
                        <AppNavigator  />
                    </StatsProviderV2>
                </DaysProvider>
            </AppLoadingProvider>
        : <AuthNavigator/>}

        </>

    )
}
export default Navigator