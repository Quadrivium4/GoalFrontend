import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
type PopStateProps = {
    title?: string,
    content: React.ReactNode,
    class: string
}
type PopContextProps = {pops: PopStateProps[]} & {
    setPop: (children: React.ReactNode, title?: string) => void,
    closePop: () => any,
    removePop: () => any
} | null;
const PopContext = createContext<PopContextProps>(null);

const PopProvider = ({ children }: {children: ReactNode}) => {
    const [state, setState] = useState<PopStateProps[]>([]);
    //const delay = 5000;
   const setPop = (children: React.ReactNode, title?: string) => {
        setState((prev) => [...prev, {content: children, title, class: "open"}])
   }
   const closePop = () => {
    setState(prev =>{
        let newState = [...prev];
        newState[prev.length- 1] = {...newState[prev.length- 1], class: "close-pop"};
        return newState;
    })
   
   };
   const removePop = () =>{
        setState(prev => {
            //-- console.log({prev})
            const newState = prev.slice(0,-1);
            //-- console.log({newState})
            return newState;
        })
   }
    return (
        <PopContext.Provider value={{ setPop, closePop,removePop, pops: state}}>
            {children}
        </PopContext.Provider>
    );
};
const usePop = () => {
    const popContext = useContext(PopContext);
    if(!popContext) throw new Error("usePop shoud be used inside PopContext!")
    return popContext
};
export { PopProvider, usePop };
