import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { DaysProvider, TMyGoal, useDays } from '../../context/DaysContext';
import "./User.css"
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Calendar from '../Stats/Calendar';
import Graph, { getPercentage, getProgressColor } from '../Stats/Graph';
import { useLocation, useParams } from 'react-router-dom';
import { getProfile, getUser } from '../../controllers/user';
import { TUser, useUser } from '../../context/AuthContext';
import { StatsProvider } from '../../context/StatsContext';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { Likes } from '../../components/Likes/Likes';
import { FriendButton } from '../Friends/SearchUser/SearchUser';
import { getDays } from '../../controllers/days';
import Goals, { getGoalAmountString,  sumDaysProgress } from '../Goals/Goals';
import GoalSkeleton from '../../components/GoalSkeleton';
import UserDays from '../Friends/UserDays/UserDays';
import { TProfile } from '../../controllers/friends';
import { IoMdRefresh } from 'react-icons/io';
import { PageHeader } from '../../components/PageHeader/PageHeader';
function useScrollRefresh(ref: React.RefObject<HTMLDivElement>, onTrigger: Function){
    useEffect(()=>{
        const el = ref.current;
    if (!el) return;

    // attach the event listener
    el.addEventListener("mousedown", handleTouchStart);

    function handleTouchStart(startEvent: MouseEvent) {
      const el = ref.current;
      if (!el) return;

      // get the initial Y position
      const initialY = startEvent.clientY;

      el.addEventListener("mousemove", handleTouchMove);
      el.addEventListener("mouseup", handleTouchEnd);

          function handleTouchMove(moveEvent: MouseEvent) {
            const el = ref.current;
            if (!el) return;

            // get the current Y position
            const currentY = moveEvent.clientY;

            // get the difference
            const dy = currentY - initialY;

            if (dy < 0) return;

            // now we are using the `appr` function
            el.style.transform = `translateY(${appr(dy)}px)`;
            }

      function handleTouchEnd() {
        const el = ref.current;
        if (!el) return;

        // cleanup
        el.removeEventListener("mousemove", handleTouchMove);
        el.removeEventListener("mouseend", handleTouchEnd);
      }
    }

    return () => {
      // let's not forget to cleanup
      el.removeEventListener("mousedown", handleTouchStart);
    };
  }, [ref.current]);

    function onTransitionEnd() {
    const el = ref.current;
    if (!el) return;

    // remove transition
    el.style.transition = "";

    // cleanup
    el.removeEventListener("transitionend", onTransitionEnd);
    }


// more code

const MAX = 128;
const k = 0.4;
function appr(x: number) {
  return MAX * (1 - Math.exp((-k * x) / MAX));
}
}
function User() {
    const {userId} = useParams();
    const [user, setUser] = useState<TUser>();
    const me = useUser()
    const [friends, setFriends] = useState<TUser[]>();
    const [goals, setGoals] = useState<TMyGoal[]>([]);
    const [userLoading, setUserLoading] = useState(false);
    const [goalsLoading, setGoalsLoading] = useState(false);
    const you = useUser()
    const ref = useRef<HTMLDivElement>(null)
    //const hello = useScrollRefresh(ref, ()=>{})
    console.log({userId})
    useEffect(() =>{
       
        
  
       fetchUser();
       fetchDays();

  
        return () =>{
        }
    },[])
    function fetchUser(){
        if(userLoading) return;
        setUserLoading(true)
        if(userId) getUser(userId).then(res => {
            setUserLoading(false)
            setUser(res)
        }).catch(err =>{
            setUserLoading(false)
            console.log("cannot load user")
        })
        
    }
    function fetchDays(){
        if(goalsLoading) return;
        setGoalsLoading(true)
          getDays(userId).then((res) =>{
            setGoals(res);
            setGoalsLoading(false);
        }
        ).catch(err => {
             setGoalsLoading(false)
            console.log(err)
        })
    }
   
    
    return (
        <>
        <PageHeader title={"Profile"} action={<IoMdRefresh size={24} onClick={()=>{
                fetchUser();
                fetchDays()
            }}/>} goBack={() => window.history.back()}/>
    
        {userLoading? <p>loading..</p>: 
        <div id='user' className='content' onScroll={()=>{console.log("scro")}} ref={ref}>

           
        {user? <>
        <div className='info'>
            <ProfileIcon  name={user.name} _id={user._id} profileImg={user.profileImg} />
            <div>
                <h2>{user.name}</h2>
                {/* <p>{user.bio || "empty bio for the moment..."}</p> */}
                <p>{user.bio}</p>
                <FriendButton friend={user}/>
            </div> 
       </div>
       {user.profileType == "private" && !me.friends.find(f => f == user._id)? 
        null:
       <div className='activities'>
        <h2>Goals</h2>
        {goalsLoading? <p>loading</p>: <UserDays days={goals} goals={user?.goals!} />}
        <h2>Stats</h2>
       <StatsProvider user={user}>
            <Graph/>
        </StatsProvider>
       </div>
        }
        </>: <p>user not found</p>}
       

        </div>
}
        </>
    );
}

export default User;
