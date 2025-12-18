import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
type AppLoadingStateProps = {
    loading: boolean
}
type AppLoadingContextProps = AppLoadingStateProps & {
    setLoading: (state: boolean) => void
} | null
const AppLoadingContext = createContext<AppLoadingContextProps>(null);

const AppLoadingProvider = ({ children }: {children: ReactNode}) => {
    const [state, setState] = useState<AppLoadingStateProps>({loading: false});
    //const delay = 5000;
    const setLoading = (state: boolean) =>{
        setState({loading: state})
    }
    return (
        <AppLoadingContext.Provider value={{ ...state, setLoading}}>
            {children}
        </AppLoadingContext.Provider>
    );
};
const useAppLoading = () => {
    const appLoadingContext = useContext(AppLoadingContext);
    if(!appLoadingContext) throw new Error("useMessage shoud be used inside MessageContext!")
    return appLoadingContext;
};
export { AppLoadingProvider, useAppLoading };
