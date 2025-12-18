import React, { useEffect, useState } from 'react';
import { useMessage } from '../../context/MessageContext';
import { TGoal } from '../../controllers/goals';
import styles from "./FriendSkeleton.module.css"

function FriendSkeleton({n}:{n: number}) {
    let array = [...Array(n)]
    console.log({array})
    return (
        <>

        {
            array.map(n =>{
                return (<div className={styles.friendSkeleton} key={n + Math.random()}>
                <div className={styles.circle}></div>
                
            </div>)
            })
        }
      
        </>
    );
}

export default FriendSkeleton;