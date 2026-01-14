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

function EditProgress({day, progress,   onChange, progressIndex, dayIndex} : {day: TDay, progress: TProgress, onChange?: (day: TDay)=>void, progressIndex: number, dayIndex: number}) {
    const {editProgress, deleteProgress} = useDays()
    const {goal} = day;
    const [form, setForm] = useState<TProgress>(progress);
    const {message} =useMessage()
    const {closePop} = usePop();
    const updateGoalProgress = async () =>{
        try {
            let res = await editProgress({id: day._id, date: progress.date,progress: form.progress, notes: form.notes, newDate: form.date});

            if(onChange) onChange(res);
            closePop();
        } catch (err) {
            
             console.log("hello error:", err)
        }
    }
    const deleteGoalProgress = async() =>{
        try {
            let res = await deleteProgress({...progress, id: day._id});
            if(onChange) onChange(res)
            closePop();
        } catch (err) {
             console.log("hello error:", err)
        }
    }
    return (
        <div className='form'>
            <h2>Change Progress</h2>
            <InputGoalValue type={goal.type} onChange={setForm} initial={progress} />
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
