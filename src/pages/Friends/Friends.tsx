import { useEffect, useRef, useState } from 'react';
import { RiSearchLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { colors } from '../../constants';
import { useAuth, useUser } from '../../context/AuthContext';
import { TMyGoal } from '../../context/DaysContext';
import { usePop } from '../../context/PopContext';
import { getLazyFriends, TLazyFriendsResponse } from '../../controllers/friends';
import "./Friends.css";
import SearchUser from './SearchUser/SearchUser';
import UserDays from './UserDays/UserDays';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { wait } from '../../controllers/days';
import Loader from '../../components/Loader/Loader';

function useLazyFriends (){
    const [friends, setFriends] = useState<TLazyFriendsResponse>([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const current = useRef<boolean |null>(null);
    
    useEffect(()=>{
        getFriends();
    }, [index])
    const getFriends = async() =>{
        if(current.current) return;
        current.current = true;
        setLoading(true)
        try {
             await wait(1000);
            let newFriends = await getLazyFriends(index);
            if(!newFriends) return console.log("not friends");
            
            setFriends(prev => {
                if(prev.length > 10){
                    console.log("slicing")
                    return [...newFriends, ...(prev.slice(5))]
                }return [...newFriends, ...prev]
            })
           
        } catch (error) {
            console.log("error getting friends", error)
        } finally{
             current.current = null;
             setLoading(false)
        }

    }
    useEffect(() =>{
        return () => {
            console.log("unmount")
            setFriends([])
        }
    },[])
    const getMore = () => setIndex(i =>i++)
    const reload = () => {
        if(current.current) return;
        current.current = true// new AbortController();
        setFriends([])
        getFriends();
    }
    return {friends, getMore, index, loading, reload}
}
export function sumDoubleDayProgress(goal: TMyGoal){
    let amount = 0;
    for (let i = 0; i < goal.history.length; i++) {
        let element = goal.history[i];
        for (let j = 0; j < element.history.length; j++) {
            amount += element.history[j].progress;
        }
        
    }
    return amount;
}
// export function deleteLike(likes: TLike[], userId: string){
//     let newLikes = [];
//     for (let i = 0; i < likes.length; i++) {
//         if(likes[i].userId !=userId ){
//             newLikes.push(likes[i])
//         }
        
//     }
//     return newLikes
// }
const usePullRefresh = (onRefresh: ()=>any) =>{
    const touch = {
        start: 0
    }
    useEffect(()=>{
        window.addEventListener("mousedown", onStartTouch)
         return ()=> {
            window.removeEventListener("mouseup", onEndTouch);
            window.removeEventListener("mousedown", onStartTouch);
        }
    },[])
    function onStartTouch(e: MouseEvent){
        console.log("start touch", e);
        touch.start = e.clientY;
        window.addEventListener("mouseup", onEndTouch)
    }
    function onEndTouch(e: MouseEvent){
        console.log("end touch", e)
        if( e.clientY  -touch.start> 100){
            onRefresh()
        }
        window.removeEventListener("mouseup", onEndTouch)
    }
   
}
export const usePullRefreshTouch = (onRefresh: ()=>any) =>{
    const touch = {
        start: 0
    }
    useEffect(()=>{
        window.addEventListener("touchstart", onStartTouch)
         return ()=> {
            window.removeEventListener("touchend", onEndTouch);
            window.removeEventListener("touchstart", onStartTouch);
        }
    },[])
    function onStartTouch(e: TouchEvent){
        console.log("start touch", e);
         if(e && e.touches && e.touches[0]){
            touch.start = e.touches[0].clientY;
        }
        window.addEventListener("touchend", onEndTouch)
    }
    function onEndTouch(e: TouchEvent){
        console.log("end touch", e)
        console.log({touch})
        if(e && e.changedTouches && e.changedTouches[0]){
            let delta = e.changedTouches[0].clientY - touch.start;
            console.log(e.changedTouches[0].clientY - touch.start)

            if(delta > 100){
                onRefresh()
            }
        }
        window.removeEventListener("touchend", onEndTouch)
    }
   
}
function Friends() {
    const user = useUser();
    const {updateUser} = useAuth()
    const {goals } = user;
    //const {days, today, addProgress} = useDays();
    const {setPop}= usePop()
    const {friends, getMore, index, loading, reload} = useLazyFriends();
    usePullRefreshTouch(()=>reload());
    useEffect(()=>{
        //console.log("user changed", user)
    },[user])
    return (
        <>
        <PageHeader title={"Friends"} action={<RiSearchLine onClick={() =>setPop(<SearchUser />)} size={24} />} />
        
        
        <div className='content' id='friends' style={{overflow: "hidden"}} >
            
            <div className='friends-lazy' >
                { friends.length< 1 && !loading ? <>
                    <p style={{marginBottom: 5}}>No friends yet! {loading + ""}</p> <button onClick={() =>setPop(<SearchUser />)}>search now</button>
                    </>: null}
                {   loading? <Loader size={40} />: 
                    friends.length > 0? friends.map(friend =>{
                        let goalsString = friend.goalsInfo.map((goal, i) =>  {
                            //console.log("hhhh", goal)
                            let title = goal.title;
                            let firstLetter = title[0].toUpperCase();
                            title = firstLetter + title.substring(1);
                            return i < friend.goalsInfo.length -1? title+= ", " : title+= "."
                        });
                        return (
                            <div className='friend' key={friend._id} id={friend._id}>
                                <div className='header'>
                                    <Link to={"/user/" + friend._id}>
                                        <ProfileIcon name={friend.name} profileImg={friend.profileImg} _id={friend._id}/>
                                    </Link>
                                    
                                    <div>
                                    <h3>{friend.name}</h3>
                                    <p><span className='goals'>{goalsString}</span></p>
                                    </div>
                                </div>
                                <UserDays days={friend.goals} goals={friend.goalsInfo} />
                                {/* <div className="days">
                                    {
                                        friend.goalsInfo.map(gl =>{
                                            let goal = friend.goals.find(goal => goal._id === gl._id);
                                            if(!goal) return <UserDays goal={{...gl, history: []}} key={gl._id}/>
                                            return (<UserDays goal={goal} key={goal._id} />)
                                        })
                                    }
                                </div> */}
                            </div>
                        )
                    }): null
                    
                }
            </div>
        </div>
        </>
    );
}

export default Friends;
