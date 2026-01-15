import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import { createGraphArray as createPointsArray, createGraphPoint, TGraph } from "../pages/StatsV2/Graph";
import dayController, { TDay, TGoalDays, TStat, wait } from '../controllers/days';
import { TUser, useUser } from "./AuthContext";
import { nextWeekTime } from "../utils";
import { sumDaysProgress } from "../pages/Goals/Goals";
import axios, { Axios } from "axios";
type TStats = {
    [goalId: string]: TGraph
}
type TStatsStateProps = {
    stats: TStats,
    loading: boolean,
}
type TStatsContextProps = TStatsStateProps & {
    updateStats: (stats: TGoalDays[]) => void,
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
    let stats: TStats = {};
    for (let i = 0; i < data.length; i++) {
        const {days, ...goal} = data[i];
        stats[goal._id] = {
            goal,
            points: createPointsArray(days, goal)
        }
    }
    return stats
}
    

const StatsProviderV2 = ({ children, user}: {children: ReactNode, user: TUser}) => {
    const [state, setState] = useState<TStatsStateProps>({stats: {}, loading: true});
    const {goals, _id} = user ;
    const {stats} = state;
    useEffect(()=>{
       //  //-- console.log("reloading stats")
        dayController.getStats(_id).then(data =>{
            let result: TStats= createGraphArray(data)
            setState({stats:result, loading: false})
         }).catch(err =>{
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
            setState({...state, stats:result})
    }
    const reloadStats =async() =>{
        setState({...state, loading: true});
        //await wait(3000);
        dayController.getStats(_id).then(data =>{
            // Goal in stats is updated!!
            let result: TStats = createGraphArray(data)
            setState({...state, loading: false, stats:result})
        });
   
    }
    return (
        <StatsContext.Provider value={{ ...state, updateStats, reloadStats}}>
            {children}
        </StatsContext.Provider>
    );
};
const useStatsV2 = () => {
    const statsContext = useContext(StatsContext);
    if(!statsContext) throw new Error("useStats shoud be used inside StatsContext!")
    return statsContext
};
export { StatsProviderV2, useStatsV2 };
