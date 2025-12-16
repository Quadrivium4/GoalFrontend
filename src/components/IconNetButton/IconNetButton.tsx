import { useState } from "react";

export const IconNetButton = ({className = "", request, children, onError,}: { className?: string, request: () => Promise<void>, children: React.ReactNode, onError?: (err: any) =>any}) => {
  const [loading, setLoading] = useState(false);
  return <div className={className} onClick={async() =>{
    if(loading) return console.log("already loading");
    setLoading(true);
    
    request().catch(err =>{
      if(onError)onError(err)
    }).finally(()=>{
      setLoading(false);
    })
    }}>{children}</div>
}