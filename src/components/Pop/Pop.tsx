import { ReactNode, useEffect } from "react";
import "./Pop.css"
import { usePop } from "../../context/PopContext";
import { useLocation } from "react-router-dom";

const Pop = ({children, toggle}: {children?: ReactNode, toggle?: () => void}) =>{
    const {closePop, pops} = usePop();
    const location = useLocation();
    useEffect(()=>{
        if(pops.length == 0) return;
        document.body.style.overflow = "hidden";
        // document.documentElement.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = "unset";
            //document.documentElement.style.overflow = 'unset'
        }
    },[pops])
    useEffect(()=>{
        closePop();
    },[location])
    const handleClick = () =>{

        if(toggle) toggle();
        else closePop()
    }
 
    return (
        <>
        {pops.map(pop =>{

       
        //-- console.log("pop");
        return <div key={Date.now() + Math.random()} id="pop-layer" onClick={(e)=>{
            closePop()
            //-- console.log("click in parent");
        }}>
            <div id="pop-up" onClick={(e)=>{
                e.stopPropagation();
                //-- console.log("click in pop")
            }}>
                <div className="header">
                    <h2 className="title">{pop.title}</h2>
                    {/* <div id="close-pop" onClick={handleClick}>
                        <span className="n1"></span>
                        <span className="n2"></span>
                    </div> */}
                </div>
                
                <div id="pop-body">
                    {/* <p>{document.body.style.overflow}</p> */}
                    {pop.content}
                </div>
            </div>
        </div>})}
        </>
        )

}
export default Pop

