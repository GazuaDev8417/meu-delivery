import { FC } from "react"
import { Routes, Route } from "react-router-dom"
import Detail from "../pages/detail/Detail"
import Cart from "../pages/cart/Cart"
import Signup from "../pages/signup/Signup"
import UserAddress from "../pages/address/UserAddress"
import Login from "../pages/login/Login"
import Profile from "../pages/profile/Profile"
import EditProfile from "../pages/editProfile/EditProfile"
import AdmUser from "../pages/admuser/AdmUser"



const Router:FC = ()=>{
    return(
        <Routes>
            <Route path="/meu-delivery" element={<Detail/>} />
            <Route path="/meu-delivery/cart" element={<Cart/>} />
            <Route path="/meu-delivery/profile" element={<Profile/>} />
            <Route path="/meu-delivery/edit-profile" element={<EditProfile/>} />
            <Route path="/meu-delivery/signup" element={<Signup/>} />
            <Route path="/meu-delivery/user-address" element={<UserAddress/>} />
            <Route path="/meu-delivery/login" element={<Login/>} />
            <Route path="/meu-delivery/admuser" element={<AdmUser/>} />
        </Routes>
    )
}

export default Router