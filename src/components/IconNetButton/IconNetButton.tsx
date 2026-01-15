import { useRef, useState } from "react";

export const IconNetButton = ({className = "", request, children, onError,}: { className?: string, request: () => Promise<void>, children: React.ReactNode, onError?: (err: any) =>any}) => {
  const [loading, setLoading] = useState(false);
  const requesting = useRef<boolean>(false);
  const handleClick = async () =>{
    if(requesting.current) return  //-- console.log("already requesting");
    requesting.current = true;
    try{
      await request();

    }catch(err){
      if(onError) onError(err)
    }finally{
    }
  }
  return <div className={className} onClick={handleClick}>{children}</div>
}