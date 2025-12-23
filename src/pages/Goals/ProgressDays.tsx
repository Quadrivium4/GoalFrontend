import React,{ReactNode, useEffect, useState} from 'react';
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
import { TDay, TGoalAmountType, TGoalDays, TLike } from '../../controllers/days';
import { getTimeAmount } from '../../utils';
import EditProgress from '../../components/EditProgress';
import DeleteGoal from '../../components/DeleteGoal';
import { TGoal } from '../../controllers/goals';
import { assetsUrl, baseUrl, colors } from '../../constants';
import GoalSkeleton from '../../components/GoalSkeleton';
import Admin from '../Admin/Admin';
import { getPercentage, getProgressColor } from '../Stats/Graph';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { usePop } from '../../context/PopContext';
import { Likes } from '../../components/Likes/Likes';
import { getAmountString, getDate, getTime, isYesterday, sameDay } from './Goals';
import styles from "./ProgressDays.module.css";
import { MdOutlineThumbUpOffAlt } from "react-icons/md";
import { postLike } from '../../controllers/likes';

export default function ProgressDays({history,  onChange}:{history: TDay[], onChange?: (day: TDay)=>void}){
    const user = useUser();
    const {setPop} = usePop();
    const editProgress = () =>{

    }
    return (<div className={styles["sub-progresses"]}>
            {history.length > 0 && history[0].history.length > 0? history.sort((a, b)=> a.date -b.date).map((day, dayIndex) =>{
                ////-- console.log(day.date, new Date())
                return (
                    <div key={day._id} className={styles.day}>
                    {/* <p>{day.utcDate.toLocaleTimeString()}</p> */}
                    <p style={{textAlign: "center"}}>{sameDay(day.date, new Date())? "Today" : isYesterday(day.date)? "Yesterday": getDate(day.date) }</p>
                    {
                        
                    day.history.sort((a, b)=> a.date -b.date).map((progress, progressIndex) =>{
                        //const strings = getDayStrings()
                        let date = new Date(progress.date);
                        ////-- console.log({progressIndex, progress: day.history[progressIndex]})
                        // TODO LIKE PAST PROGRESS
                        let youLiked = Boolean(progress.likes.find(like => like.userId ===day.goal.userId));
                        return (
                            <div key={progress.date + day._id} className={styles.prog}>
                            <div className={styles["sub-progress"]} key={progress.date} onClick={() =>{
                                if(day.goal.userId !== user._id) return;
                                setPop(<EditProgress day={day} progress={progress} onChange={onChange} progressIndex={progressIndex} dayIndex={dayIndex}/>)
                        }}>
                            <div className={styles["header"]}>
                                {/* <p>{sameDay(date, new Date())? "Today" : isYesterday(date)? "Yesterday": formatDate(date) }</p> */}
                                <p>at {getTime(date)}</p>
                                {/* {index ==0?<p >{sameDay(day.date, new Date())? "Today" : isYesterday(day.date)? "Yesterday": getDate(day.date) }</p>: null} */}
                                <p style={{color: colors.primary}}>+{getAmountString(progress.progress, day.goal.type)}</p>
                            
                            </div>
                            <div className={styles.main} style={{display: "flex"}}>
                            <p>{progress.notes}</p>
                            <div className={styles["sidebar"]}>
                               
                               
                            
                            </div>
                            </div>
                            {progress.likes.length> 0?<div className='likes' style={{paddingBottom: 5}}>
                            <Likes likes={progress.likes}/>
                            </div>: null}
                            
                            </div>

                            </div>
                        )
                        })
                    }
                    </div>
                )
                }): <p>no progress</p>}
        </div>)
}