const { createContext } = require("react");
import { postRegister, postLogin } from "@/services/auth";
import { useState } from "react";

const defaultProviderValue= {
    login: ()=>{},
    loading: false,
    error: null,
    token: null,
    tokenExpirationDate: null,
    register: ()=> {},
    logout: ()=> {}
}

const AuthContext = createContext(defaultProviderValue);

const AuthProvider = ({children}) =>{
    const [loading, setLoading] = useState(defaultProviderValue.loading)
    const [error, setError] = useState(defaultProviderValue.error)
    const [token, setToken] = useState(defaultProviderValue.token)
    const [tokenExpirationDate, setTokenExpirationDate] = useState(defaultProviderValue.tokenExpirationDate)

    const register = async (data) =>{
        try {
            setLoading(true)
            await postRegister(data)
            setLoading(false)
        } catch (error) {
           setError(error.response.data.detail || 'Internal server error') 
        }
    }

    const login = async (loginParams) =>{
        setLoading(true) 
        try {
            const response = await postLogin(loginParams)
            setToken(response.data.access_token) 
            localStorage.setItem('accessToken', JSON.stringify(response.data.access_token))                            
            const expirationDate = new Date(new Date().getTime() + (1000*60*15))       
            setTokenExpirationDate(expirationDate)                                                  
            localStorage.setItem('expirationDate', JSON.stringify(expirationDate.toISOString()))
        } catch (error) {
            setError(error.response.data.detail || 'Internal server error')
        }
        finally{
            setLoading(false)
        }
    }

    const logout = ()=>{
        setToken(null)
        setTokenExpirationDate(null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('expirationDate')
    }

    const values ={
        login,
        loading,
        error,
        token,
        tokenExpirationDate,
        register,
        logout
    }

    return(
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    )
}


export default AuthProvider