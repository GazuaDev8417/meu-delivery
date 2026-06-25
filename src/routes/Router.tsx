import { FC } from "react"
import { Routes, Route } from "react-router-dom"
import Detail from "../pages/detail/Detail"
import Cart from "../pages/cart/Cart"
import Signup from "../pages/signup/Signup"
import UserAddress from "../pages/address/UserAddress"
import Login from "../pages/login/Login"
import Profile from "../pages/profile/Profile"
import EditProfile from "../pages/editProfile/EditProfile"
import ProfileByAdm from "../pages/profileByAdm/ProfileByAdm"



const Router:FC = ()=>{
    
    

    return(
        <Routes>
            <Route path="/" element={<Detail/>}/>
            <Route path="/cart" element={<Cart/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/edit-profile" element={<EditProfile/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/user-address" element={<UserAddress/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/admprofile" element={<ProfileByAdm/>} />
        </Routes>
    )
}

export default Router