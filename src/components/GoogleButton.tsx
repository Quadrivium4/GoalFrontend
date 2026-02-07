import React,{ReactNode, useEffect, useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useMessage } from '../context/MessageContext';
import { AxiosError } from 'axios';
import classes from "./Form.module.css"
import {FcGoogle} from "react-icons/fc"
import { GoogleLoginOptions, GoogleLoginResponse, InitializeOptions, SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';
import { baseUrl } from '../constants';
const errors = {
  INVALID_EMAIL: 1002,
  INVALID_PASSWORD: 1003,
}
const androidClientId = '487547214-rjii29egdk19ccann40s7bg6r009nq1m.apps.googleusercontent.com';
const iosClientId = '487547214-9vuupcbd3o4ieahtk4h4t6497r2upjdo.apps.googleusercontent.com' ;
const webClientId = '487547214-ehru2imfnlr7556i3g9lqqci4ihnmvm1.apps.googleusercontent.com';
function GoogleButtonOld({onSuccess = ()=>{}, onError= ()=>{}, children}: {onSuccess?: (res: any)=>void, onError?: (message: string)=>void, children: ReactNode}) {
  const {login, googleLogin} = useAuth();
  const navigate = useNavigate()
  const handleGoogleLogin = (token: string) =>{
      googleLogin(token).then((res)=>{
                onSuccess(res);
                //navigate("/")
          }).catch((err) => {
            let msg =  err.message;
            //  //-- console.log("login error", err)
            // message.error(msg)
             //-- console.log(err)
            onError(msg)
          })
  }
  const glog = useGoogleLogin({onSuccess: (res) =>handleGoogleLogin(res.access_token)})
  return (
    <>

        <button style={{width: "100%"}} onClick={()=>{
             //-- console.log("google clicked");
            glog();
            }} className='google-button outline'>
            <FcGoogle />
            {children}
        </button>

    </>
  );
}

function GoogleButton({onSuccess = ()=>{}, onError= ()=>{}, children}: {onSuccess?: (res: any)=>void, onError?: (message: string)=>void, children: ReactNode}) {
  const {login, googleLogin} = useAuth();
  const [resp, setResp] = useState<GoogleLoginResponse | null>(null)
  const navigate = useNavigate()
    const initializeOptions: InitializeOptions = Capacitor.getPlatform() == "ios"? {
    google: {
      iOSClientId: iosClientId,
      mode: "online"
    }
  }: {
    google: {
      webClientId: Capacitor.getPlatform() == "android"? androidClientId : webClientId,
    }
  }
  useEffect(()=>{
    console.log("social", {SocialLogin, initializeOptions});
    console.log(SocialLogin.initialize)
    SocialLogin.initialize(initializeOptions);
    //console.log(SocialLogin)
  },[])
  const handleGoogleLogin = async(token: string) =>{
   
      googleLogin(token).then((res)=>{
                onSuccess(res);
                //navigate("/")
          }).catch((err) => {
            let msg =  err.message;
            //  //-- console.log("login error", err)
            // message.error(msg)
             //-- console.log(err)
            onError(msg)
          })
  }

  const glog = async () =>{
   
    const googleOptions:GoogleLoginOptions = {
      scopes: ["email", "profile"],
      
    }
    console.log("Hi")
    const res2: any = await SocialLogin.login({provider: "google", options: googleOptions});
    console.log("hello")
    console.log(res2)
    handleGoogleLogin(res2.result.accessToken.token)
    
  }
  return (
    <>

        <button style={{width: "100%"}} onClick={()=>{
             //-- console.log("google clicked");
            glog();
            }} className='google-button outline'>
            <FcGoogle />
            {children}
        </button>
            <div>
              {resp?.responseType}
            </div>
    </>
  );
}

export default GoogleButton;
