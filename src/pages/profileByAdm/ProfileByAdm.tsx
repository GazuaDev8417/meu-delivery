import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import Header from "../../components/Header"
import formatPhoneNumber from '../../utils/formatPhoneNumber'
import { Container } from './styled'
import { BASE_URL } from '../../constants/url'
import axios from 'axios'
import { Order, User } from '../../types/types'




const ProfileByAdm = ()=>{
    const cartRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const client = localStorage.getItem('client')
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedUser, setSelectedUser] = useState<User>({
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
        cep:'',
        role:''
    })
  

    useEffect(()=>{
        if(!token){
            navigate('/meu-delivery')
            return
        }
    }, [])


    const getProfileByUser = (id:string)=>{
        axios.get(`${BASE_URL}/profile/${id}`, {
            headers: { Authorization: localStorage.getItem('token') }
        }).then(res=>{
            setSelectedUser(res.data)
        }).catch(e => console.error(e.response.data))
    }

    const getAllOrdersByUser = (id:string)=>{
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }
        axios.get(`${BASE_URL}/user/active_orders/${id}`, headers).then(res=>{
            setOrders(res.data)
        }).catch(e => console.error(e.response.data))
    }
    
    
    useEffect(()=>{
        if(client){
            getProfileByUser(client)  
            getAllOrdersByUser(client)
        }
    }, [])


    useEffect(()=>{
        if(orders.length > 0){
            cartRef.current?.scrollIntoView({ behavior:'smooth', block:'start'})
        }
    }, [orders])
    


    
    return(
        <>
        <Header
            rightIcon={
                <div/>
            }
            leftIcon={ <IoIosArrowBack className='header-icon' onClick={() => navigate(-1)}/> }/>        
        <Container>    
            <h1>Perfil do usuário</h1>            
            <hr style={{width:'100%', marginBottom:'15px', background:'lightgray'}} />
            <div className="user-section">
                <div>
                    <span className='properties'>Nome:</span> {selectedUser.username} <br />
                    <span className='properties'>Email:</span> {selectedUser.email} <br />
                    <span className='properties'>Telefone:</span> {formatPhoneNumber(selectedUser.phone)}
                </div>
            </div>
            <div className="address-section">
                <div style={{width:'100%'}}>
                    <div className='registered-address'>Endereço cadastrado:</div>
                    <div style={{maxWidth:'90%'}}>
                        <span className="properties">Local:</span> {selectedUser.street} {selectedUser.number ? selectedUser.number : 'S/N'} <br />
                        <span className="properties">Bairro:</span> {selectedUser.neighbourhood} <br />
                        <span className="properties">Cidade/Estado:</span> {selectedUser.city} - {selectedUser.state} <br />
                        <span className="properties">CEP:</span> {selectedUser.cep}
                    </div>
                </div>
            </div>
            <div className="addressAndName">
                <div className="rest-name"></div>
                <div></div>
            </div>
            <div id='history' className="order-history">Pedidos ativos de {(selectedUser.username).split(' ')[0]}</div>
            <hr style={{width:'100%', marginBottom:'15px', background:'lightgray'}} />
            <div className="card-container" ref={cartRef}>
                {orders && orders.map(order=>(
                    <div className="card" key={order.id}>
                        <div className="card-content">
                            <div className="rest-name">{order.product} R$ {Number(order.price).toFixed(2)}</div>
                            <b>Pedido feito em:</b> {order.moment} <br/>
                            <b>Quantidade:</b> {order.quantity}<br/>
                            <b>Total:</b> R$ {Number(order.total).toFixed(2)}<br/>
                            <b>Situação:</b> {order.state === 'FINISHED' ? 'Concluído' : 'Pendente'}<br/>                            
                        </div>
                    </div>
                ))}
            </div>
        </Container>
        </>
    )
}

export default ProfileByAdm