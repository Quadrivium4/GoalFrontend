import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
import { TFriendProgress, useLazyProgress } from "../pages/Friends/useLazyProgress";
type ProgressStateProps = {
    progresses: TFriendProgress[],
    loading: boolean,
    initialLoading: boolean,
    getMore: ()=>void,
    setProgresses: React.Dispatch<React.SetStateAction<TFriendProgress[]>>,
    reload: ()=> Promise<void>
}
type ProgressContextProps = ProgressStateProps | null;
const ProgressContext = createContext<ProgressContextProps>(null);

const ProgressProvider = ({ children }: {children: ReactNode}) => {
    const state = useLazyProgress()
    //const delay = 5000;

    return (
        <ProgressContext.Provider value={{ ...state}}>
            {children}
        </ProgressContext.Provider>
    );
};
const useProgress = () => {
    const progressContext = useContext(ProgressContext);
    if(!progressContext) throw new Error("useMessage shoud be used inside MessageContext!")
    return progressContext;
};
export { ProgressProvider, useProgress };
