export const baseUrl =  process.env.NODE_ENV === 'development'? "http://" + window.location.hostname + `:${process.env.REACT_APP_SERVER_PORT}`: process.env.NODE_ENV === "production"? process.env.REACT_APP_API_URL: "";
//-- console.log({baseUrl})
export const protectedUrl = baseUrl + "/protected";
export const assetsUrl = baseUrl + "/file/";
export const dayInMilliseconds = 1000 * 60* 60 *24
export const colors = {
    primary: "rgb(53, 182, 49)",
    error: "rgba(190, 45, 45, 1)",
    backgroundDark: "rgb(20,20,20)"
}
export const todayDate = Date.now();
export const userColors = [
    "rgb(68, 48, 157)",
    "rgb(178, 121, 163)",
    "rgb(53, 162, 164)",
    "rgb(142, 153, 72)",
    "rgb(119, 43, 51)",
    "rgb(84, 146, 57)",
    "rgb(92 53 110)"
] 