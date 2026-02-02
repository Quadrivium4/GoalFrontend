import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RiSearchLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { colors } from '../../constants';
import { useAuth, useUser } from '../../context/AuthContext';
import { TMyGoal, useDays } from '../../context/DaysContext';
import { usePop } from '../../context/PopContext';
import { getLazyFriends, TLazyFriendsResponse } from '../../controllers/friends';
import "./Friends.css";
import SearchUser from './SearchUser/SearchUser';
import UserDays from './UserDays/UserDays';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { TLike, TProgress, wait } from '../../controllers/days';
import Loader from '../../components/Loader/Loader';
import GoalSkeleton from '../../components/GoalSkeleton';
import FriendSkeleton from '../../components/FriendSkeleton/FriendSkeleton';
import { useLazyProgress } from './useLazyProgress';
import { formatDate, getAmountString } from '../Goals/Goals';
import { Likes } from '../../components/Likes/Likes';
import { FaThumbsUp } from 'react-icons/fa';
import { useAppLoading } from '../../context/AppLoadingContext';
import { getRandomColor } from '../../utils';
import { useProgress } from '../../context/ProgressesContext';

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
        //for (let j = 0; j < element.length; j++) {
            amount += element.amount;
       // }
        
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
        
        root.addEventListener("touchstart", onStartTouch, {passive: true})
        root.addEventListener("scroll", () =>{
            //console.log("scrolling");
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
        //console.log("touch started target",  e.target)
        if(!e.target || isScrollableTarget(e.target!)) return //console.log("target isScrollable");
         //-- console.log("touch")
        if(!root) return;
        if(root.scrollTop > 10) return;
         //-- console.log('scroll top', {div: root.scrollTop, root: document.getElementById("root")?.scrollTop});
         //-- console.log("start touch", e);
         if(e && e.touches && e.touches[0]){
            touch.start = e.touches[0].clientY;
        }
        root.addEventListener("touchmove", onTouchMove, {passive: true})
        root.addEventListener("touchend", onEndTouch, {passive: true})
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
               //console.log({spinner})
                //-- console.log(spinner)
               if(spinner){
                //console.log("styling")
                //spinner.style.backgroundColor = getRandomColor();
                 spinner.style.maxHeight = "50px";
                 //spinner.classList.add("app-loader-anim")
                 
               }
                //await wait(2000)
                await onRefresh();
                if(spinner){
                 spinner.style.maxHeight = "0px";
                 //spinner.classList.remove("app-loader-anim")
               }
            }
        }
         root.removeEventListener("touchmove", onTouchMove)
        root.removeEventListener("touchend", onEndTouch)
    }
   
}
function isScrollableTarget(target: any): boolean{
    //console.log({target});

    //console.log(window.getComputedStyle(target).overflowY)
    if(target.scrollHeight > target.clientHeight && ["scroll", "auto"].includes(window.getComputedStyle(target).overflowY) && target.scrollTop != 0){
        return true;
    }
    return false;
}
function FriendsOld() {

    //const {days, today, addProgress} = useDays();
    const {setPop}= usePop()
    const {friends, getMore, index, loading, reload} = useLazyFriends();
    const navigate = useNavigate();
    const {progresses, getMore: getMoreProgresses} = useLazyProgress()
    //usePullRefreshTouch(reload);
    useEffect(()=>{
         //-- console.log("---- reloading friends");
        // //-- console.log("user changed", user)
    },[])
    return (
        <>
       
        <PageHeader title={"Friends"} action={<RiSearchLine onClick={() =>setPop(<SearchUser />)} size={24} />} />
        
        
        <div className='content' id='friends' style={{overflow: "hidden"}} >
               {
                                    progresses.map(progress =>{
                                        return <p>{formatDate(progress.date)}</p>
                                    })
                                }
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
                                <div className='header' onClick={()=>navigate("/user/" + friend._id)}>
                                    {/* <Link to={"/user/" + friend._id}> */}
                                        <ProfileIcon name={friend.name} profileImg={friend.profileImg} _id={friend._id}/>
                                    {/* </Link> */}
                                    
                                    <div>
                                    <h3>{friend.name}</h3>
                                    <p><span className='goals'>{goalsString}</span></p>
                                    </div>
                                </div>
                             
                                <div className='friend-content'>

                                {/* <UserDays days={friend.goals} goals={friend.goalsInfo} /> */}
                                </div>
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
function Friends() {

    //const {days, today, addProgress} = useDays();
    const {setPop}= usePop()
    const user = useUser();
    const {unlikeProgress, likeProgress} = useDays();
    const navigate = useNavigate();
    const {progresses, getMore: getMoreProgresses, setProgresses, reload, loading, initialLoading} = useProgress()
    const scrollableRef = useRef<HTMLDivElement>(null);

    usePullRefreshTouch(async() => {

        scrollableRef.current?.scrollTo({top: 0});
        await reload();

    });
    const isLiking = useRef(false);
    const like = async(progress: TProgress) =>{
        if(isLiking.current) return;
        isLiking.current= true;
        let newLike: TLike ={
            userId: user._id,
            profileImg: user.profileImg,
            username: user.name
        }
        let newProgressFrontend = {...progress, likes: [...progress.likes,newLike]};
        setProgresses(previous =>{
                let newProgresses =previous.map(p =>{
                    if(p._id == newProgressFrontend._id){
                        return {
                            ...p,
                            likes: newProgressFrontend.likes
                        }
                    }else{
                        return p
                    }
                })
                return newProgresses
            })
        likeProgress(progress).then(newProgress =>{
            // setProgresses(previous =>{
            //     let newProgresses =previous.map(p =>{
            //         if(p._id == newProgress._id){
            //             return {
            //                 ...p,
            //                 likes: newProgress.likes
            //             }
            //         }else{
            //             return p
            //         }
            //     })
            //     return newProgresses
            // })
            isLiking.current = false;
        })
    }
    return (
        <>
       
        <PageHeader title={"Friends"} action={<RiSearchLine onClick={() =>setPop(<SearchUser />)} size={24} />} />
        
        
        <div className='content' id='friends' ref={scrollableRef} onScroll={(e) =>{
            const target = e.target as HTMLDivElement;
            const bottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 30
            // //-- console.log("scrolling...", bottom, target.scrollHeight, target.scrollTop, target.clientHeight)
            if(bottom) {
                 //-- console.log("BOTTOOM")
                getMoreProgresses()
            }
        }}>
            
            <div className='friends-lazy'>

            {/* {initialLoading? <Loader size={20}/>:null} */}
            {progresses.length == 0 && !initialLoading && !loading?  user.following.length == 0?<p>start following some people to show their activities here!</p> : <p>no friend activities to show...</p>: null}
            {
                                   
                                    progresses.map(progress =>{
                                        let friend = progress.user;
                                        let youLiked =  Boolean(progress.likes.find(like => like.userId === user._id));
                                        return (
                                          
                                            <div className='friend' key={progress._id} >
                                <div className='header' onClick={()=>navigate("/user/" + friend._id)}>
                                    {/* <Link to={"/user/" + friend._id}> */}
                                        <ProfileIcon name={friend.name} profileImg={friend.profileImg} _id={friend._id}/>
                                    {/* </Link> */}
                                    
                                    <div className='info'>
                                    <p>{friend.name}</p>
                                     <p>{formatDate(progress.date)}</p>
                                   
                                    </div>
                                    <div className='date'>
                                       
                                    </div>
                                </div>
                             
                                <div className='friend-content' >
                                    <div className='head'>
                                         <h2>{progress.goal.title}</h2>
                                         <p className='progress-amount'>+{getAmountString(progress.amount, progress.goal.type)}</p>
                                    </div>
                                    
                                     {/* <p>{progress._id}</p> */}
                                    <p>{progress.notes}</p>
                                    <div className='likes'>
                                        {progress.likes.length > 0? 
                                        <Likes likes={progress.likes} />: <p>be frist to give like!</p>}
                                        <FaThumbsUp  size={20}color={youLiked? "var(--primary)" : "white"} onClick={()=>{
                                            if(youLiked) return;
                                            like(progress)
                                        }
                                        }/>
                                    </div>
                                   
                                </div>
                                
                            </div>
                                        )
                                    })
                                }
                 {loading? <div style={{padding: 10}}>
                    <Loader size={30} /> 
                </div>: null}   
                
             </div>
            
        </div>
        </>
    );
}

export default Friends;
