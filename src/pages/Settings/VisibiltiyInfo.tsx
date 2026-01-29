import React,{useState} from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useMessage } from '../../context/MessageContext';
import { AxiosError } from 'axios';
import classes from "./Form.module.css"
import GoogleButton from '../../components/GoogleButton';
const errors = {
  INVALID_EMAIL: 1002,
  INVALID_PASSWORD: 1003,
}
function VisibilityInfo() {
  
  return (
    <>
        <h1>Account visibility</h1>
      <h3>Public:</h3>
      <p>Every one can see your activities and every following request is automatically accepted.</p>
      
      <h3>Private:</h3>
      <p>Only followers can see your activities and you have to accept each follower.</p>
    </>
  );
}

export default VisibilityInfo
