import { useEffect, useState} from 'react';

import { TGoal } from '../controllers/goals'; 
import {TDay, TProgress, wait } from '../controllers/days';
import { useDays } from '../context/DaysContext';
import InputGoalValue from './Input/InputGoalValue';
import { useStats } from '../context/StatsContext';
import { usePop } from '../context/PopContext';
import { NetButton } from './NetButton/NetButton';


function AddProgress({ goal, date = Date.now(), onRes} : {goal: TGoal,   date?: number, onRes?: (res: TDay) =>void}) {
    const {addProgress} = useDays();
    const {reloadStats, updateStats} = useStats();
    const [form, setForm] = useState<TProgress>({progress: 0, notes: "", likes: [], date: Date.now()});
    const {closePop} = usePop();
    const updateGoalProgress = async () =>{
        console.log({form})
        //await wait(1000)
        let res = await addProgress(goal._id,  form.progress, form.notes, form.date);
        closePop();
        reloadStats();
        
        if(onRes) onRes(res)
 
    }
    useEffect(()=>console.log("set form changed"), [setForm])
    return (
        <div className='form'>
            <h2>Add Progress</h2>
            <InputGoalValue type={goal.type} onChange={setForm} initial={{date: date}} />
            <NetButton request={updateGoalProgress}>add</NetButton>
        </div>
    );
}

export default AddProgress;
