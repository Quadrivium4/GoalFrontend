import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils';
import { useMessage } from '../context/MessageContext';


function DeleteAccount() {
    console.log("delete account");
    console.log({url: window.location.href, params: window.location});
    const {id, token} = useParams();
    const {verify, loading, logged, user} = useAuth();
    const navigate = useNavigate()
    const{message} = useMessage();
    const [status, setStatus] = useState("loading");
    const ref = useRef(false);
    useEffect(()=>{
        if(id && token && !ref.current) {
            ref.current = true;
            console.log("hello", {navigate, logged, loading, user, url: window.location.href})
            api.post('/delete-account', {id, token}).then(res =>{
                setStatus("success");
                navigate("/");
                message.success("account deleted succesfully");
            }
                
            ).catch(err =>{
                setStatus("error");
                 navigate("/");
                message.error("cannot delete account")
            })
        }
        
    },[])
  return (
    <div>
      {status == "loading" ? <h1>Deleting your account... </h1>
      :status == "success"? <>
        <h1>Your account has been succesfully deleted</h1>
        <Link to={"/"}>{"<"} back to home</Link>
      </> :
      status == "error"? <>
      <h1>Something went wrong, try again</h1> 
      <Link to={"/"}>{"<"} back to home</Link>
      </>: null}

    </div>
  );
}

export default DeleteAccount;
