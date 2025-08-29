import { FC } from "react"

import styled from "styled-components"


const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;

    .iframe-container{
        width: 90%;
        height: 90%;
        background: white;
        position: relative;
    }

    .iframe-style{
        width: 100%;
        height: 100%;
        border: none;
    }

    .btn{
        position: absolute;
        background-color: green;
        top: 1%;
        left: 50%;
        transform: translateX(-50%);
    }
`

type MpModalProps = {
    mpUrl:string
    setModalOpen: (open:boolean) => void
    endRequests: () => void
}


const MpModal_checkout_pro:FC<MpModalProps> = ({ setModalOpen, mpUrl, endRequests })=>{
    /* FUNÇÃO USADA NO CHECKOUT PRO */
    /* const orderPayment = async()=>{
        setLoading(true)
        try{
            const { data } = await axios.post('http://localhost:3003/payment_preferences', {
            items: cart.map(item =>({
                title: item.product,
                quantity: item.quantity,
                unit_price: Number(item.price)
            }))
        })
        setMpUrl(data.init_point)
        setMpModalOpen(true)
        }catch(e){
            console.error(e)
        }
        setLoading(false)
    } */
    /* NÃO É USADA AQUI NO COMPONENTE */
    return(
        <Container onClick={() => setModalOpen(false)}>
            <div
                onClick={e => e.stopPropagation()} 
                className="iframe-container">
                <iframe src={mpUrl} className="iframe-style" />
                <button
                    className="btn"
                    onClick={endRequests}>
                        Notificar pedido pelo whatsapp
                    </button>
            </div>
        </Container>
    )
}


export default MpModal_checkout_pro






