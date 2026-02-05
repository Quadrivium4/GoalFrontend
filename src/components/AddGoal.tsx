import { useState} from 'react';
import Select from './Select/Select';
import Input from './Input/Input';
import { useUser } from '../context/AuthContext';
import { useDays } from '../context/DaysContext';
import { TGoalAmountType } from '../controllers/days';
import { useMatch } from 'react-router-dom';
import { useMessage } from '../context/MessageContext';
import { usePop } from '../context/PopContext';
import { NetButton } from './NetButton/NetButton';
import { MdOutlineHelp, MdOutlineHelpOutline } from 'react-icons/md';

function AddGoal() {
    const user = useUser();
    const [title, setTitle] = useState("")
    const [selectedOption, setSelectedOption] = useState<TGoalAmountType | "">("");
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "">("")
    const [amount, setAmount] = useState<number| "">("");
    const {addGoal} = useDays();
    const {message} = useMessage()
    const {closePop, setPop} = usePop();
    const createGoal = async () =>{
        if(!title) return message.error("insert a valid title");
        if(!frequency) return message.error("select a valid frequency");
        if(!selectedOption) return message.error("select a valid amount type");
        if(!amount) return message.error("select a valid amount");
        //if(!title || !selectedOption || !frequency || !amount) return;
       await addGoal({
            title,
            userId: user._id,
            frequency,
            amount,
            progress: 0,
            type: selectedOption
        });
        closePop()
    }
    return (
    <div className='form'>
        <div style={{display: 'flex', gap: 8, alignItems: "center"}}>
        <h2>New Goal</h2>
        <MdOutlineHelpOutline size={18} onClick={()=> setPop(<GoalInfoPop />)}/>
        </div>
        <input placeholder='title' value={title} onChange={(e)=> setTitle(e.target.value)}></input>
        <Select options={["daily", "weekly"]}  placeholder="frequency" onSelect={setFrequency}/>
        <Select options={["distance", "time", "other"] } placeholder='type' onSelect={(option) => {
            setSelectedOption(option);
            setAmount("");
        }
            }/>
        {selectedOption === "time"? <Input.TimePicker onSelect={setAmount}/> 
        : selectedOption === "distance"? <Input.DistancePicker onSelect={setAmount} /> 
        : <input placeholder={"amount"}value={amount} onChange={(e)=> {
            if(e.target.value.trim() == ""){
                setAmount("")
            }else 
                if(!isNaN(Number(e.target.value)) ){
                //-- console.log({isNumber: Number(e.target.value)})
                setAmount(parseInt(e.target.value))
            }else {
                message.error("amount must be a number")
                    //-- console.log("not a number")
                }
            }}></input>}
        <NetButton request={createGoal}>add</NetButton>
    </div>
);
}
function GoalInfoPop(){
    return (
        <div style={{paddingBottom: 10}}>
            <h2>Title</h2>
            <p>you goal title</p>
            <h2>Frequency</h2>
            <p>It can be daily, or weekly</p>
            <h2>Type</h2>
            <p>It defines the amount unit of measure:</p>
            <p> - Distance, measured in kilometers</p>
            <p> - Time, measured in hours/minutes</p>
            <p> - Other, simply a number</p>
            <h2>Amount</h2>
            <p>The quantity of [kilometers - hours - other] per [day - week]</p>
            <p>Examples:</p>
            <p>To create a goal of 4 hours of daily piano practice you can choose: </p>
            <p>Title: "Piano", frequency: "daily", type: "time", amount: "4:00"</p>
            <p>To create a goal of 3 yoga sessions per week you can choose: </p>
            <p>Title: "Yoga", frequency: "weekly", type: "other", amount: "3"</p>
            <p>Although I would recommend to use "time" or "distance" as type, so you can better track your progress.</p>
        </div>
    )
}
export default AddGoal;
