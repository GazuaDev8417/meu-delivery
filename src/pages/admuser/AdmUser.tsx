import { useContext, useEffect, useState, useRef } from 'react'
import Context, { GlobalStateContext } from '../../global/Context'
import { useNavigate } from 'react-router-dom'
import { MdEdit } from 'react-icons/md'
import { AiOutlineLogout } from 'react-icons/ai'
import Header from "../../components/Header"
import formatPhoneNumber from '../../utils/formatPhoneNumber'
import { Container } from './styled'
import { BASE_URL } from '../../constants/url'
import axios from 'axios'
import { Order } from '../../types/types'




const AdmUser = ()=>{
    const cartRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { user, getProfile } = useContext(Context) as GlobalStateContext
    const token = localStorage.getItem('token')
    const [orders, setOrders] = useState<Order[]>([])
  
  

    useEffect(()=>{
        if(!token){
            navigate('/meu-delivery')
        }
    }, [])


    useEffect(()=>{
        if(orders.length > 0){
            cartRef.current?.scrollIntoView({ behavior:'smooth', block:'end'})
        }
    }, [])

    
    useEffect(()=>{
        if(token){
            getProfile()
            orderHistory()
        }        
    }, [])



    const orderHistory = ()=>{
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }

        axios.get(`${BASE_URL}/orders`, headers).then(res=>{
            setOrders(res.data)
        }).catch(e => console.error(e.response.data))
    }


    const logout = ()=>{
        const decide = window.confirm('Tem certeza que deseja deslogar?')

        if(decide){
            localStorage.clear()
            navigate('/meu-delivery/login')
        }
    }


    const deleteOrder = (id:string)=>{
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }

        axios.delete(`${BASE_URL}/order/${id}`, headers).then(()=>{
            setOrders(prevOrders => prevOrders.filter(order => order.id !== id))
            orderHistory()
        }).catch(e => alert(e.response.data))
    }
    
    


    
    return(
        <>
        <Header
            rightIcon={
                <AiOutlineLogout className="header-icon" onClick={logout} />
            }
            /* center={<h2 className="logo-title">DISK90 DELIVERY</h2>} */
            leftIcon={ <div/> }/>        
        <Container>    
            <h1>Usuário ADM</h1>            
            <hr style={{width:'100%', marginBottom:'15px', background:'lightgray'}} />
            <div className="user-section">
                <div>
                    <span className='properties'>Nome:</span> {user.username} <br />
                    <span className='properties'>Email:</span> {user.email} <br />
                    <span className='properties'>Telefone:</span> {formatPhoneNumber(user.phone)}
                </div>
                <MdEdit className="icon" onClick={()=> navigate('/meu-delivery/edit-profile')} />
            </div>
            <div className="address-section">
                <div style={{width:'100%'}}>
                    <div className='registered-address'>Endereço cadastrado:</div>
                    <div style={{maxWidth:'90%'}}>
                        <span className="properties">Local:</span> {user.street} {user.number ? user.number : 'S/N'} <br />
                        <span className="properties">Bairro:</span> {user.neighbourhood} <br />
                        <span className="properties">Cidade/Estado:</span> {user.city} - {user.state} <br />
                        <span className="properties">CEP:</span> {user.cep}
                    </div>
                </div>
                <MdEdit className="icon" onClick={()=> {
                    navigate('/meu-delivery/user-address', { state: { mode: 'update' } })
                }}/>
            </div>
            <div className="addressAndName">
                <div className="rest-name"></div>
                <div></div>
            </div>
            {/* {orders.length > 0 && <button type="button" style={{padding:10, color:'white'}} onClick={cleanHistory}>
                Limpar Histórico
            </button>} */}
            <div id='history' className="order-history">Lista de pedido ativos</div>
            <hr style={{width:'100%', marginBottom:'15px', background:'lightgray'}} />
            <div className="card-container" ref={cartRef}>
                {orders && orders.map(order=>(
                    <div className="card" key={order.id}>
                        <div className="card-content">
                            <div className="rest-name">{order.product} R$ {Number(order.price).toFixed(2)}</div>
                            <b>Pedido feito em:</b> {order.moment} <br/>
                            <b>Quantidade:</b> {order.quantity}<br/>
                            <b>Total:</b> R$ {Number(order.total).toFixed(2)}<br/>
                            <b>Pagamento:</b> {order.paymentmethod === 'money' ? 'Dinheiro' : 'Crédito'}<br/>
                        </div>
                        <div className="btn-container">
                            {/* <MdDelete className='icon' style={{
                                    color: hoveredItemId === order.id ? 'red' : 'black'
                                }}
                                onMouseOver={() => setHoveredItemId(order.id)}
                                onMouseOut={() => setHoveredItemId('')}
                                onClick={() => deleteOrder(order.id)}/> */}
                            <button onClick={() => deleteOrder(order.id)}>Remover pedido</button>
                            <button onClick={() =>{
                                localStorage.setItem('client', order.client)
                                navigate('/meu-delivery/admprofile')
                            }}>Ver pedido</button>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
        </>
    )
}

export default AdmUser