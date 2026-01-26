import { useEffect, useState} from 'react';

import { TGoal } from '../controllers/goals'; 
import {TDay, TProgress, wait } from '../controllers/days';
import { useDays } from '../context/DaysContext';
import InputGoalValue, { TInputProgressValues } from './Input/InputGoalValue';
import { usePop } from '../context/PopContext';
import { NetButton } from './NetButton/NetButton';
import { useStatsV2 } from '../context/StatsContextV2';


function AddProgress({ goal, date = Date.now(), onRes} : {goal: TGoal,   date?: number, onRes?: (res: TProgress) =>void}) {
    const {addProgress} = useDays();
    const {addProgressStats} = useStatsV2();
    const [form, setForm] = useState<TInputProgressValues>({amount: 0, notes: "",  date: Date.now()});
    const {closePop} = usePop();
    const updateGoalProgress = async () =>{
         //-- console.log({form})
        //await wait(1000)
        let res = await addProgress(goal._id,  form.amount, form.notes, form.date, goal.frequency);
        closePop();
        addProgressStats(res);
        
        if(onRes) onRes(res)
 
    }
    //useEffect(()=> //-- console.log("set form changed"), [setForm])
    return (
        <div className='form'>
            <h2>Add Progress</h2>
            <InputGoalValue type={goal.type} onChange={setForm} initial={{date: date}} />
            <NetButton request={updateGoalProgress}>add</NetButton>
        </div>
    );
}

export default AddProgress;
