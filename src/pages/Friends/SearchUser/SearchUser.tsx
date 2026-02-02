import { RxCross2 } from "react-icons/rx";
import { ProfileIconLink } from "../../../components/ProfileIcon/ProfileIcon";
import Select from "../../../components/Select/Select";
import { TUser, useAuth, useUser } from "../../../context/AuthContext";
import { usePop } from "../../../context/PopContext";
import { RiUserAddLine, RiUserFollowLine } from "react-icons/ri";
import { acceptFriendRequest, cancelFriendRequest, deleteFriend, getFriends, getUsers, sendFriendRequest, TProfile, unfollow } from "../../../controllers/friends";
import { EventHandler, MouseEventHandler, useEffect, useState } from "react";
import { GenericAbortSignal } from "axios";
import { colors } from "../../../constants";
import { TDay } from "../../../controllers/days";
import styles from "./SearchUser.module.css"
import { wait } from "@testing-library/user-event/dist/utils";
import { useMessage } from "../../../context/MessageContext";
import Loader from "../../../components/Loader/Loader";
import { getProfile, getUser } from "../../../controllers/user";
import { Link, useNavigate } from "react-router-dom";
const offset = 20;
export type TFilter = "followers" | "following" | "incoming-requests" | "outgoing-requests" | "none" ;
const useUsers = () =>{
    const [users, setUsers] = useState<TProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [searchText, setSearchText] = useState<string>();
    const [filter, setFilter] = useState<TFilter>()
    const [hasMore, setHasMore] = useState(true);
    const {updateUser} = useAuth()
    
    useEffect(() =>{
       // if(!hasMore) return //-- console.log("has no more users");
        const controller = new AbortController()
        if(searchText && searchText[0] == "#"){
            setLoading(true)
            getProfile(searchText.substring(1)).then(res =>{

                setUsers([res]);
                setLoading(false)
            }).catch(err =>{
                 //-- console.log(err);

            }).finally(()=>{
                setLoading(false)
            })
            
        }else {
            
             //-- console.log("index changed", index)
            fetchUsers(searchText, controller.signal);
        }
        
        return () => {
            controller.abort()
        }
    },[index, searchText, filter])
    const fetchUsers = async(search?: string, signal?: GenericAbortSignal) =>{
        let query = {
            index, offset, search, filter, signal
        }
         //-- console.log(query)
        setLoading(true)
    
        getUsers(query).then(res =>{
             //-- console.log("getting more users", index, offset, searchText)
            
             //-- console.log({res})
            updateUser(res.user);
            setUsers(users => {
                if(res.users.length == 0){
                    setHasMore(false);
                    return users;
                }
                if(users.length > 20){
                    //  //-- console.log("slicing")
                    // return [...(users.slice(10)), ...res]
                }return [...users, ...res.users]})
            setLoading(false)
        }).catch(err =>{
             //-- console.log({err})
        })
    }
    const search = async(text: string) =>{
        setHasMore(true);
        setUsers([])
        setSearchText(text)
        if(index > 0) setIndex(0)
        else {
            //fetchUsers(text, )
        }
    }
    const getMore = () =>{
        if(!hasMore) return;
        if(loading) return  //-- console.log("already loading")
         //-- console.log("more requested")
        setIndex(index + 1)
    }
    const addFilter = (type: TFilter) =>{
        setHasMore(true)
        setUsers([]);
        if(index > 0) setIndex(0)
        setFilter(type)
    }
    return {users, loading, getMore, search,addFilter }
}
const useFriends = () =>{
    const [friends, setFriends] = useState<TUser[]>([]);
    const [friendsDays, setFriendsDays] = useState<TDay[]>([]);
    const [incomingFriendRequests,setIncomingFriendRequests] = useState<TUser[]>([]);
    const [outgoingFriendRequests,setOutgoingFriendRequests] = useState<TUser[]>([]);
        useEffect(() =>{
        getFriends().then(result => {
            setFriends(result.friends);
            setIncomingFriendRequests(result.incomingFriendRequests);
            setOutgoingFriendRequests(result.outgoingFriendRequests);
            setFriendsDays(result.friendDays)
    })
    },[])
    return {
        friends,
        incomingFriendRequests,
        outgoingFriendRequests,
        friendsDays
    }

}
function AddFriend({friendId}:{friendId: string}) {
    const sendFriendRequest = async() =>[

    ]
    return (
        <>
            <h1>Add Friend:</h1>

        </>
    )
}
function hasSentFriendRequest(id: string, outgoingFriendRequests: string[]){
    outgoingFriendRequests.includes(id)
}
const UnfollowPop = ({id, name}: {id:string, name: string}) =>{
    const {closePop}= usePop();
    const {updateUser} = useAuth()
    return (
        <>
            <h2>Unfollow {name}?</h2>
            <button className='outline error' onClick={()=> unfollow(id).then(res=> {
                updateUser(res);
                closePop();
                })}>unfollow</button>
            <button onClick={closePop} className='gray outline'>cancel</button>
        </>
    )
}
const iconSize= 24;
type TFriendType = "follower" | "following" | "requested" | "requesting" | "other";

function getFriendType(user: TUser, friendId: string ) {

    if(user.outgoingFriendRequests.includes(friendId)) return "requested";
    if(user.incomingFriendRequests.includes(friendId)) return "requesting";
    if(user.following.includes(friendId)) return "following";
    if(user.followers.includes(friendId)) return "follower";
  
    return "other"
} 

export function FriendButton({friend}: {friend: TUser | TProfile}){
    const user = useUser();
    const {setPop} = usePop();
    const {updateUser} = useAuth()
    const {message} = useMessage()
    const type:TFriendType = getFriendType(user, friend._id);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
       // console.log({friend})
        //getUser()
    },[])
    // //-- console.log("friend type", {type})
    const handleClick = () =>{
        
        if(type === "following"){
            setPop(<UnfollowPop id={friend._id} name={friend.name} />)

        }else if(type === "requested"){
            setLoading(true);
            cancelFriendRequest(friend._id).then(res=>{
                updateUser(res);
                setLoading(false);
            }).catch(err=>{
                message.error(err.message)
            }).finally(()=>{
                setLoading(false);
            })
        }else if(type === "requesting"){
            setLoading(true);
            acceptFriendRequest(friend._id).then(res =>{
                updateUser(res);
            }).catch(err=>{
                message.error(err.message)
            }).finally(()=>{
                setLoading(false);
            })
        }else if(type === "follower"){
            setLoading(true);
             sendFriendRequest(friend._id).then(res =>
                updateUser(res)
            ).catch(err=>{
                message.error(err.message)
            }).finally(()=>{
                setLoading(false);
            })
        }else
            {
                setLoading(true);
            sendFriendRequest(friend._id).then(res =>
                updateUser(res)
            ).catch(err=>{
                message.error(err.message)
            }).finally(()=>{
                setLoading(false);
            })
        }
    }
    return (
        <button className='outline gray' onClick={(e)=>{
            e.stopPropagation();
            handleClick()
        }}>
        {
            loading? <p>loading...</p> :
            type === "requested"? <><p>requested</p> <RxCross2 size={iconSize} color={colors.error} /></>:
            type === "requesting"? <><p>accept</p> <RiUserFollowLine size={iconSize} color={colors.primary}/> </>:
            type ==="follower"? <><p>follow back</p><RiUserAddLine  size={iconSize}  color={colors.primary} /></>: 
             type ==="following"? <><p>following</p> <RiUserFollowLine  size={iconSize}color={colors.primary} /></>: 
            
            <><p>{friend.profileType == "public"? "follow": "request"}</p><RiUserAddLine  size={iconSize}  color={colors.primary} /></>
        }
        </button>
    )
}

export default function SearchUser(){
    const {users, loading, getMore, search, addFilter} = useUsers();
    const {setPop} = usePop()
    const user = useUser()
    const navigate = useNavigate()
    return (
    <div className={styles.searchPop}> 
        <h2>Search</h2>
        <input type='text' onChange={(e) => search(e.target.value)} placeholder='name or #id' style={{marginTop: 15, marginBottom: 5, textDecoration: "none"}}></input>
        <Select options={["following", "followers", "incoming requests","outgoing requests", "none" ]} onSelect={(option) =>{
            if(option == ""){
                 addFilter("none")
            }else if(option == "incoming requests"){
                addFilter("incoming-requests")
            }else if(option == "outgoing requests"){
                addFilter("outgoing-requests")
            }else{
                 addFilter(option)
            }
           
            }} placeholder='filter' />


    
        <div className={styles.people} onScroll={(e) =>{
            const target = e.target as HTMLDivElement;
            const bottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 30
            // //-- console.log("scrolling...", bottom, target.scrollHeight, target.scrollTop, target.clientHeight)
            if(bottom) {
                 //-- console.log("BOTTOOM")
                getMore()
            }
        }}>
        {users.length > 0? users.map(randomUser =>{
            // //-- console.log("hey user", user)
            //if(randomUser._id == user._id) return null
            return (
                
                <div key={randomUser._id} onClick={() =>navigate(`/user/${randomUser._id}`,)} className={styles.user}>
                    
                    <ProfileIconLink profileImg={randomUser.profileImg} name={randomUser.name} _id={randomUser._id}/>
                    <div>
                    <p>{randomUser.name}</p>
                    <FriendButton friend={randomUser} />
                    </div>
                </div>
        
            )
        }): !loading? <p>No users matched your search</p>: null
       
        
        }
            <div style={{padding: 10}}>
                 {loading?  <Loader size={30} /> : null}
            </div>
           
        </div>
            </div>
        )
}
