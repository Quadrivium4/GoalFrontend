import axios, { AxiosError, CanceledError } from "axios";
import { baseUrl, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, protectedUrl, userColors } from "./constants";
import { resolve } from "path";
import { error } from "console";
import { TFile } from "./components/ProfileIcon/ProfileIcon";
import { getCloudinarySignature } from "./controllers/user";

const delay = 3000;
const wait = async (data: any, headers: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
            //-- console.log({data, headers})
        }, delay)
    })

}
type TCancelTokens = Record<string, AbortController>;
type TBackendError = AxiosError & {
    response?: {
        data: {
            message: string,
            errorCode: number
        }
    }
}
export const api = axios.create({
    baseURL: baseUrl
});

type CustomError = {
    message: string,
    errorCode: number
};
// const apiCancelTokens: TCancelTokens = {};
// // api.get("http://localhost:5000/file/67efe06093efb4d6a102af84")
// api.interceptors.request.use((config)=>{
//     if(!config.url) config.url = "";
//     if(!config.baseURL) config.baseURL = "";
//     let fullUrl = config.baseURL + config.url;

//     // //-- console.log({fullUrl})
//     if(apiCancelTokens[fullUrl]){
//         // Cancel previous request;
//         // //-- console.log("canceling request", fullUrl)
//         apiCancelTokens[fullUrl].abort("duplicated")
//     }else{
//         let controller = new AbortController();
//         apiCancelTokens[fullUrl] = controller;
//         config.signal = controller.signal;
//     }
//     // //-- console.log({config})
//     return config;

// },(error)=>{
//      //-- console.log({error})
// })
api.interceptors.response.use(function (response) {

    //-- console.log({response});
    return response
}, function (error: TBackendError) {
    console.log("error intercepted", error)
    if (error.response) {
        if(error.response.data){
            const { message, errorCode } = error.response.data;
            throw { message, errorCode }
        }else{
            throw {message: "Server Error, try again later", errorCode: 500}
        }
        
    }
    // //-- console.log({error});
    throw error
}
)
//api.get("https://stackoverflow.com/questions/51447021/how-to-handle-api-call-error-with-jquery-ajax").then(resp=>  //-- console.log({resp})).catch(err =>  //-- console.log(err))

// export const protectedApi = () => {
//    // let aToken = localStorage.getItem("aToken");
//     //if(!aToken) return 0;
//     //if(delay) await setTimeout(()=>{}, delay)
//     return axios.create({
//     baseURL: protectedUrl,
//     headers: {
//         "Authorization":  "Bearer " + localStorage.getItem("aToken"),
//     }
// })
// }

export const protectedApi = axios.create({
    baseURL: protectedUrl,
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("aToken"),
    }
})
export const updateProtectedApiToken = (token: string) => {
    //-- console.log("updating token", token)
    // //-- console.log(protectedApi.defaults.headers)
    protectedApi.defaults.headers.common["Authorization"] = "Bearer " + token;
    protectedApi.defaults.headers["Authorization"] = "Bearer " + token;
    //-- console.log(protectedApi.defaults.headers);
}
protectedApi.interceptors.response.use(function (response) {

    // //-- console.log({response});
    return response
}, function (error: TBackendError) {
    console.log("error intercepted", error)
    if (error.response) {
        if(error.response.data){
            const { message, errorCode } = error.response.data;
            throw { message, errorCode }
        }else{
            throw {message: "Server Error, try again later", errorCode: 500}
        }
        
    }
    // //-- console.log({error});
    throw error
}
)
// type TOverrideRequestError = {
//     url: string
// };
// let cancelTokens: TCancelTokens ={};
// protectedApi.interceptors.request.use((config)=>{
//     let aToken = localStorage.getItem("aToken");
//     if(aToken) config.headers.Authorization =  "Bearer " + aToken;

//     if(!config.url) config.url = "";
//     if(!config.baseURL) config.baseURL = "";
//     let fullUrl = config.baseURL + config.url;

//     // //-- console.log({fullUrl})
//     if(cancelTokens[fullUrl]){
//         // Cancel previous request;
//         // //-- console.log("canceling request", fullUrl)
//         cancelTokens[fullUrl].abort("duplicated")
//     }else{
//         let controller = new AbortController();
//         cancelTokens[fullUrl] = controller;
//         config.signal = controller.signal;
//     }
//     // //-- console.log({config})
//     return config;

// },(error)=>{
//      //-- console.log({error})
// })

// protectedApi.interceptors.response.use((response)=>{

//     // //-- console.log({response});
//     return response
// }, function(error: TBackendError){
//     if( error instanceof CanceledError){

//         throw error
//     }
//     if(error.response){
//         const {message}  = error.response.data;
//         throw new Error(message)
//     }
//     // //-- console.log({error});
//     return error
//     return [null, error]
// }
// )

export const getTimeAmount = (timeInMinutes: number) => {
    return Math.floor(timeInMinutes / 60) + ":" + (timeInMinutes % 60).toString().padStart(2, "0");
}
export const getNormalizedPercentage = (max: number, value: number, dayDiveder = 1) => {
    let percentage = Math.round(100 / (max / dayDiveder) * value);;
    if (percentage > 100) return 100
    return percentage
}
export const getToday = () => {
    //let now = new Date()
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    return now
}
export const getLastMonday = (date: number | Date) => {
    date = new Date(date);
    date.setDate(date.getDate() - (date.getDay() + 6) % 7);
    date.setHours(0, 0, 0, 0);
    return date;
}
export const nextWeekTime = (date: number | Date) => {
    date = new Date(date);
    date.setDate(date.getDate() + 7);
    return date;
}
export const isToday = (date: number | Date) => {
    let date1 = new Date(date);
    date1.setHours(0, 0, 0, 0);
    let today = getToday();
    return today.getTime() === date1.getTime();
}
export function getRandomColorNumber() {
    return (Math.random() * 180).toFixed(0)
}
export function getRandomColor() {
    return `rgb(${getRandomColorNumber()},${getRandomColorNumber()},${getRandomColorNumber()})`;
}
export function getRandomUserColor(userId: string) {
    userId = userId.substring(18)
    let number = parseInt(userId, 16);
    //  //-- console.log({before: number})
    number = number % userColors.length;
    // //-- console.log({after: number});
    return userColors[number]
}

export const uploadImageToCloudinary = async (image: File, onProgress?: (progress: number)=>void, public_id?: string): Promise<TFile> => {
    //const signatureResult = await getCloudinarySignature()
    
    const formData = new FormData();
    const comporessedImage= await compressImage(image);
    formData.append('file', comporessedImage);
    //formData.append('upload_preset', "ml_default");
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("upload_preset", "ml_default")
    const request = new XMLHttpRequest();
    request.upload.addEventListener("progress", (e)=>{
     //-- console.log("progress", e.loaded, e.total, e.loaded/e.total * 100);
        if(onProgress)onProgress(e.loaded / e.total * 100);
    })
    request.open("post", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    request.send(formData);
    const p:TFile =  await new Promise((resolve, rejecct) =>{
         request.addEventListener("loadend", (e)=>{
            if(onProgress) onProgress(100);
         //-- console.log("loadend", request.response);
            resolve( JSON.parse(request.response));
        })
    })
    

    return p;
};
function compressImage(file: File, maxWidth = 800, maxHeight = 700, quality = 0.7): Promise<string> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target!.result as string;
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
            if(!ctx) return console.log("not context")
          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
      });
    }
export function isMobile(): boolean {

    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
};
