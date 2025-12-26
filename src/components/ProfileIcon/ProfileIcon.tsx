import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants"
import { getRandomUserColor } from "../../utils"
import styles from "./ProfileIcon.module.css";
import { useState } from "react";
import Loader from "../Loader/Loader";
export interface TFile {
    public_id: string,
    url: string,
    name: string
}
export default function ProfileIcon({profileImg, name, _id, size}: {profileImg?: TFile, name:string, _id: string, size?: number}){
    const [loading, setLoading] = useState(profileImg?.url ? true : false);
    return (
       
       <div className={styles.profile} style={{width: size, height: size, backgroundColor: profileImg?.url? "transparent": getRandomUserColor(_id)}} >
            {profileImg && profileImg.url?
            <>
            {loading ? <Loader size={30} /> : null}
            <img src={profileImg.url} style={{width: size, height: size, display: loading ? "none" : "block"}} onLoad={()=>setLoading(false)}/>
               </>
            : <h1 style={{fontSize: size}}>{name[0].toUpperCase()}</h1>}
        </div> 

    )
}
export function ProfileIconLink({profileImg, name, _id, size}: {profileImg?: TFile, name:string, _id: string, size?: number}){
    return (
        <Link to={"/user/" + _id}>
            <ProfileIcon profileImg={profileImg} name={name} size={size} _id={_id}/>
         </Link>
    )
}