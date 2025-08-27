import { 
    Dispatch, ReactNode, SetStateAction,
    createContext, useState
} from "react"
import { Restaurant, Products, User, Order } from "../types/types"
import axios from "axios"
import { BASE_URL } from "../constants/url"



export interface GlobalStateContext{
    getProfile: () => void
    user:User
    getAllOrders: () => void
    cart:Order[]
    setCart:Dispatch<SetStateAction<Order[]>>
    allFieldsFilled:boolean
    setAllfieldsFilled:Dispatch<SetStateAction<boolean>>
}

type GlobalStateProps = {
    children:ReactNode
}


const Context = createContext<GlobalStateContext | null>(null)


export const GlobalState = (props:GlobalStateProps)=>{
    const [cart, setCart] = useState<Order[]>([])
    const [allFieldsFilled, setAllfieldsFilled] = useState<boolean>(false)
    const [products, setProducts] = useState<Products[]>([])
    const [user, setUser] = useState<User>({
        id:'',
        username:'',
        email:'',
        street:'',
        number:'',
        neighbourhood:'',
        city:'',
        state:'',
        complement:'',
        phone:'',
        cep:''
    })
 


    const getAllOrders = ()=>{
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }
        axios.get(`${BASE_URL}/active_orders`, headers).then(res=>{
            setCart(res.data)
        }).catch(e => console.error(e.response.data))
    }


    const getProfile = ()=>{
        axios.get(`${BASE_URL}/profile`, {
            headers: { Authorization: localStorage.getItem('token') }
        }).then(res=>{
            setUser(res.data)
        }).catch(e => console.error(e.response.data))
    }
    


    return(
        <Context.Provider value={{ 
            getProfile, getAllOrders, cart, setCart, user,
            allFieldsFilled, setAllfieldsFilled
        }}>
            { props.children }
        </Context.Provider>
    )
}

export default Context



