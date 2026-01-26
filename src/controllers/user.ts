// const addDay = async(day: TDayForm): Promise<TDay> =>{

import { TFile } from "../components/ProfileIcon/ProfileIcon";
import { TLoginForm, TUser } from "../context/AuthContext"
import { protectedApi } from "../utils"
import { wait } from "./days";
import { TProfile } from "./friends";
export type TUserForm = {
    name: string,
    bio: string,
    profileType: string
}
// }
const getProfile = async(userId: string): Promise<TProfile> =>{
  

    const res = await protectedApi.get("/profile", {params: {id: userId}});
    return res.data;
}
const getUser = async(userId: string): Promise<TUser> =>{
  

    const res = await protectedApi.get("/user", {params: {id: userId}});
    return res.data;
}
const uploadProfileImg = async(file: TFile): Promise<TFile> =>{
    const res =  await protectedApi.post("/user/update-img", file)
    return res.data
}
const changeEmail = async(form: TLoginForm): Promise<TUser> =>{
    const res =  await protectedApi.post("/change-email", form);
    return res.data
}
const putUser =  async(form: TUserForm): Promise<TUser> =>{
    //await wait(5000)

    const res = await protectedApi.put("/user", form);
    return res.data;
}
const getCloudinarySignature = async(): Promise<any> =>{
    const res = await protectedApi.get("/cloudinary-signature");
    return res.data
}

let controller = {
    uploadProfileImg,
    getUser,
    changeEmail,
    putUser,
    getCloudinarySignature
}
export  {
    uploadProfileImg,
    getUser,
    changeEmail,
    getProfile,
    putUser,
    getCloudinarySignature
}
export default controller