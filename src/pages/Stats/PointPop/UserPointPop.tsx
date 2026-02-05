import { useEffect, useState } from "react";
import AddProgress from "../../../components/AddProgress";
import { useUser } from "../../../context/AuthContext";
import { useDays } from "../../../context/DaysContext";
import { usePop } from "../../../context/PopContext";
import dayControllers, { TDay, TProgress } from "../../../controllers/days";
import { getGoalAmountString, sumDaysProgress } from "../../Goals/Goals";
import ProgressDays from "../../Goals/ProgressDays";
import { EditGoalAmount, getPercentage, getProgressColor, normalizePercentage, TGraph, TGraphPoint } from "../Graph";
import styles from "./PointPop.module.css"
import { useStatsV2 } from "../../../context/StatsContextV2";
import { TChangeProps } from "../../../components/EditProgress";
import { PointHeader } from "./PointPop";
import { Likes } from "../../../components/Likes/Likes";

export default function UserPointPop ({point, addLikeToStats}: {point: TGraphPoint, addLikeToStats: (p:TProgress)=>void}){
    let {goal } = point;
    let goalProgress = sumDaysProgress(point.history);
    let goalAmountString = getGoalAmountString(goal, goalProgress )
    let progressWidth = normalizePercentage(getPercentage(goal.amount, goalProgress))
    

    return (
        <div className={styles["point-pop"]}> 
            <div className={styles.info}>
                <p>{goalAmountString} {goal.frequency}</p>
            </div>
            <PointHeader progressWidth={progressWidth}/>
            <ProgressDays history={point.history} goal={point.goal} addLikeToStats={addLikeToStats} />
          
        </div>
    )

}