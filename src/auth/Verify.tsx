import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessage } from '../context/MessageContext';


function Verify() {
    const {userId, token} = useParams();
    const {verify} = useAuth();
    const navigate = useNavigate();
    const {message }= useMessage();
    const ref = useRef(false);
    useEffect(()=>{
        
        
        if(userId && token && !ref.current) {
          ref.current = true;
          verify({id: userId, token:token}).then(res =>{
            navigate("/");
          }).catch(err =>{
            //-- console.log("error");
            message.error(err.message);
            navigate("/");
          })
        }
    },[])
  return (
    <div>
      <h1>Verifying... </h1>
      <p>User Id: {userId}</p>
      <p>Token: {token}</p>
    </div>
  );
}

export default Verify;
