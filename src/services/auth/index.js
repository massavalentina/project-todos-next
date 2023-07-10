import axios from "axios"

export const postRegister = async (data) =>{
    const response = await axios.post('http://localhost:8000/auth/', data)
    return response.data
}

export const postLogin = async (loginParams) =>{
    const params = new URLSearchParams(loginParams) // a x-www-...(formato en Swagger)
    return await axios.post('http://localhost:8000/auth/token', params)     //tambien se puede hacer asi
}