import { useEffect, useRef, useState } from "react";
import { getProgresses, TProgress } from "../../controllers/days";
import { GenericAbortSignal } from "axios";
import { TProfile } from "../../controllers/friends";
import { TUser } from "../../context/AuthContext";
import { TGoal } from "../../controllers/goals";
import { wait } from "@testing-library/user-event/dist/utils";
export type TFriendProgress = TProgress & {
    user: TUser,
    goal: TGoal
}
export const useLazyProgress = () => {
    const [progresses, setProgresses] = useState<TFriendProgress[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const requestingRef = useRef(false);
    const resettingRef = useRef(false);

    useEffect(() => {
        setLoading(true)
        if (progresses.length == 0 && hasMore) setInitialLoading(true);

        const controller = new AbortController()
        fetchProgresses(controller.signal);


        return () => {

            controller.abort()
        }
    }, [index])
    const resetProgresses = async (signal?: GenericAbortSignal) => {


        getProgresses(0, signal).then(res => {
            

            //-- console.log({res})
            setProgresses(progresses => {
                return res
            })
            if (index > 0) setIndex(0)
            setLoading(false)
            if (initialLoading) setInitialLoading(false);
            requestingRef.current = false;
        }).catch(err => {
            setLoading(false)

            //if(initialLoading) setInitialLoading(false)
            requestingRef.current = false;
            //-- console.log({err})
        })
    }
    const fetchProgresses = async (signal?: GenericAbortSignal) => {
        // await wait(1000)
        let query = {
            index, signal
        }
        ////-- console.log({query})
        //await wait(3000)
        //-- console.log(query)

        try {
            const res = await getProgresses(query.index, query.signal);



            setProgresses(progresses => {
                if (res.length == 0) {
                    setHasMore(false);
                    return progresses;
                }
                else if (progresses.length > 0 && query.index == 0) {
                    ////-- console.log("resetting progresses")

                    return [...res]
                }

                else if (progresses.length > 20) {
                    //  //-- console.log("slicing")
                    // return [...(Progresses.slice(10)), ...res]
                } return [...progresses, ...res]
            });
            setLoading(false)
            if (initialLoading) setInitialLoading(false);
            requestingRef.current = false;
        } catch (error) {



            setLoading(false)

            //if(initialLoading) setInitialLoading(false)
            requestingRef.current = false;
            //-- console.log({error})
        }
    }
    const getMore = () => {
        if (!hasMore) return;
        if (requestingRef.current) return;
        requestingRef.current = true; //-- console.log("already loading")
        //-- console.log("more requested")
        setIndex(index + 1)
    }

    const reload = async () => {
        ////-- console.log("reloading lazy friends",requestingRef.current)
        if (requestingRef.current) return;
        await fetchProgresses();
        // requestingRef.current = true;
        setIndex(0);
        setHasMore(true)
    }
    return { progresses, loading, getMore, setProgresses, reload, initialLoading }
}