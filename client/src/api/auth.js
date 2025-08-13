import axios from "./axios.js";

export const registroReq = async (user) => {
 const res = await axios.post('/registro', user, {withCredentials: true}) 
 return res
}

export const loginReq = async (user) => {
 const res = await axios.post('/', user) 
 return res
}

export const verifyTokenReq = () => axios.get('/verify', {withCredentials: true})