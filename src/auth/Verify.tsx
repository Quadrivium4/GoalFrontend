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
        
         const controller = new AbortController()
        if(userId && token && !ref.current) {
          ref.current = true;
         
          verify({id: userId, token:token}, controller).then(res =>{
            navigate("/");
            message.success("verification successful")
          }).catch(err =>{
            //-- console.log("error", err);
            //message.error(err.message);
            navigate("/");
          })
        }
        return () =>{
          //-- console.log("aborting...")
          //controller.abort();
        }
    },[])
  return (
    <div>
      <h1>Verifying... </h1>
    </div>
  );
}

export default Verify;
