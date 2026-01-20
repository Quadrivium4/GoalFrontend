import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import GoalSkeleton from '../../components/GoalSkeleton';
import FriendSkeleton from '../../components/FriendSkeleton/FriendSkeleton';

let cachedFriends:TLazyFriendsResponse = [];
function useLazyFriends (){
    const [friends, setFriends] = useState<TLazyFriendsResponse>([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const current = useRef<boolean |null>(null);
    
    useEffect(()=>{
         //-- console.log("getting friends")
        getFriends();
    }, [index])
    const fetchFriends = async() =>{
         
        setLoading(true)
        //await wait(1000)
        try {
             //await wait(1000);
            let newFriends = await getLazyFriends(index);
            if(!newFriends) return  //-- console.log("not friends");
            
            setFriends(prev => {
                // if(prev.length > 10){
                //      //-- console.log("slicing")
                //     return [...newFriends, ...(prev.slice(5))]
                // }
                cachedFriends = [...newFriends, ...prev];
                return [...newFriends, ...prev]
            })
           
        } catch (error) {
             //-- console.log("error getting friends", error)
        } finally{
             current.current = null;
             setLoading(false)
        }

    }
    const getFriends = async() =>{
        if(current.current) return;
        current.current = true;
        if(cachedFriends.length > (index) * 20){
             //-- console.log("friends cached");
            current.current = false;
            return setFriends(cachedFriends);
        } 
       await fetchFriends();
    }
    useEffect(() =>{
        return () => {
             //-- console.log("unmount")
            //setFriends([])
        }
    },[])
    const getMore = () => setIndex(i =>i++)
    const reload = async() => {
         //-- console.log("reloading lazy friends")
        if(current.current) return;
        current.current = true// new AbortController();
        setFriends([])
        await fetchFriends();
        current.current = false;
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
const pullToRefreshDelta = 150;
export const usePullRefreshTouch = (onRefresh: ()=>Promise<any>, ref?: React.RefObject<HTMLDivElement> ) =>{
    const touch = {
        start: 0
    }
    
   
    useEffect(()=>{
        
        const root = document.getElementById("page");
          //-- console.log("root", root)
        if(!root) return;
        
        root.addEventListener("touchstart", onStartTouch)
        root.addEventListener("scroll", () =>{
            console.log("scrolling");
            root.removeEventListener("touchend", onEndTouch);
        }, true)
         return ()=> {
            if(!root) return;
            root.removeEventListener("touchend", onEndTouch);
            root.removeEventListener("touchstart", onStartTouch);
        }
    },[])
    function onTouchMove(e: TouchEvent){
    //      
    }
    function onStartTouch(e: TouchEvent){
        
        const root = document.getElementById("page");
        console.log("touch started target",  e.target)
        if(!e.target || isScrollableTarget(e.target!)) return console.log("target isScrollable");
         //-- console.log("touch")
        if(!root) return;
        if(root.scrollTop > 10) return;
         //-- console.log('scroll top', {div: root.scrollTop, root: document.getElementById("root")?.scrollTop});
         //-- console.log("start touch", e);
         if(e && e.touches && e.touches[0]){
            touch.start = e.touches[0].clientY;
        }
        root.addEventListener("touchmove", onTouchMove)
        root.addEventListener("touchend", onEndTouch)
    }
    async function onEndTouch(e: TouchEvent){
        const root = document.getElementById("page");
         if(!root) return;
         //-- console.log("end touch", e)
         //-- console.log({touch})
        if(e && e.changedTouches && e.changedTouches[0]){
            let delta = e.changedTouches[0].clientY - touch.start;
             //-- console.log(e.changedTouches[0].clientY - touch.start)

            if(delta > pullToRefreshDelta){
               const spinner = document.getElementById("app-spinner");
                //-- console.log(spinner)
               if(spinner){
                 spinner.style.maxHeight = "50px";
                 
               }
                //await wait(2000)
                await onRefresh();
                if(spinner){
                 spinner.style.maxHeight = "0px";
               }
            }
        }
         root.removeEventListener("touchmove", onTouchMove)
        root.removeEventListener("touchend", onEndTouch)
    }
   
}
function isScrollableTarget(target: any): boolean{
    console.log({target});

    console.log(window.getComputedStyle(target).overflowY)
    if(target.scrollHeight > target.clientHeight && ["scroll", "auto"].includes(window.getComputedStyle(target).overflowY)){
        return true;
    }
    return false;
}
function Friends() {

    //const {days, today, addProgress} = useDays();
    const {setPop}= usePop()
    const {friends, getMore, index, loading, reload} = useLazyFriends();
    usePullRefreshTouch(reload);
    useEffect(()=>{
         //-- console.log("---- reloading friends");
        // //-- console.log("user changed", user)
    },[])
    return (
        <>
       
        <PageHeader title={"Friends"} action={<RiSearchLine onClick={() =>setPop(<SearchUser />)} size={24} />} />
        
        
        <div className='content' id='friends' style={{overflow: "hidden"}} >
        
            <div className='friends-lazy' >
                { friends.length< 1 && !loading ? <>
                    <p style={{marginBottom: 5}}>No friends yet! </p>
                    </>: null}
                {   loading? <FriendSkeleton n={4} />: 
                    friends.length > 0? friends.map(friend =>{
                        let goalsString = friend.goalsInfo.map((goal, i) =>  {
                            // //-- console.log("hhhh", goal)
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
