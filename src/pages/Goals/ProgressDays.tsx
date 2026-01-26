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

export default function ProgressDays({history,  onChange, goal}:{history: TDay[], onChange?: (res: TChangeProps)=>void, goal: TGoal}){
    const user = useUser();
    const {setPop} = usePop();
    let noprogress = history.length === 0;
    //const groupedProgress = groupProgressesByDay(history);
    const editProgress = () =>{

    }
    
    return (<div className={styles["sub-progresses"]}>
         {noprogress? <p>no progress</p>: 
            
            history.length > 0 ? history.map(({date, progresses}, dayIndex) =>{
                // //-- console.log(day.date, new Date())
                return (
                    
                   history.length >0? 
                    <div key={date.getTime()} className={styles.day}>
                   
                          
                    
                    <p style={{textAlign: "center"}}>{sameDay(date, new Date())? "Today" : isYesterday(date)? "Yesterday": getDate(date) }</p>
                    
                    
                    {progresses.map((progress, progressIndex) =>{
                        //const strings = getDayStrings()
                        let date = new Date(progress.date);
                        // //-- console.log({progressIndex, progress: day.history[progressIndex]})
                        // TODO LIKE PAST PROGRESS
                        let youLiked = Boolean(progress.likes.find(like => like.userId === progress.userId));
                        return (
                            <div key={progress._id} className={styles.prog}>
                            <div className={styles["sub-progress"]} key={progress.date} onClick={() =>{
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
                            {
                            progress.likes.length> 0?
                            <div className='likes' style={{paddingBottom: 5, paddingTop: 5}}>
                            <Likes likes={progress.likes}/>
                            </div>: null}
                            </div>
                        )
                        })
                    }</div>: null)
                }): null
            }
            
        </div>)
}