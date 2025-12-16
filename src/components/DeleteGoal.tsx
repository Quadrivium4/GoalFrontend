import { useState } from 'react';
import { useDays } from '../context/DaysContext';
import { usePop } from '../context/PopContext';
import { TGoal } from '../controllers/goals';
import { NetButton } from '../pages/Settings/Notifications/Notifications';

function DeleteGoal({ goal}: { goal: TGoal}) {
    const {closePop} = usePop()
    const {deleteGoal} = useDays();

    const handleClick = async() =>{
  
        await deleteGoal(goal._id);
        closePop();
    }
    return (
    <div className='form'>
        <h2>Delete Goal</h2>
        <p>Are you sure you want to delete this goal?</p>
        <NetButton className="outline error" request={handleClick}>Delete</NetButton>

    </div>
);
}

export default DeleteGoal;
