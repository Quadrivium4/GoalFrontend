import React, { useEffect, useState } from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import { useUser } from '../../context/AuthContext';
import { IoMdRefresh } from "react-icons/io";
import { PageHeader } from '../../components/PageHeader/PageHeader';
import GraphV2 from './Graph';
import { useStatsV2 } from '../../context/StatsContextV2';
import { usePop } from '../../context/PopContext';
import { MdOutlineInfo } from 'react-icons/md';
function Stats() {
  const user = useUser()
  const {reloadStats} = useStatsV2();
  const {setPop} = usePop();
  
  useEffect(()=>{
    // //-- console.log("stats rerender")
  },[])
  return (
    <>
    <PageHeader title={"Stats"} action={<MdOutlineInfo size={24} onClick={() =>{
      setPop(<>
      <h2>About stats</h2>
      <p>Click on the stats points, to view in detail your activities.</p>
      <p>Once you have opened a point you can also, add activities or edit them.</p>
      </>)
    }}/>} />
    {/* <div className="header">
        <h1>Stats</h1>
        <div className='action'><IoMdRefresh size={24} onClick={reloadStats}/></div>
        
      </div> */}

    <div id='stats' className='content'>

        <GraphV2 />
    </div>
    </>
  );
}

export default Stats;
