import { useEffect, useState } from "react";
import { getProgresses, TProgress } from "../../controllers/days";
import { GenericAbortSignal } from "axios";
import { TProfile } from "../../controllers/friends";

export const useLazyProgress = () =>{
    const [progresses, setProgresses] = useState<TProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    useEffect(() =>{
       // if(!hasMore) return //-- console.log("has no more Progresses");
        const controller = new AbortController()
  
        fetchProgresses(controller.signal);
     
        
        return () => {
            //controller.abort()
        }
    },[index])
    const fetchProgresses = async(signal?: GenericAbortSignal) =>{
        let query = {
            index,  signal
        }
         //-- console.log(query)
        setLoading(true)
    
        getProgresses(query.index, query.signal).then(res =>{
             //-- console.log("getting more Progresses", index, offset, searchText)
            
             //-- console.log({res})
            setProgresses(progresses => {
                if(res.length == 0){
                    setHasMore(false);
                    return progresses;
                }
                if(progresses.length > 20){
                    //  //-- console.log("slicing")
                    // return [...(Progresses.slice(10)), ...res]
                }return [...progresses, ...res]})
            setLoading(false)
        }).catch(err =>{
             //-- console.log({err})
        })
    }
      const getMore = () =>{
        if(!hasMore) return;
        if(loading) return  //-- console.log("already loading")
         //-- console.log("more requested")
        setIndex(index + 1)
    }

    return {progresses, loading, getMore}
}