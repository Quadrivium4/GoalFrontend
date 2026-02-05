import { useState, useEffect, useContext, createContext, MouseEventHandler, ReactNode} from "react"
import { FaRegBell } from "react-icons/fa"
import { useMessage } from "../../../context/MessageContext"
import { getNotifications, ignoreFriendRequest, acceptFriendRequest, readNotifications } from "../../../controllers/friends"
import { sameDay, isYesterday, getDate, getTime } from "../../Goals/Goals"
import styles from "./Notifications.module.css";
import { usePullRefreshTouch } from "../../Friends/Friends"
import { NetButton } from "../../../components/NetButton/NetButton"
import { wait } from "@testing-library/user-event/dist/utils"
import { useAuth } from "../../../context/AuthContext"
import { ProfileIconLink, TFile } from "../../../components/ProfileIcon/ProfileIcon"
export type TNotification =  {
    _id: string,
    date: number,
    content: string,
    type: "like" | "incoming request" | "accepted request" | "comment" | "new follower", 
    from: {
        name: string,
        userId: string,
        profileImg?: TFile
    }
    status: "read" | "unread"
}
type TNotificationContextProps = {
  notifications: TNotification[], 
  newNotification: boolean,
  setNotifications: React.Dispatch<React.SetStateAction<TNotification[]>>,
  setNewNotification: React.Dispatch<React.SetStateAction<boolean>>,
  reload: () => Promise<void>

}
const isNewNotification = (notifications: TNotification[]) =>{
  let isNew = false;
  for (let i = 0; i < notifications.length && !isNew; i++) {
    if(notifications[i].status == 'unread') isNew = true;
  }
  return isNew
}
export const NotificationContext = createContext<TNotificationContextProps | null>(null)
export const NotificationProvider = ({children}: {children: React.ReactNode}) =>{
  const [notifications, setNotifications] = useState<TNotification[]>([])
  const [newNotification, setNewNotification] = useState(false);
  const {updateUser} = useAuth()
  useEffect(()=>{
      getNotifications().then(res =>{
         //-- console.log(res)
        let isNew = isNewNotification(res.notifications)
        if(isNew) setNewNotification(true)
        setNotifications(res.notifications)
        updateUser(res);
      }).catch(err =>{
         //-- console.log("err notifications")
      })
  },[])
  async function reload() {
    getNotifications().then(res =>{
         //-- console.log(res)
        let isNew = isNewNotification(res.notifications)
        if(isNew) setNewNotification(true)
        setNotifications(res.notifications);
        updateUser(res);

      }).catch(err =>{
         //-- console.log("err notifications")
      })
  }
  return <NotificationContext.Provider value={{notifications, newNotification, setNotifications, setNewNotification, reload}}>{children}</NotificationContext.Provider>
}
const getNotificationTitle = (type: TNotification["type"])=>{
  if(type == "like"){
    return "New Like!"
  }else if(type == "accepted request"){
    return "Accepted request!"
  }else if(type == "incoming request"){
    return "New follower request!"
  }else if(type == "comment"){
    return "New Comment!"
  }else if(type == "new follower"){
    return "New Follower!"
  }
}
export function Notifications(){
  const {notifications, setNotifications} = useNotifications();
  const {message} = useMessage();
  const [loading, setLoading] = useState<boolean | string>(false);
  const handleIgnore = async(id: string, index: number) =>{
    try {
      let newUser = await ignoreFriendRequest(id);
      setNotifications(newUser.notifications);
    } catch (error: any) {
      message.error(error.message)
    }
      
  }
  const handleAccept = async(id: string, index: number) =>{
    try {
      let newUser = await acceptFriendRequest(id);
      setNotifications(newUser.notifications);
    } catch (error: any) {
       //-- console.log("err", error)
      message.error(error.message)
    } 
   
  }
  return (
    <div className='notifications'>
      <h2>Notifications</h2>
      <div className={styles.notificationList}>
      {notifications.length > 0? notifications.sort((a, b)=> b.date -a.date).map((notification, index) =>{
        return (
          <div className={styles.notification} key={notification._id}>
            <div className={styles.header}>
              <ProfileIconLink profileImg={notification.from.profileImg} name={notification.from.name} _id={notification.from.userId} size={32} />
              <div className="info">
              <h4>{getNotificationTitle(notification.type)?.toUpperCase()}</h4>
              <p className='date'>{sameDay(notification.date, new Date())? "Today" : isYesterday(notification.date)? "Yesterday": getDate(notification.date)} at {getTime(notification.date)}</p>
             </div>
           </div>
            {notification.type === "incoming request"? <>
                
                <p>{notification.from.name} wants to follow you!</p>
                <div className='buttons' style={{display: "flex", gap: 10}}>
                  
                  <NetButton request={()=> handleAccept(notification.from.userId, index)}>accept</NetButton>
                  <NetButton className='outline' request={()=>handleIgnore(notification.from.userId, index)}>ignore</NetButton>
                </div>
                
            </>: 
            <div>
           
            <p>{notification.content}</p></div>}
          </div>

        )
      }): <p>empty</p>}
      </div>
    </div>
  )
}

export function useNotifications(){
  const notificationContext = useContext(NotificationContext);
  if(!notificationContext) throw new Error("notification context must be used inside provider")
  return notificationContext
}

export function NotificationBell({setPop}: {setPop: (content: React.ReactNode)=>void}){
  const {notifications, setNewNotification, newNotification, setNotifications, reload} = useNotifications();



  // //-- console.log({notifications})
  const openNotifications = () =>{
    setPop(<Notifications />);
    let ids = notifications.map(not => not._id);
    readNotifications(ids).then(res =>{
      res.map(not => !newNotification && not.status === "unread"? setNewNotification(true) : setNewNotification(false));
      setNotifications(res);
    })
  }
  return (
  <div className={styles["notification-bell"]}>

      <FaRegBell size={24} onClick={openNotifications}/>
      {newNotification && <div className={styles.point}></div>}
  </div>)
}