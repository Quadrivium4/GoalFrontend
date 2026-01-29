import { ReactNode, useEffect, useRef } from 'react';
import AddGoal from '../../components/AddGoal';
import AddProgress from '../../components/AddProgress';
import DeleteGoal from '../../components/DeleteGoal';
import EditGoal from '../../components/EditGoal';
import GoalSkeleton from '../../components/GoalSkeleton';
import { useAuth, useUser } from '../../context/AuthContext';
import { TMyGoal, useDays } from '../../context/DaysContext';
import { usePop } from '../../context/PopContext';
import { TDay, TGoalAmountType, TProgress } from '../../controllers/days';
import { TGoal } from '../../controllers/goals';
import { getTimeAmount } from '../../utils';
import { getPercentage, getProgressColor } from '../Stats/Graph';
import "./Goals.css";
import ProgressDays, { groupProgressesByDay } from './ProgressDays';
import { NotificationBell, useNotifications } from '../Settings/Notifications/Notifications';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { BsTrash } from 'react-icons/bs';
import { FaEdit, FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { RiFileEditLine } from 'react-icons/ri';
import { FiEdit, FiPlus } from "react-icons/fi";
import { SlOptionsVertical } from "react-icons/sl";
import { GoPlus } from "react-icons/go";
import { AiOutlinePlus} from "react-icons/ai";
import { colors } from '../../constants';
import { MdEdit } from 'react-icons/md';
import { usePullRefreshTouch } from '../Friends/Friends';
import { useStatsV2 } from '../../context/StatsContextV2';

export function sameDay(date1: Date | number, date2: Date | number){
    date1 = new Date(date1);
    date2 = new Date(date2);
    if(date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()) return true
    return false
}
export function isYesterday(date1: Date | number){
    date1 = new Date(date1);
    date1.setDate(date1.getDate() + 1);
    return sameDay(Date.now(), date1);
}
export function getTime(date: Date | number) {
    date = new Date(date);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2,"0")}`
}
export function getDate(date: Date | number) {
    date = new Date(date);
    return date.toLocaleDateString("eng", {month: "short",day: "numeric"});
}
export function formatDate(date: Date | number):string{
    date = new Date(date)
    return `${getDate(date)} at ${getTime(date)}`
}
export function getAmountString(amount: number, type: TGoalAmountType):string{
  let string = type === "time"? getTimeAmount(amount) + " hours": type === "distance"?  amount/1000 + "km": amount + "";
  return string
}


export const sumDaysProgress = (days: TDay[])=>{
    let progress = 0;
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        progress += sumDayProgress(day.progresses);
    }
    return progress;
}
export function sumDayProgress(progresses: TProgress[]){
 
  let sum = 0;
  //if(!day.history) return 0;
  for(let i = 0; i < progresses.length; i++){
    sum+= progresses[i].amount;
  }
  return sum;
}
export function getDayStrings(day: TDay, goal: TGoal, frequency?: TGoal["frequency"]){

}
export function formatTime(date: Date | number){
  date = new Date(date);
  return 
}


export function getGoalAmountString(goal: TGoal, goalProgress: number){
  return  goal.type === "time"? getTimeAmount(goalProgress) + "/" +getTimeAmount(goal.amount) + " hours": goal.type === "distance"? goalProgress/1000 + "/" + goal.amount/1000 + "km": goal.amount;
}
export function SingleGoal({goal}: {goal: TMyGoal}){
  // //-- console.log({goal})
  let goalDays =  goal.history;
  let goalProgress = sumDayProgress(goalDays);
  const {setPop} = usePop();
  let progressWidth = getPercentage(goal.amount, goalProgress);
  let goalAmountString = getGoalAmountString(goal, goalProgress)
  const groupedProgress = groupProgressesByDay(goal.history);
  useEffect(()=>{
     //-- console.log("Single goal rendering")
  },[])
  //const {reloadStats} = useStatsV2()
  const reloadStats = () =>{}
  return (
      <div className='goal'>
        <div className='header'><div className='progress' style={{width: progressWidth + "%", backgroundColor: getProgressColor(progressWidth)}}></div></div>
        <div className='info'>
          <h3>{goal.title}</h3>
          <p>{goalAmountString} {goal.frequency}</p>
         
          
        </div>
        
         <ProgressDays history={groupedProgress} onChange={reloadStats} goal={goal}/>
       
        <div className='footer'>
          <div style={{display: 'flex', gap: "5px"}}>
            <AiOutlinePlus size={28} color={colors.primary} onClick={() => setPop(<AddProgress goal={goal} />)} className='icon-button' />
            {/* <button className='outline' onClick={() => setPop(<AddProgress goal={goal}  closePop={closePop}/>)}>add progress</button> */}
          </div>
          <div style={{display: 'flex', gap: "15px"}}>
              {/* <MdOutlineModeEditOutline size={24} onClick={() =>setPop(<EditGoal goal={goal} closePop={() =>setPop(undefined)} />)} className='button-icon' /> */}
              {/* <MdDelete size={24} onClick={() =>setPop(<EditGoal goal={goal} closePop={() =>setPop(undefined)} />)} className='button-icon' /> */}
            <MdEdit size={22} onClick={()=> setPop(<EditGoal goal={goal} />)} className='icon-button'/>
            <FaRegTrashAlt size={20} onClick={()=> setPop(<DeleteGoal goal={goal} />)} className='icon-button'/>
          
          </div>
        </div>
      </div>
    )
}

//* VERSION 2 */
function Goals() {
  //-- console.log("hi goals")
    const user = useUser();
    const {reload: reloadNotifications} = useNotifications();
    const contentRef = useRef<HTMLDivElement>(null);

     //-- console.log("goals rendering")
    //const {goals } = user;
    const {goals, addProgress, daysLoading, loadDays} = useDays();
    
    const {setPop} = usePop();
    usePullRefreshTouch(  async() =>{
      await loadDays();
      await reloadNotifications()
    })
    useEffect(()=>{
       //-- console.log("------ Goals Render ----")
      // //-- console.log("remount")
      //  //-- console.log(user)
      // //-- console.log({goals})
      //worker.postMessage("hello")
    },[])
  return (
    <>
   <PageHeader title="Home" action={<NotificationBell setPop={setPop}  />} />
    <div className='content' id='goals' >
       
      
      <div className='goals' ref={contentRef}>
        {
          user.goals.length > 0 && daysLoading? <GoalSkeleton goals={user.goals} />:
          goals?.length > 0? goals.map(goal=>{
            let {history, ...goalInfo} = goal;
            let currentGoalInfo = user.goals.find(g => g._id === goal._id);
            if(goal.title == "gil"){
              //console.log(goal, "cici")
            }
            if(!currentGoalInfo) {
              console.log("error, goal not found");
              return <></>
            }
            //if(!goal) return <SingleGoal goal={{...currentGoalInfo, history: []}} key={goalInfo._id}/>
            return <SingleGoal goal={{...currentGoalInfo, history}} key={goalInfo._id}/>
          }): <p>no goals</p>
        }

      </div>
      <button onClick={() =>{
        setPop(<AddGoal/>)
      }}> new Goal</button>
    {/* <button onClick={()=> window.open('tel:+393478619432', '_system')}>error</button> */}
    {/* <Admin /> */}
    </div>
    </>
  );
}

export default Goals;

