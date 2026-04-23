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
import { FaApple } from 'react-icons/fa';
const errors = {
  INVALID_EMAIL: 1002,
  INVALID_PASSWORD: 1003,
}
const androidClientId = '487547214-rjii29egdk19ccann40s7bg6r009nq1m.apps.googleusercontent.com';
const iosClientId = '487547214-9vuupcbd3o4ieahtk4h4t6497r2upjdo.apps.googleusercontent.com' ;
const webClientId = '487547214-baefeuraqc1qj8f1lt89slhc8tudn5s4.apps.googleusercontent.com';


function AppleButton({onSuccess = ()=>{}, onError= ()=>{}, children}: {onSuccess?: (res: any)=>void, onError?: (message: string)=>void, children: ReactNode}) {
  const {login, appleLogin} = useAuth();
  const [resp, setResp] = useState<GoogleLoginResponse | null>(null)
  const navigate = useNavigate()

  useEffect(()=>{

    //console.log(SocialLogin)
  },[])
  const handleAppleLogin = async(token: string) =>{
   
      appleLogin(token).then((res)=>{
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
   
   
    console.log("Hi")
    const res2: any = await SocialLogin.login({provider: "apple", options: {}});
    console.log(res2.result.idToken)
    handleAppleLogin(res2.result.idToken);
    
  }
  return (
    <>

        <button style={{width: "100%"}} onClick={()=>{
             //-- console.log("google clicked");
            glog();
            }} className='apple-button outline'>
            <FaApple color='white' />
            {children}
        </button>
            <div>
              {resp?.responseType}
            </div>
    </>
  );
}

export default AppleButton;
