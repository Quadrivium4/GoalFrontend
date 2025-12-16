import { ReactNode, useState, useEffect } from "react";
import styles from "./SelectInfo.module.css"
const tuple = <T extends string[]>(...args: T) => args;

function Select<T extends string>({options, placeholder, onSelect, selected} : {options: {name: T, description: string}[], placeholder: string, onSelect: (selectedOption: T|"")=> void, selected?: T}) {
    const [isActive, setIsActive] = useState(false);
    const [selectedOption, setSelectedOption] = useState<T | "">(selected || "");
    useEffect(()=>{
        onSelect(selectedOption);
    },[selectedOption])
    return (
        <div className={styles.customSelect} style={{borderRadius: !isActive? 5 : undefined}}>
            {selectedOption? <p onClick={()=> setIsActive(prev => !prev)}>{selectedOption}</p> : <p className="placeholder" onClick={()=> setIsActive(true)}>{placeholder}</p>}
            <div className="options-wrapper">

           
            <div className={["options", isActive? "active" : null].join(" ")}>
            {
                options.map((option)=>{
                    return (
                    <div className="option" key={option.name} onClick={()=>{
                        setIsActive(false)
                        setSelectedOption(option.name)
                    }}>
                        <p className="">{option.name}</p>
                        <p className="description"></p>
                    </div>)
                })
            }
            </div>
            </div>
        </div>)
}
export default Select

