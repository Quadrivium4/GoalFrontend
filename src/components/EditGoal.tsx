import { useState} from 'react';
import Select from './Select/Select';
import Input from './Input/Input';
import { useUser } from '../context/AuthContext';
import { useDays } from '../context/DaysContext';
import { TGoal } from '../controllers/goals';
import { TGoalAmountType } from '../controllers/days';
import { usePop } from '../context/PopContext';
import { NetButton } from './NetButton/NetButton';

function EditGoal({goal}: {goal: TGoal}) {
    const user = useUser();
    const [title, setTitle] = useState(goal.title);
    const {closePop} = usePop()
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "">(goal.frequency)
    const [amount, setAmount] = useState<number>(goal.amount);
    const { editGoal} = useDays()
    const createGoal = async () => {
        if(!title|| !frequency || !amount) return;
        await editGoal({
            title,
            userId: user._id,
            frequency,
            amount,
            progress: 0,
            _id: goal._id
        });
        closePop();
    }
    
    return (
    <div className='form'>
        <h2>Edit Goal</h2>
        <input placeholder='title' value={title} onChange={(e)=> setTitle(e.target.value)}></input>
        <Select options={["daily", "weekly"]} selected={goal.frequency} placeholder="frequency" onSelect={setFrequency}/>

        {goal.type === "time"? <Input.TimePicker onSelect={setAmount} initialValue={goal.amount}/> 
        : goal.type=== "distance"? <Input.DistancePicker onSelect={setAmount} initialValue={goal.amount}/> 
        : <input placeholder='amount' type='number' onChange={(e)=> setAmount(parseInt(e.target.value))} value={amount || ""}></input>}
        {/* <button onClick={createGoal}>save</button> */}
        <NetButton request={createGoal}>save</NetButton>
    </div>
);
}

export default EditGoal;
