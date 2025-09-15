import { FC, useContext, useEffect, useState } from "react"
import Context, { GlobalStateContext } from "../global/Context"
import { Routes, Route, Navigate } from "react-router-dom"
import Detail from "../pages/detail/Detail"
import Cart from "../pages/cart/Cart"
import Signup from "../pages/signup/Signup"
import UserAddress from "../pages/address/UserAddress"
import Login from "../pages/login/Login"
import Profile from "../pages/profile/Profile"
import EditProfile from "../pages/editProfile/EditProfile"
import AdmUser from "../pages/admuser/AdmUser"
import ProfileByAdm from "../pages/profileByAdm/ProfileByAdm"



const Router:FC = ()=>{
    const { getProfile, user } = useContext(Context) as GlobalStateContext
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    
    
    useEffect(()=>{
        getProfile()
        if(user.role === 'ADM'){
            setIsAuthenticated(true)
        }
    }, [user])

    return(
        <Routes>
            <Route path="/meu-delivery" element={
                isAuthenticated ? <Navigate to='/meu-delivery/admuser'/> : <Detail/>
            }/>
            <Route path="/meu-delivery/cart" element={
                isAuthenticated ? <Navigate to='/meu-delivery/admuser'/> : <Cart/>
             } />
            <Route path="/meu-delivery/profile" element={
                isAuthenticated ? <Navigate to='/meu-delivery/admuser'/> : <Profile/>
            } />
            <Route path="/meu-delivery/edit-profile" element={<EditProfile/>} />
            <Route path="/meu-delivery/signup" element={<Signup/>} />
            <Route path="/meu-delivery/user-address" element={<UserAddress/>} />
            <Route path="/meu-delivery/login" element={<Login/>} />
            <Route path="/meu-delivery/admuser" element={
                !isAuthenticated ? <Navigate to='/meu-delivery'/> : <AdmUser/>                
            } />
            <Route path="/meu-delivery/admprofile" element={
                !isAuthenticated ? <Navigate to='/meu-delivery'/> : <ProfileByAdm/>
            } />
        </Routes>
    )
}

export default Router