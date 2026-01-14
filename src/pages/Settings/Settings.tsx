import React, { useState } from 'react';
import { MdOutlineInfo, MdOutlineModeEditOutline } from "react-icons/md";
import ChangeEmail from '../../components/ChangeEmail';
import ImageUpload from '../../components/ImageUpload';

import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { useAuth, useUser } from '../../context/AuthContext';
import "./Settings.css";
import {  NotificationBell } from './Notifications/Notifications';
import { useMessage } from '../../context/MessageContext';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import Select from '../../components/Select/Select';
import VisibilityInfo from './VisibiltiyInfo';
import { usePop } from '../../context/PopContext';
import { NetButton } from '../../components/NetButton/NetButton';
import GoogleButton from '../../components/GoogleButton';
import { api, protectedApi } from '../../utils';
import { useLocation } from 'react-router-dom';

// function OldEditing() {
//   const {editUser} = useAuth();
//   const [pop, setPop] = useState<React.ReactNode>()
//   const user = useUser();
//   const [name, setName] = useState(user.name);
//   const [bio, setBio] = useState(user.bio);
//   const [isEditing, setIsEditing] = useState<"name" | "bio" | false>("bio")

//   const handleChange = () =>{
//        console.log("handle change")
//       editUser({name, bio}).then(()=>{
//         setIsEditing(false);

//       }).catch(err=>{
//          console.log("error editing user")
//       })
//   }
//   return (
//     <>
//     {pop && <Pop children={pop} toggle={() =>setPop(undefined)}/>}
//        <div className='text'>

//           <div className='edit'>
//             {isEditing != "name"?  
//             <>
//             <p onClick={()=>{
//               setIsEditing("name");
//              }}>{name}</p>
//              <MdOutlineModeEditOutline onClick={()=>{
//               setIsEditing("name");
//              }} />
//             </>:<>  <input onChange={(e) =>setName(e.target.value)} autoFocus value={name} placeholder='name'></input>
//               <button className='outline' onClick={handleChange}>save</button>
//               </>
//             }
           
//           </div>
//           <div className='edit' >
//              <p  onClick={() => setPop(<ChangeEmail />)}>{user.email}</p>
//               <MdOutlineModeEditOutline onClick={() => setPop(<ChangeEmail />)} />
//           </div>
//            <div className='edit'>
//             {isEditing != "bio"?  
//             <>
//             <p onClick={()=>setIsEditing("bio")}>{bio}</p>
//              <MdOutlineModeEditOutline onClick={()=>setIsEditing("bio")} />
//             </>:<>  <textarea onChange={(e) =>setBio(e.target.value)} value={bio} placeholder='biography' autoFocus></textarea>
//               <button className='outline' onClick={handleChange}>save</button>
//               </>
//             }
           
//           </div>
         
//         </div>
//     </>
   
//   )
// }


function Settings() {
  const {logout, deleteAccountRequest, editUser, googleLogin} = useAuth();
  const {setPop} = usePop();
  const user = useUser();
  const [bio, setBio] = useState(user.bio)
  const [name, setName] = useState(user.name)
  const [profileType, setProfileType] = useState(user.profileType?? "public");
  const {updateUserProfileImage} = useAuth();
  const [isEditing, setIsEditing] = useState<"name" | false>();
  const {message} = useMessage();

 
  const handleChange = () =>{
       console.log("handle change")
      editUser({name, bio, profileType}).then(()=>{
        setIsEditing(false)
      }).catch(err=>{
         console.log("error editing user")
      })
  }
 
  return (
    <>
      <PageHeader title={"Account"} action={<NotificationBell setPop={setPop} />} />
    
    <div id='settings' className='content'>
    
      
      <div className='info'>
        <div className='profile-img-uploader'>
          <ImageUpload onUpload={(id) => updateUserProfileImage(id)}>
            <ProfileIcon profileImg={user.profileImg} name={user.name} _id={user._id} size={60}></ProfileIcon>
          </ImageUpload>
        </div>
         <div className='text'>
          <div className='edit' onClick={() => setPop(<ChangeName />)}>
             {isEditing !== "name"?  
            <>
            <p>{user.name}</p>
            <div className='edit-icon'>
                  <MdOutlineModeEditOutline  />
                </div>
            </>:<>  <input onChange={(e) =>setName(e.target.value)} autoFocus value={name} placeholder='name'></input>
              <button className='outline' onClick={handleChange}>save</button>
              </>
            }
           
          </div>
          <div className='edit-email' onClick={()=>{
            if(user.googleLogin) return message.error("you are logged in with google, change login method");
            setPop(<ChangeEmail />)}
            }>
                <p>{user.email}</p>
                <div className='edit-icon'>
                  <MdOutlineModeEditOutline  />
                </div>
                
            </div>
        </div>

      </div>
      <div className='edit-bio'>
              <textarea className='bio' onBlur={()=>setBio(user.bio)} value={bio} onChange={(e) =>setBio(e.target.value)} placeholder='write something about you...'></textarea>
              
              {user.bio !== bio &&<NetButton request={async()=> await editUser({name: user.name, bio, profileType})}>save</NetButton>}
          </div>
          <div className='account-type'>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 5}} >
             <p>Account visibility:</p>
             <MdOutlineInfo size={20} onClick={()=> setPop(<VisibilityInfo />)}/>
            </div>
           
            <Select options={["public", "private"]}  placeholder='choose a profile type' selected={user.profileType} onSelect={(selected)=>{
              if(selected != ""){
                setProfileType(selected);
                editUser({name, bio, profileType: selected})
              }
              
            }}/>
          </div>
          {}
          <div style={{display: "flex", flexDirection: "column",  justifyContent: "space-between", paddingBottom: 5}} >
             <p>Login method: {/*user.googleLogin? "google" : "email"*/}</p>
             <Select options={["email", "google"]} placeholder='login method' selected={user.googleLogin? "google" : "email"} onSelect={(option)=>{
              if(user.googleLogin && option == "email")setPop(<AddPassword />);
              else if(!user.googleLogin && option == "google")setPop(<AddGoogleLogin />);
             }}/>
            </div>
           
            
        
     <div className="buttons">
        <button className='outline error' onClick={() =>setPop(<LogOut />)}>logout</button>
        <button className="outline error" onClick={() =>setPop(<DeleteAccount />)}>delete account</button>
          </div>
     
    </div>
    </>
  );
}
const ChangeName = () =>{
  const {logout, deleteAccountRequest, editUser, googleLogin} = useAuth();
  const user = useUser()
  const [name, setName] = useState(user.name)
  const {closePop} = usePop()
    const handleChange = () =>{
       console.log("handle change")
      editUser({name, bio: user.bio, profileType: user.profileType}).then(()=>{
        closePop()
      }).catch(err=>{
         console.log("error editing user")
      })
  }
  return (
    <div className='form'>
              <h2>Change username</h2>
                 <input onChange={(e) =>{
                  console.log(e.target.value)
                  setName(e.target.value)}} autoFocus value={name} placeholder='name'></input>
                  <button onClick={handleChange}>save</button>
              </div>
  )
}
const DeleteAccount = () =>{
   const {deleteAccountRequest} = useAuth();
     const {message} = useMessage();
   const deleteAccount = async() =>{

    await deleteAccountRequest();
    message.success("We sent you an email to confim the account deletion")
  }
  return (<div>
          <h1>Delete account?</h1>
          <p>Your data will be permanently deleted.</p>
          <p>We are going to send you a confirmation email.</p>
          <NetButton className="outline error"  request={deleteAccount}>Delete account</NetButton>
          
        </div>)
}
const AddPassword = () =>{
   const {logout} = useAuth();
     const {message} = useMessage();
      const location = useLocation()
       const [email, setEmail] = useState<string>(location.state?.email || "");
       const [password, setPassword] = useState<string>("");
  
      const handleClick= async() =>{
        try {
          let res = protectedApi.post("/add-password", {email, password});
            console.log({res})
          await logout()
          message.success("We have sent you a confirmatin email");
        } catch (error) {
           console.log(error)
        }
          
          
       }
  return (<div>
         <h1>Use Email to login</h1>
      <div className='form'>
        <input onChange={(e) =>setEmail(e.target.value)} value={email} type='email' placeholder='email'></input>
        <input onChange={(e) =>setPassword(e.target.value)} value={password} type='password' placeholder='new password'></input>
        <button onClick={handleClick}>Submit</button>
        {/* <p>Don't have an account yet? <Link to={"/"}>Register</Link></p> */}
       
        {/* <GoogleLogin onSuccess={handleGoogleLogin} onError={()=>  console.log("Error google login")}/> */}
      </div>
        </div>)
}
const AddGoogleLogin = () =>{
  
  return (<div>
         <h1>Use Google to login</h1>
        <p>Change your login method to google login</p>
  
        <GoogleButton>Login with google</GoogleButton>
   
        </div>)
}
const LogOut = () =>{
   const {logout} = useAuth();
     const {message} = useMessage();
   const logOut = async() =>{

    await logout();
    window.location.replace("/")
  }
  return (<div>
          <h1>Log Out</h1>
          <p>Are you sure you want to log out?</p>
          <NetButton className="outline error"  request={logOut}>Log Out</NetButton>
          
        </div>)
}
export default Settings;
