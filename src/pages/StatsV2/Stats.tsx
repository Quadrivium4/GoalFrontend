import React, { useEffect, useState } from 'react';
import { useDays } from '../../context/DaysContext';
import "./Stats.css"
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Calendar from './Calendar';
import Graph from './Graph';
import { useUser } from '../../context/AuthContext';
import { StatsProvider, useStats } from '../../context/StatsContext';
import { IoMdRefresh } from "react-icons/io";
import { PageHeader } from '../../components/PageHeader/PageHeader';
function Stats() {
  const user = useUser()
  const {reloadStats} = useStats();
  
  useEffect(()=>{
    // //-- console.log("stats rerender")
  },[])
  return (
    <>
    <PageHeader title={"Stats"} action={<IoMdRefresh size={24} onClick={() =>{
      reloadStats()
    }}/>} />
    {/* <div className="header">
        <h1>Stats</h1>
        <div className='action'><IoMdRefresh size={24} onClick={reloadStats}/></div>
        
      </div> */}

    <div id='stats' className='content'>

        <Graph />
    </div>
    </>
  );
}

export default Stats;
