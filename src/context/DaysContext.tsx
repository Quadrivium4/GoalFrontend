import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect
} from "react";
import goalController, { TGoalForm, TGoal } from "../controllers/goals";
import dayController, { TDay, TGoalDays, TProgress, TProgressForm, wait } from "../controllers/days";
import * as likeController from "../controllers/likes"
import { dayInMilliseconds, todayDate } from "../constants";
import { getLastMonday, getToday, isToday, nextWeekTime } from "../utils";
import { TUser, useAuth, useUser } from "./AuthContext";
import { useAppLoading } from "./AppLoadingContext";
type TDaysContext = {
    daysLoading: boolean,
    //today: TDay | null,
    goals: TMyGoal[],
    loadDays: () => Promise<void>
    addProgress: (goalId: string, progress: number, notes: string, date: number, frequency: TGoal["frequency"]) => Promise<TProgress>
    addGoal: (goal: TGoalForm) => Promise<void>
    editGoal: (goal: TGoal) => Promise<void>,
    deleteGoal: (id: string) => Promise<void>,
    editProgress: (newProgress: TProgress, frequency: TGoal["frequency"]) => Promise<TProgress>
    deleteProgress: (progressId: string) => Promise<TProgress>,
    likeProgress: (progress: TProgressForm) => Promise<TProgress>,
    unlikeProgress: (progress: TProgressForm) => Promise<TProgress>
} | undefined;

export type TMyGoal = {
    history: TProgress[]
} & TGoal;

export const deleteProgressFromArray = (array: TProgress[], progress: TProgress) =>{
    let a = [];
    for (let i = 0; i < array.length; i++) {
        // if(array[i].notes == "1"){
        //  //-- console.log("hello 1", array[i]._id != progress._id)
        // }
        // if(array[i].notes == "2"){
        //  //-- console.log("hello 2", array[i]._id != progress._id)
        // }
        if(array[i]._id != progress._id){
            a.push(array[i])
        }
    }
    return a;
}
export const editProgressArray = (array: TProgress[], progress: TProgress) =>{
    let a = [];
    let inserted = false;
 //-- console.log({initialArray: array, progress})
    for (let i = 0; i < array.length; i++) {
        if(progress.date <= array[i].date  && !inserted){
            a.push(progress);
            if(array[i]._id != progress._id){
                a.push(array[i])
            }
            inserted = true;
        }else if(array[i]._id != progress._id){
            a.push(array[i])
        }
    }
    if(!inserted) a.push(progress);
 //-- console.log("final array", a, progress)
    return a;
}
export const createNewProgressArray = (array: TProgress[], progress: TProgress) =>{
    let a = [];
    let inserted = false;
    for (let i = 0; i < array.length; i++) {
        if(progress.date <= array[i].date  && !inserted){
            a.push(progress);
            a.push(array[i]);
            inserted = true;
        }else{
            a.push(array[i])
        }
    }
    if(!inserted) a.push(progress);
    return a;
}

const DaysContext = createContext<TDaysContext>(undefined)
const DaysProvider = ({ children, me }: { children: ReactNode, me?: TUser }) => {
    //const [goals, setGoals] = useState<TGoal[]>([]);
    const { updateUser } = useAuth()
    let user = useUser();
    if (me) user = me;
    // //-- console.log({user})
    const { setLoading, loading } = useAppLoading();
    const [goals, setGoals] = useState<TMyGoal[]>([]);
    
    //const [today, setToday] = useState<TDay | null>(null)
    const [initialLoading, setInitialLoading] = useState(true);
    useEffect(() => {
        if (!user.goals) return setLoading(false);
        setInitialLoading(true);
        loadDays().finally(() => {
            setInitialLoading(false)
        })
    }, [])
    const loadDays = async () => {
        setLoading(true)
        try {
            let goals = await dayController.getDays();
            setGoals(goals);
            setLoading(false)
        } catch (err) {
            //-- console.log("error fetching days: ", err)
        }

    }
    const addProgress = async (goalId: string, amount: number, notes: string, date: number, frequency: TGoal["frequency"]) => {
        setLoading(true)
        let newProgress = await dayController.addProgress(goalId, amount, notes, date);
        let updatedGoals = goals.map(goal =>{
            if(goal._id == goalId){
                let newHistory;
                if(
                    (frequency == "weekly" && date < getLastMonday(Date.now()).getTime()) || 
                    (frequency == "daily" && date < getToday().getTime())
                ){
                    newHistory = [...goal.history];
                }else{
                    newHistory = createNewProgressArray(goal.history, newProgress);
                }
                
                return {
                    ...goal,
                    history: newHistory
                }
            }else{
                return goal
            }
            }
        )
        setGoals(updatedGoals)
        setLoading(false);
        return newProgress;
    }
    const addGoal = async (goalForm: TGoalForm) => {
        setLoading(true)
        let newGoal = await goalController.addGoal(goalForm);

        updateUser({ ...user, goals: [...user.goals, newGoal] })
        let updatedGoals: TMyGoal[] = [...goals, { ...newGoal, history: [] }]
        //-- console.log({updatedGoals})
        setGoals(updatedGoals)

        setLoading(false)
    }
    const editGoal = async (goalForm: TGoal) => {
        setLoading(true)
        let {goal: newGoal, progresses}= await goalController.editGoal(goalForm);
        let newGoals = user.goals.map(goal => {
            if (goal._id === newGoal._id) return newGoal;
            return goal
        })
        //-- console.log({newGoals})
        updateUser({ ...user, goals: newGoals });
        let updatedGoals = goals.map(goal =>{
            if(goal._id === newGoal._id){
                return {
                    ...newGoal,
                    history: progresses
                }
            }else{
                return goal
            }
            
        })
        //-- console.log({updatedGoals})
        setGoals(updatedGoals)
        setLoading(false)

    }


    const deleteGoal = async (id: string) => {
        setLoading(true)
        let user = await goalController.deleteGoal(id);
        let updatedGoals = goals.filter(goal => goal._id !== id);
        setGoals(updatedGoals)
        updateUser(user)
        setLoading(false)

    }
    const editProgress = async (progress: TProgress, frequency: TGoal["frequency"]) => {
        setLoading(true)
        let updatedProgress = await dayController.updateProgress(progress);
        let updatedGoals = goals.map(goal =>{
            if(goal._id == progress.goalId){
                let newHistory;
                if(
                    (frequency == "weekly" && updatedProgress.date < getLastMonday(Date.now()).getTime()) || 
                    (frequency == "daily" && updatedProgress.date < getToday().getTime())
                ){
                    newHistory = deleteProgressFromArray(goal.history, updatedProgress)
                }else {
                    newHistory = editProgressArray(goal.history, updatedProgress);
                }
                
                return {
                    ...goal,
                    history: newHistory
                }
            }else{
                return goal
            }
            }
        )
     //-- console.log({updatedGoals})
        setGoals(updatedGoals);
        setLoading(false)
        return updatedProgress
    }
    const deleteProgress = async (progressId: string) => {
        setLoading(true)
        let updatedProgress = await dayController.deleteProgress(progressId)
      
        let updatedGoals = goals.map(goal => {
            if (updatedProgress.goalId == goal._id) {
                let updatedHistory = deleteProgressFromArray(goal.history, updatedProgress);

                return { ...goal, history: updatedHistory }
            } else {
                return goal
            }

        })
        setGoals(updatedGoals);
        setLoading(false)
        return updatedProgress
    }
    const likeProgress = async (progress: TProgressForm) => {
        //await wait(2000)
        let updatedDay = await likeController.postLike(progress)
        // let updatedDays;
        // let updatedGoals = goals.map(goal => {
        //     updatedDays = goal.history.map(day => {
        //         if (day._id === updatedDay._id) {
        //             return updatedDay
        //         }
        //         return day
        //     })

        //     return { ...goal, history: updatedDays }
        // })
        // setGoals(updatedGoals)
        return updatedDay
    }
    const unlikeProgress = async (progress: TProgressForm) => {
        let updatedDay = await likeController.deleteLike(progress)
        // let updatedDays;
        // let updatedGoals = goals.map(goal => {
        //     updatedDays = goal.history.map(day => {
        //         if (day._id === updatedDay._id) {
        //             return updatedDay
        //         }
        //         return day
        //     })

        //     return { ...goal, history: updatedDays }
        // })
        //setGoals()
        return updatedDay
    }
    return (
        <DaysContext.Provider value={{ goals, addProgress, daysLoading: initialLoading, addGoal, editGoal, deleteGoal, editProgress, deleteProgress, likeProgress, unlikeProgress, loadDays }}>
            {children}
        </DaysContext.Provider>
    )
}
const useDays = () => {
    let daysContext = useContext(DaysContext);
    if (!daysContext) throw new Error("useDays must be used inside DaysProvider");
    return daysContext;
}
export { useDays, DaysProvider };
