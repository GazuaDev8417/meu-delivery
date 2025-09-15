import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from "react"
import Context, { GlobalStateContext } from "../../global/Context"
import axios from "axios"
import { BASE_URL } from "../../constants/url"
import Header from "../../components/Header"
import { IoPersonOutline } from "react-icons/io5"
import { IoIosArrowBack } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { Order } from "../../types/types"
import { useNavigate } from "react-router-dom"
import { Container } from "./styled"
import { productsImages } from '../../constants/index'
import MpModal from "../../components/MpModal"
import { initMercadoPago } from "@mercadopago/sdk-react"




initMercadoPago(import.meta.env.VITE_PUBLIC_KEY_TP)

const Cart:FC = ()=>{
    const navigate = useNavigate()
    const qrCodeRef = useRef<HTMLDivElement>(null)
    const cartRef = useRef<HTMLDivElement>(null)
    const { 
        cart, setCart, getAllOrders, getProfile, user
    } = useContext(Context) as GlobalStateContext
    const token = localStorage.getItem('token')
    /* ENDEREÇO DO CLIENTE */
    const address = user ? user.street : ''
    const cep = user ? user.cep : ''
    const local = user.neighbourhood ? `${user.neighbourhood} - ${user.city}/${user.state}` : ''
    const referencia = user ? user.complement : ''
    const talkTo = user ? user.username.split(' ')[0] : ''
    /* TOTAL DO CARRINHO */
    const calculateTotal = (cart:Order[]) =>
        cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0)
    const [total, setTotal] = useState<number>(calculateTotal(cart))
    /* MODAL */
    const [mpModalOpen, setMpModalOpen] = useState<boolean>(false)
    /* ORDERM DE PAGAMENTO */
    const [status, setStatus] = useState<string>('')
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null)
    const [qrCodeLink, setQrCodeLink] = useState<string | null>(null)
    const [method, setMethod] = useState<'pix' | 'boleto' | 'card' | null>(null)
    const hasQrCode = !!(qrCode || qrCodeBase64 || qrCodeLink)
    


    useEffect(()=>{
        if(!token){
            navigate('/meu-delivery')
            return
        }
        getProfile()
        getAllOrders()            
    }, [])

    useEffect(() => {        
        setTotal(cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0))
    }, [cart])    

    useEffect(()=>{
        const handleKeydown = (e:KeyboardEvent)=>{
            if(e.key === 'Escape' || e.key === 'Esc'){
                setMpModalOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeydown)
        return () =>{
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [])

    useEffect(()=>{
        if(hasQrCode && qrCodeRef.current){
            qrCodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }else if(cart.length > 0 && cartRef.current){
            cartRef.current?.scrollIntoView({ behavior:'smooth', block:'start'})
        }
    }, [hasQrCode, cart])

    

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


    const removeItem = (id:string)=>{
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }

        axios.delete(`${BASE_URL}/order/${id}`, headers).then(() =>{
            setCart(prevOrders => prevOrders.filter(order => order.id !== id))
            getAllOrders()
        } 
        ).catch(e=>{
            alert(e.response.data)
        })
    }


    const endOrders = ()=>{
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }
        const body = { paymentMethod: method }

        axios.patch(`${BASE_URL}/finish_orders`, body, headers)
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
    
    
    const endRequests = ()=>{

        if(cart.length === 0) return

        const newMsg = cart.map(item =>
            `${item.quantity} ${item.product} R$ ${Number(item.price).toFixed(2)}\nTotal R$ ${Number(item.price) * Number(item.quantity)}\n\n`
        ).join('\n')
        const totalGroup = `Total Geral R$ ${Number(total).toFixed(2)}`
        const mensagemUrl = `Novo pedido:\n\n${newMsg}\n\n${totalGroup}\n\nPara o endereço: ${address}\nCEP: ${cep}\nLocal: ${local}\n${referencia.trim()}\nFalar com: ${talkTo}`
        const url = `https://wa.me/557184407882?text=${encodeURIComponent(mensagemUrl)}`
/* 82354215 */
        window.open(url, '_blank')  
        endOrders()     
    }

    /* const confirmEndRequest = ()=>{
        const decide = window.confirm('Aqui você apenas notifica o vendedor sobre seu pedido, mas não efetua o pagamento.')
        if(decide) endRequests()
    } */


    const handlePix = async()=>{
        alert('Como se trata de um projeto demonstrativo o pagamento não é realizado realmente')
        try{
            const res = await axios.post(`${BASE_URL}/pay`, {
                paymentMethodId: 'pix',
                email: user.email,
                items: cart.map(item => ({
                    title: item.product,
                    quantity: item.quantity,
                    unit_price: Number(item.price)
                }))
            })
            
            setStatus(res.data.status)
            setQrCode(res.data.qr_code || null)
            setQrCodeBase64(res.data.qr_code_base64 || null)
            setQrCodeLink(res.data.qr_code_link || null)

            const orderId = res.data.id;
            const interval = setInterval(async () => {
                const statusRes = await fetch(`${BASE_URL}/payment-status/${orderId}`)
                const statusData = await statusRes.json();
                
                if (statusData.status === 'approved') {
                    clearInterval(interval);
                    alert('Pagamento com Pix aprovado! 🎉');
                }else if(statusData.status === 'pending'){
                    console.error('Pagemento pendente')
                }
            }, 5000)
        }catch(e){
            if(axios.isAxiosError(e)){
                console.error(e.response?.data || 'Erro ao processar pagamento')
            }else{
                console.error('Erro inesperado, tente novamente: ', e)
            }
        }
    }

    const handlePaymentCard = ()=>{
        alert('Como se trata de um projeto demonstrativo o pagamento não é realizado realmente')
        setQrCode(null)
        setQrCodeBase64(null)
        setQrCodeLink(null)

        setMethod('card')
        setMpModalOpen(true)
    }

    
    

    return(
        <>
        <Header
            leftIcon={ <IoIosArrowBack className='header-icon' onClick={() => navigate(-1)}/> }
            /* center={ <h2 className="logo-title">DISK90 DELIVERY</h2> } */
            rightIcon={
                <IoPersonOutline className="header-icon"
                    onClick={() => navigate('/meu-delivery/profile')} />
            }/>
        <Container $hasqrcode={hasQrCode}>
            <h1>Meu Carrinho</h1>
            <hr style={{width:'100%', marginBottom:'15px', background:'lightgray'}} />
            <div className="address-section">
                <div>
                    <b>Endereço</b>: {address ? (user.number ? user.number : 'S/N') : ''}<br />
                    <b>CEP</b>: {cep}<br />
                    <b>Local</b>: {local}<br />
                    <b>Ponto de referência</b>: {referencia} <br />
                    <b>Falar com</b>: {talkTo}
                </div>
                <MdEdit className="icon" onClick={()=> {
                    navigate('/meu-delivery/user-address', { state: { mode: 'cart' }})
                }} />
            </div>
            <div className="addressAndName">
                <div className="rest-name">Seus produtos</div>
            </div>
            <hr style={{width:'100%', marginBottom:'15px', background:'lightgray'}} />
            {/* CARD DOS PRODUTOS NO CARRINHO */}
            <div className="cart-container" ref={cartRef}>
                {cart.length > 0 ? cart.map(item =>(
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
                            <button className="btn-remove" onClick={()=> removeItem(item.id)} >Remover</button> 
                        </div>                        
                    </div>                
                )) : <div style={{margin:10}}>Você ainda não fez nenhum pedido</div> }
            </div>
            {/* MEIOS DE PAGAMENTO */}
            {mpModalOpen && method === 'card' && (
                <MpModal setModalOpen={setMpModalOpen} setQrCode={setQrCode} total={total}/>
            )}
            {/* QRCODE E PIX */}
            {method === 'pix' && (qrCode || qrCodeBase64 || qrCodeLink) && (
                <div ref={qrCodeRef} style={{marginTop:'1.5rem', paddingBottom:'110px'}}>
                    <p>Escaneie o QR Code para pagar:</p>
                    {qrCodeBase64 ? (
                        <img
                            width='200'
                            src={`data:image/png;base64,${qrCodeBase64}`}
                            alt="QR Code Pix"/>
                    ) : qrCode ? (
                        <img
                            width='200'
                            src={`https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(qrCode!)}`}
                            alt="QR Code Pix"/>
                    ) : null}
                    {qrCodeLink && (
                        <p>
                        <a href={qrCodeLink} target="_blank" rel="noopener noreferrer">
                            Clique aqui para pagar com Pix
                        </a>
                        </p>
                    )}
                    {status && <p style={{marginTop:'2rem'}}>Status: {status === 'pending' ? 'Pendente' : 'Concluído'}</p>}
                </div>
            )}
            {cart.length > 0 && (
                <div className="total-container">
                    <div className="totalByGroup"><b>Total</b>: R$ {Number(total).toFixed(2)}</div>
                    <hr style={{background:'lightgray', margin:'3px', width:'15%'}} />
                    <div style={{display:'flex', gap:'1rem'}}>
                        <button onClick={() =>{
                            setMethod('pix') 
                            handlePix()
                        }} >Pix</button>

                        <button onClick={handlePaymentCard} >Cartão</button>
                    </div>
                    <button 
                        className="requestOrder-btn"
                        style={{background: cart.length > 0 && user ? 'red' : 'gray'}}
                        disabled={cart.length > 0  ? false : true}
                        onClick={endRequests}>
                        Notificar via Whatsapp
                    </button>                                                     
                </div>
            )}
        </Container>
        </>
    )
}

export default Cart