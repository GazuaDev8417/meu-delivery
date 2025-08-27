import { ChangeEvent, FC, useContext, useEffect } from "react"
import Context, { GlobalStateContext } from "../../global/Context"
import axios from "axios"
import { BASE_URL } from "../../constants/url"
import Header from "../../components/Header"
import { IoIosArrowBack } from "react-icons/io"
import { IoPerson } from "react-icons/io5";
import { MdEdit } from 'react-icons/md'
import { Order } from "../../types/types"
import { useNavigate } from "react-router-dom"
import { Container } from "./styled"
import { productsImages } from '../../constants/index'



interface GroupedOrders{
    orders:Order[]
    total:number
}


const Cart:FC = ()=>{
    const navigate = useNavigate()
    const { 
        cart, setCart, getAllOrders, getProfile, user
    } = useContext(Context) as GlobalStateContext
    const token = localStorage.getItem('token')
    const address = user ? user.street : ''
    const cep = user ? user.cep : ''
    const local = user ? `${user.neighbourhood} - ${user.city}/${user.state}` : ''
    const referencia = user ? user.complement : ''
    const talkTo = user ? user.username.split(' ')[0] : ''
    /* const calculateTotal = (cart:Order[]) =>
        cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0) */
    //const [total, setTotal] = useState<number>(calculateTotal(cart))



    useEffect(()=>{
        if(!token){
            navigate('/ifuture_react/')
            return
        }
        getProfile()
        getAllOrders()            
    }, [])


    /* useEffect(() => {        
        setTotal(cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0))
    }, [cart]) */



    const groupedByRestaurants = ()=>{
        return cart.reduce<Record<string, GroupedOrders>>((groups, item)=>{
            if(!groups[item.restaurant]){
                groups[item.restaurant] = { orders: [], total: 0}
            }
            groups[item.restaurant].orders.push(item)
            groups[item.restaurant].total += Number(item.price) * Number(item.quantity)
            return groups
        }, {})
    }
    

    const handleNumber = (e:ChangeEvent<HTMLInputElement>, id:string)=>{
        const newQuantity = Number(e.target.value)
        const updatedCart = cart.map(item=>{
            if(item.id === id){
                return { ...item, quantity: newQuantity }
            }
            return item
        })

        setCart(updatedCart)
        
        axios.patch(`${BASE_URL}/order/${id}`, {
            quantity: newQuantity
        }).catch(e => alert(e.response.data) )
    }
    

    const removeItem = (cartItem:Order)=>{
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }

        axios.delete(`${BASE_URL}/order/${cartItem.id}`, headers).then(
            () => getAllOrders()
        ).catch(e=>{
            alert(e.response.data)
        })
    }


    const endOrders = (provider:string)=>{
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }

        axios.patch(`${BASE_URL}/finish_orders/${provider}`, null, headers)
            .then(() =>{
                getAllOrders()
                setCart([])
            }
        ).catch(e => console.error(e.response.data))
    }

    /* const confirmClearOrders = ()=>{    
        const decide = window.confirm('Tem certeza que deseja deletar sua lista de pedidos?')
        if(decide){
            cleanOrders()
        }
    } */
    
    
    const endRequests = (provider:string)=>{
        const groups = groupedByRestaurants()
        const group = groups[provider]

        if(!group) return

        const newMsg = group.orders.map(item =>
            `${item.quantity} ${item.product} R$ ${Number(item.price).toFixed(2)}\nTotal R$ ${Number(item.price) * Number(item.quantity)}`
        ).join('\n')
        const totalGroup = `Total Geral R$ ${Number(group.total).toFixed(2)}`
        const mensagemUrl = `Novo pedido:\n\n${newMsg}\n\n${totalGroup}\n\nPara o endereço: ${address}\nCEP: ${cep}\nLocal: ${local}\n${referencia.trim()}\nFalar com: ${talkTo}`
        const url = `https://wa.me/5571984407882?text=${encodeURIComponent(mensagemUrl)}`

        window.open(url, '_blank')  
        endOrders(provider)      
    }
    
        


    return(
        <>
        <Header
            leftIcon={
                <IoIosArrowBack 
                    className="header-icon"
                    onClick={()=> navigate(-1)} />
            }
            center={ <div/> }
            rightIcon={
                <IoPerson className="header-icon"
                onClick={() => navigate('/ifuture_react/profile')} />
            }/>
        <Container>
            <h1>Meu Carrinho</h1>
            <hr style={{width:'100%', marginBottom:'15px', background:'lightgray'}} />
            <div className="address-section">
                <div>
                    <b>Endereço</b>: {address} {user.number ? user.number : 'S/N'}<br />
                    <b>CEP</b>: {cep}<br />
                    <b>Local</b>: {local}<br />
                    <b>Ponto de referência</b>: {referencia} <br />
                    <b>Falar com</b>: {talkTo}
                </div>
                <MdEdit className="icon" onClick={()=> {
                    navigate('/ifuture_react/user-address')
                }} />
            </div>
            {/* {!fullAddress && (
                <div>
                    Necessário efetuar login.<br />
                    Clique no ícone do lápis para adicionar
                </div>
            )} */}
            {/* {cart.length > 0 && (
                <button 
                    type="button"
                    style={{padding:10, color:'white', marginTop:30, fontSize:'1rem'}}
                    onClick={confirmClearOrders}>
                    Limpar Lista
                </button>
            )} */}
            <div className="addressAndName">
                <div className="rest-name">Seus produtos</div>
            </div>
            <hr style={{width:'100%', marginBottom:'15px', background:'lightgray'}} />
            {cart.length > 0 ? Object.entries(groupedByRestaurants()).map(([restaurant, group])=>(
                <div key={restaurant} className="card-container">
                    {group.orders.map(item => (
                        <div key={item.id} className="card">
                            <span>
                                <img src={productsImages[item.photoUrl]}  alt="Imagem do produto" />
                            </span>
                            <span>
                                <div className="product-name">{item.product}</div>
                                <div className="product-details">
                                    <b>Quantidade: </b>{item.quantity} <br />
                                    <b>Preço: </b>R$ {Number(item.price).toFixed(2)} <br />
                                    <b>Total: </b>R$ {(Number(item.price) * Number(item.quantity)).toFixed(2)} <br />
                                </div>
                            </span>
                            <div className="btn-container">
                                <input 
                                    type="number"
                                    min={1} 
                                    value={item.quantity}
                                    onChange={(e) => handleNumber(e, item.id)}
                                    className="input-number" />                 
                                <button className="btn-remove" onClick={()=> removeItem(item)} >Remover</button> 
                            </div>
                        </div>
                    ))}
                    <div className="total-container">
                        <div className="totalByGroup"><b>Total</b>: R$ {Number(group.total).toFixed(2)}</div>
                        <hr style={{background:'lightgray', margin:'3px', width:'10%'}} />
                        <button 
                            className="requestOrder-btn"
                            style={{background: cart.length > 0 && user ? 'red' : 'gray'}}
                            disabled={cart.length === 0 || !user}
                            onClick={() => endRequests(restaurant)}>
                            Finalizar Pedido
                        </button>
                        <hr style={{width:'20%', marginBottom:'15px', marginTop:'10px', background:'lightgray'}} />
                    </div>
                </div>
            )) : <div style={{margin:10}}>Você ainda não fez nenhum pedido</div> }
            {/* <div className="select-container">
                <div className="total-price">Total da compra: R$ {Number(total).toFixed(2)}</div>
            </div>
            <button 
                className="requestOrder-btn"
                style={{background: cart.length > 0 && fullAddress ? 'red' : 'gray'}}
                disabled={cart.length === 0 || !fullAddress}
                onClick={() => endRequests()}>
                Finalizar Pedido
            </button> */}
        </Container>
        </>
    )
}

export default Cart