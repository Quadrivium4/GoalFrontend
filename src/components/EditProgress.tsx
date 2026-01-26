import { useState} from 'react';
import  {TProgress, TDay} from '../controllers/days';
import { useDays } from '../context/DaysContext';
import InputGoalValue from './Input/InputGoalValue';
import { useMessage } from '../context/MessageContext';
import { NetButton } from './NetButton/NetButton';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IconNetButton } from './IconNetButton/IconNetButton';
import { colors } from '../constants';
import { usePop } from '../context/PopContext';
import { TGoal } from '../controllers/goals';
import { useStatsV2 } from '../context/StatsContextV2';
export type TChangeProps = {
    action: "edit" | "delete",
    progress: TProgress
}
function EditProgress({goal, progress,   onChange, progressIndex, dayIndex} : {goal: TGoal, progress: TProgress, onChange?: (res: TChangeProps)=>void, progressIndex: number, dayIndex: number}) {
    const {editProgress, deleteProgress} = useDays();
    const {editStats, deleteProgressStats} = useStatsV2()
    //const {goal} = day;
    const [newProgress, setNewProgress] = useState<TProgress>(progress);
    const {message} =useMessage()
    const {closePop} = usePop();
    const updateGoalProgress = async () =>{
        console.log("updating progress goal")
        try {
            let res = await editProgress(newProgress, goal.frequency);
            editStats(res);
            console.log({onChange})
            if(onChange) onChange({progress: res, action: "edit"});
            closePop();
        } catch (err) {
            
             console.log("hello error:", err)
        }
    }
    const deleteGoalProgress = async() =>{
        try {
            let res = await deleteProgress(progress._id);
            deleteProgressStats(res);
            if(onChange) onChange({progress: res, action: "delete"})
            closePop();
        } catch (err) {
             //-- console.log("hello error:", err)
        }
    }
    return (
        <div className='form'>
            <h2>Change Progress</h2>
            <InputGoalValue type={goal.type} onChange={(form) =>{
                setNewProgress({...progress, amount: form.amount, date: form.date, notes: form.notes})
            }} initial={progress} />
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <NetButton  request={updateGoalProgress}>save</NetButton>
                <IconNetButton request={deleteGoalProgress}>
                    <FaRegTrashAlt size={20} >delete</FaRegTrashAlt>
                </IconNetButton>
            </div>
        </div>
    );
}


export default EditProgress;
