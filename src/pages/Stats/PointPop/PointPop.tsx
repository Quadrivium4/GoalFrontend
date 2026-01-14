import { useEffect, useState } from "react";
import AddProgress from "../../../components/AddProgress";
import { useUser } from "../../../context/AuthContext";
import { useDays } from "../../../context/DaysContext";
import { usePop } from "../../../context/PopContext";
import { useStats } from "../../../context/StatsContext";
import { TDay } from "../../../controllers/days";
import { getGoalAmountString, sumDaysProgress } from "../../Goals/Goals";
import ProgressDays from "../../Goals/ProgressDays";
import { EditGoalAmount, getPercentage, getProgressColor, normalizePercentage, TGraph, TGraphPoint } from "../Graph";
import styles from "./PointPop.module.css"
const PointHeader = ({progressWidth}: {progressWidth: number}) =>{
    useEffect(()=>{
         console.log({progressWidth})
    },[progressWidth])
    return (
        <>
        {progressWidth > 0? 
        <div className={styles.header} >
            <div className={styles.progress} style={{width: progressWidth + "%",backgroundColor: getProgressColor(progressWidth)}}></div>
        </div>: null}
        </>)
}
const getLatestPointHistory = (timestamp: number, goalId: string, stats: TGraph[]) =>{
     let graph = stats.find(g =>{
            return g.goal._id == goalId
        });
          console.log({graph})
        let newPoint = graph?.points.find(p => p.date.getTime() == timestamp);
         console.log({newPoint})
        return newPoint?.history || [];
}
export default function PointPop ({point}: {point: TGraphPoint}){
    const {reloadStats,stats} = useStats()
    const {loadDays} = useDays();
    const date = new Date(point.date);
    const now = new Date()
    const {setPop} = usePop();
    const user = useUser();
    
    // console.log(point)
    date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    //const [history, setHistory] = useState(point.history);
    const [history, setHistory] = useState(getLatestPointHistory(point.date.getTime(), point.goal._id, stats));
    useEffect(()=>{
        let graph = stats.find(g =>{
            return g.goal._id == point?.goal._id
        });
          console.log({graph})
        let newPoint = graph?.points.find(p => p.date.getTime() == point?.date.getTime());
         console.log({newPoint})
        if(!newPoint) return;
        setHistory(newPoint.history)
         console.log("reloading point pop", point);
    },[stats])
    let goalDays =  point.history;
    let {goal } = point;
    const [goalProgress, setGoalProgress] = useState(sumDaysProgress(history));
    const [progressWidth, setProgressWidth] = useState(normalizePercentage(getPercentage(goal.amount, goalProgress)));
    const [goalAmountString, setGoalAmountString] = useState(getGoalAmountString(goal, goalProgress));
    //let goalProgress = sumDaysProgress(goalDays);
    //let progressWidth = normalizePercentage(getPercentage(goal.amount, goalProgress));
    //let goalAmountString = getGoalAmountString(goal, goalProgress)
    useEffect(()=>{
        let newProgress = sumDaysProgress(history);
         setGoalProgress(newProgress);
         setProgressWidth(normalizePercentage(getPercentage(goal.amount, newProgress)));
         setGoalAmountString(getGoalAmountString(goal, newProgress));

    },[history])
    return (
        <div className={styles["point-pop"]}> 
            <div className={styles.info}>
                <p>{goalAmountString} {goal.frequency}</p>
            </div>
            <PointHeader progressWidth={progressWidth}/>
            <ProgressDays history={history} onChange={(day: TDay) =>{
                 console.log("ON CHANGEEEE", {day})
                setHistory(prev => {
                    let id = prev.findIndex(d => d._id == day._id);
                    let newDays = [...prev];
                    newDays[id] = day;
                    return newDays;
                })
               
                reloadStats();
                loadDays()
                }}/>
            {user._id === goal.userId? <div className={styles.buttons}>
                <button className='outline' onClick={() => setPop(<AddProgress goal={point.goal}  date={date.getTime()} onRes={() =>{
                reloadStats();
                loadDays()
                }}/>)}>add progress</button>
                {/* <button className='outline gray' onClick={() => setPop(<EditGoalAmount goal={point.goal}  date={point.date.getTime()} />)}>Edit goal</button> */}
            </div>: null}
        </div>
    )

}