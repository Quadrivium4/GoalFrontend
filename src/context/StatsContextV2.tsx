import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import { createGraphArray as createPointsArray, createGraphPoint, TGraph } from "../pages/Stats/Graph";
import dayController, { TDay, TGoalDays, TProgress, TStat, wait } from '../controllers/days';
import { TUser, useUser } from "./AuthContext";
import { nextWeekTime } from "../utils";
import { sumDayProgress } from "../pages/Goals/Goals";
import axios, { Axios } from "axios";
import { groupProgressesByDay } from "../pages/Goals/ProgressDays";
import { createNewProgressArray, deleteProgressFromArray, editProgressArray } from "./DaysContext";
type TStats = {
    [goalId: string]: TGraph
}
type TStatsStateProps = {
    stats: TStats,
    loading: boolean,
    userId: string
}
type TStatsContextProps = TStatsStateProps & {
    updateStats: (stats: TGoalDays[]) => void,
    editStats: (day: TProgress) =>void,
    addProgressStats: (day: TProgress) => void,
    deleteProgressStats: (day: TProgress) =>void, 
    reloadStats: ()=>void
} | null
const StatsContext = createContext<TStatsContextProps>(null);
export const nextDayTime = (date: number | Date) =>{
    let date1 = new Date(date);
    let date2 = new Date(date1);
    date2.setDate(date1.getDate() + 1);
    return date2.getTime()
}
const createGraphArray = (data: TGoalDays[]) => {
    //console.log("hello graph array")
    let stats: TStats = {};
    for (let i = 0; i < data.length; i++) {
        const {days, ...goal} = data[i];
        const result = groupProgressesByDay(days);
        stats[goal._id] = {
            goal,
            points: createPointsArray(result, goal)
        }
    }
    return stats
}
    

const StatsProviderV2 = ({ children, user}: {children: ReactNode, user: TUser}) => {
    const [state, setState] = useState<TStatsStateProps>({stats: {}, loading: true, userId: user._id});
    const [data, setData] = useState<TGoalDays[]>([]);
    const {goals, _id} = user ;
    const {stats} = state;
    useEffect(()=>{
       //  //-- console.log("reloading stats")
        dayController.getStats(_id).then(data =>{
            //console.log({data})
            setData(data);
            let result: TStats= createGraphArray(data)
            
            setState({stats:result, loading: false, userId: _id})
         }).catch(err =>{
            //console.log("ERRor", err);
            setState({...state, loading: false})
            if(axios.isCancel(err)){
                // //-- console.log("cancel err")
            }else {
                // //-- console.log("unexpected error")
            }
        })
    },[goals,_id])
    //const delay = 5000;
    const updateStats = (stats: TGoalDays[]) =>{
            let result: TStats = createGraphArray(stats)
            setState({...state, stats:result, loading: false})
    }
    const reloadStats =async() =>{
        setState({...state, loading: true});
        //await wait(3000);
        dayController.getStats(_id).then(data =>{
            // Goal in stats is updated!!
            setData(data);
            let result: TStats = createGraphArray(data)
            setState({...state, loading: false, stats:result})
        });
   
    }
    const editStats = (progress: TProgress) =>{

         let newStats = editProgressInStats(data, progress);
         setData(newStats);
      //-- console.log({newStats})
         let result: TStats = createGraphArray(newStats)
         setState({...state, loading: false, stats: result})
       
    }
    const addProgressStats = (progress: TProgress) =>{
        
        let newStats = insertProgressInStats(data, progress);
        setData(newStats);
        let result: TStats = createGraphArray(newStats)
        setState({...state, loading: false, stats: result});
    }
    const deleteProgressStats = (progress: TProgress) =>{
        
        let newStats = deleteProgressInStats(data, progress);
        setData(newStats);
        let result: TStats = createGraphArray(newStats)
        setState({...state, loading: false, stats: result});
    }
    return (
        <StatsContext.Provider value={{ ...state, updateStats, reloadStats, editStats, addProgressStats, deleteProgressStats}}>
            {children}
        </StatsContext.Provider>
    );
};
const insertProgressInStats = (data: TGoalDays[], day: TProgress) =>{
    const newStats = data.map(goal => {
        if(goal._id === day.goalId){
            let newArray = createNewProgressArray(goal.days, day);
            return {
                ...goal, days: newArray
            }
        }else{
            return goal
        }
    })
   return newStats;
}
const editProgressInStats = (data: TGoalDays[], day: TProgress) =>{
    const newStats = data.map(goal => {
        if(goal._id === day.goalId){
            let newArray = editProgressArray(goal.days, day);
            return {
                ...goal, days: newArray
            }
        }else{
            return goal
        }
    })
   return newStats;
}
const deleteProgressInStats = (data: TGoalDays[],progress: TProgress) =>{
    const newStats = data.map(goal => {
        if(goal._id === progress.goalId){
            let newArray = deleteProgressFromArray(goal.days, progress);
         //-- console.log({newArray, d: goal.days})
            return {
                ...goal, days: newArray
            }
        }else{
            return goal
        }
    })
   return newStats;
}
const useStatsV2 = () => {
    const statsContext = useContext(StatsContext);
    if(!statsContext) throw new Error("useStats shoud be used inside StatsContext!")
    return statsContext
};
export { StatsProviderV2, useStatsV2 };
