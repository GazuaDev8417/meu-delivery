import { FC } from "react"
import { Routes, Route } from "react-router-dom"
import Detail from "../pages/detail/Detail"
import Cart from "../pages/cart/Cart"
import Signup from "../pages/signup/Signup"
import UserAddress from "../pages/address/UserAddress"
import Login from "../pages/login/Login"
import Profile from "../pages/profile/Profile"



const Router:FC = ()=>{
    return(
        <Routes>
            <Route path="/ifuture_react/" element={<Detail/>} />
            <Route path="/ifuture_react/cart" element={<Cart/>} />
            <Route path="/ifuture_react/profile" element={<Profile/>} />
            <Route path="/ifuture_react/signup" element={<Signup/>} />
            <Route path="/ifuture_react/user-address" element={<UserAddress/>} />
            <Route path="/ifuture_react/login" element={<Login/>} />
        </Routes>
    )
}

export default Router