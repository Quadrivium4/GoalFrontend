import { useState } from "react";

export const NetButton = ({className = "", request, children, onError}: { className?: string, request: () => Promise<void>, children: React.ReactNode, onError?: (err: any) =>any}) => {
  const [loading, setLoading] = useState(false);
  return <button className={className} onClick={async() =>{
    if(loading) return  //-- console.log("already loading");
    setLoading(true);
    
    request().catch(err =>{
      console.log("erroro in net button", {err})
      if(onError)onError(err)
    }).finally(()=>{
      setLoading(false);
    })
    }}>{loading ? "loading..." : children}</button>
}