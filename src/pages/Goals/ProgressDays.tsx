import React,{ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import { useAuth, useUser } from '../../context/AuthContext';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import AddGoal from '../../components/AddGoal';
import "./Goals.css"
import AddProgress from '../../components/AddProgress';
import { TMyGoal, useDays } from '../../context/DaysContext';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import EditGoal from '../../components/EditGoal';
import { TDay, TGoalAmountType, TGoalDays, TLike, TProgress } from '../../controllers/days';
import { getTimeAmount } from '../../utils';
import EditProgress, { TChangeProps } from '../../components/EditProgress';
import DeleteGoal from '../../components/DeleteGoal';
import { TGoal } from '../../controllers/goals';
import { assetsUrl, baseUrl, colors } from '../../constants';
import GoalSkeleton from '../../components/GoalSkeleton';
import Admin from '../Admin/Admin';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { usePop } from '../../context/PopContext';
import { Likes } from '../../components/Likes/Likes';
import { getAmountString, getDate, getTime, isYesterday, sameDay } from './Goals';
import styles from "./ProgressDays.module.css";
import { MdOutlineThumbUpOffAlt } from "react-icons/md";
import { postLike } from '../../controllers/likes';
import { FaThumbsUp } from 'react-icons/fa';
import { useStatsV2 } from '../../context/StatsContextV2';


export const getDay = (d: number) =>{
    const day = new Date(d);
    day.setHours(0,0,0,0);
    return day
}

export const groupProgressesByDay = (history: TProgress[]) =>{
    let result : TDay[]= [];
    let resultIndex = 0;
    for (let i = 0; i < history.length; i++) {
        const p = history[i];
        if(i == 0) {
            result.push({
                date: getDay(p.date),
                progresses: [p]
            });
            
        }else if(sameDay(p.date, history[i-1].date)){
            result[resultIndex].progresses.push(p);
        }else{
            result.push({
                date: getDay(p.date),
                progresses: [p]
            })
            resultIndex++;
        }
        
       
    }
    return result;
}

export default function ProgressDays({history,  onChange, goal, addLikeToStats}:{history: TDay[], onChange?: (res: TChangeProps)=>void, goal: TGoal, addLikeToStats?: (progress: TProgress)=>void}){
    const user = useUser();
    const {setPop} = usePop();
    const {likeProgress} = useDays();
    const [h, setH] = useState(history);
    useEffect(()=>{
        setH(history);
    },[history])
    let noprogress = history.length === 0;
    
    //const groupedProgress = groupProgressesByDay(history);
    const editProgress = () =>{

    }
    const like = async(progress: TProgress, date: Date) =>{
        likeProgress(progress).then(res =>{
         //-- console.log("edit stats");
            if(addLikeToStats) addLikeToStats(res)
            setH(prev => prev.map(day =>{
             //-- console.log({day, date})
                if(day.date.getTime() == date.getTime()){
                 //-- console.log("day found")
                    let newP = day.progresses.map(p =>{
                        if(p._id == res._id){
                         //-- console.log("PROGRESS FOUND", {res})
                            return res
                        }else{
                            return p
                        }
                    });
                    return {
                        date,
                        progresses: newP
                    }
                }else{
                    return day
                }
                })
            )
            
        }).catch(err =>{
         //-- console.log("cannot like");
        })
    }
    return (<div className={styles["sub-progresses"]}>
         {noprogress? <p>no progress</p>: 
            
            h.length > 0 ? h.map(({date: dayDate, progresses}, dayIndex) =>{
                // //-- console.log(day.date, new Date())
                return (
                    
                   h.length >0? 
                    <div key={dayDate.getTime()} className={styles.day}>
                   
                          
                    
                    <p style={{textAlign: "center"}}>{sameDay(dayDate, new Date())? "Today" : isYesterday(dayDate)? "Yesterday": getDate(dayDate) }</p>
                    
                    
                    {progresses.map((progress, progressIndex) =>{
                        //const strings = getDayStrings()
                        let date = new Date(progress.date);
                        // //-- console.log({progressIndex, progress: day.history[progressIndex]})
                        // TODO LIKE PAST PROGRESS
                        let youLiked = Boolean(progress.likes.find(like => like.userId === user._id));
                        return (
                            <div key={progress._id} className={styles.prog}>
                            <div className={`${styles["sub-progress"]} ${progress.userId == user._id? styles["isMe"]: ""}`} key={progress.date} onClick={() =>{
                                if(progress.userId !== user._id) return;
                                setPop(<EditProgress goal={goal} progress={progress} onChange={onChange} progressIndex={progressIndex} dayIndex={dayIndex}/>)
                        }}>
                            
                            <div className={styles["header"]}>
                                {/* <p>{sameDay(date, new Date())? "Today" : isYesterday(date)? "Yesterday": formatDate(date) }</p> */}
                                <p>at {getTime(date)}</p>
                                {/* {index ==0?<p >{sameDay(day.date, new Date())? "Today" : isYesterday(day.date)? "Yesterday": getDate(day.date) }</p>: null} */}
                                <p style={{color: colors.primary}}>+{getAmountString(progress.amount, goal.type)}</p>
                            
                            </div>
                            <div className={styles.main} style={{display: "flex"}}>
                            <p>{progress.notes}</p>
                            <div className={styles["sidebar"]}>
            
                            </div>
                            </div>

                            </div>
                         
                            <div className='likes' style={{paddingBottom: 5, paddingTop: 5, display: "flex", justifyContent: "space-between"}}>
                            {progress.likes.length > 0? <Likes likes={progress.likes} />: goal.userId !== user._id ?<p>be frist to give like!</p>: null}
                             {goal.userId !== user._id ?   <FaThumbsUp  size={20}color={youLiked? "var(--primary)" : "white"} onClick={()=>{
                                    if(youLiked) return;
                                    like(progress, dayDate)
                                }
                                }/>: null}
                        
                            </div>
                            </div>)
                        
                        })
                    }</div>: null)
                }): null
            }
            
        </div>)
}