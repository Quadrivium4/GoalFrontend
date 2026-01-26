import { GenericAbortSignal } from "axios"
import { TFile } from "../components/ProfileIcon/ProfileIcon"
import { TMyGoal } from "../context/DaysContext"
import { protectedApi } from "../utils"
import { TGoal } from "./goals"

export type TLike = {
    userId: string,
    username: string,
    profileImg: TFile
}
export type TProgress = {
    _id: string,
    date: number,
    amount: number,
    goalId: string,
    goalAmount: number;
    notes: string,
    userId: string,
    likes: TLike[]
}
export type TGoalAmountType = "distance" | "time" | "other"
export type TDayGoal = {
    title: string,
    goalId: string,
    type: TGoalAmountType,
    amount: number,
    progress: number,
    frequency: "daily" | "weekly" | "monthly"
}
export type TDayForm = {
    date: number,
    progress: number,
    history: TProgress[],
    goal: TGoal
}
export type TDay = {
    date: Date,
    progresses: TProgress[]
}
export type TStats = {
    _id: string,
    days: TDay[],
    title: string
};
export type TGoalDays =  TGoal & {
    days: TProgress[]
}
export type TStat = TGoal & {
    days: TDay[][]
}
export type TProgressForm = Omit<TProgress, "likes">;
export function wait(duration: number){
    return new Promise((resolve, reject) => setTimeout(resolve, duration))
}
const getProgresses = async(index: number, controller?: GenericAbortSignal): Promise<TProgress[]> => {
    let date = new Date()
    let res = await protectedApi.get("/lazy-progress", {params: { index, timestamp: date.getTime()}, signal: controller});
    return res.data;
}
const getDays = async(userId?: string):Promise<TMyGoal[]> =>{

    let res = await protectedApi.get("/progress", {params: {timestamp: Date.now(), id: userId}});
    return res.data;
}
const getStats = async(userId?: string):Promise<TGoalDays[]> =>{
    // //-- console.log("mine", {userId})
    let res = await protectedApi.get(userId? "/stats/" + userId : "/stats");
    return res.data;
}
const addProgress = async(goalId: string, amount: number, notes: string, date: number): Promise<TProgress> =>{
    let res = await protectedApi.post("/progress", {goalId, amount, date, notes});
    return res.data;
}
const updateProgress = async(progress: TProgress): Promise<TProgress> =>{
    let res = await protectedApi.put("/progress", progress);
    return res.data;
}
const deleteProgress = async(progressId: string): Promise<TProgress> =>{
    let res = await protectedApi.delete("/progress", {params: {id: progressId}});
    return res.data;
}
let dayControllers = {
    getDays,
    addProgress,
    getStats,
    updateProgress,
    deleteProgress
}
export default dayControllers
export {
    getDays,
    addProgress,
    getStats,
    updateProgress,
    deleteProgress,
    getProgresses
}
