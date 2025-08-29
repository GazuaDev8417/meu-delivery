import { FC, useState, Dispatch, SetStateAction } from "react"
import axios from "axios"
import { BASE_URL } from "../constants/url"
import { IoIosCloseCircleOutline } from "react-icons/io";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"


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

    .icon{
        position: absolute;
        right: 5%;
        top: 2%;
        z-index: 10;
    }

    .btn{
        position: absolute;
        background-color: green;
        bottom: -3%;
        left: 50%;
        transform: translateX(-50%);
    }
`

type MpModalProps = {
    setModalOpen: (open:boolean) => void
    endRequests: () => void
    setQrCode:Dispatch<SetStateAction<string | null>>
}

initMercadoPago(import.meta.env.VITE_PUBLIC_KEY_TP)

const MpModal:FC<MpModalProps> = ({ setModalOpen, endRequests, setQrCode })=>{
    const [status, setStatus] = useState<string>('')



    const confirm_endRequests = ()=>{
        const decide = window.confirm('Aqui você apensas notifica o seu pedido para o vendedor, para realizar o pagamento é preciso preencher os dados do cartão e confirmar.')
        if(decide){
            endRequests()
        } 
    }


    const handleSubmit = async(formData:any)=>{
        try{
        const res = await axios.post(`${BASE_URL}/pay`, {
            token: formData.token,
            paymentMethodId: formData.paymentMethodId,
            email: formData.cardholderEmail
        })

        setStatus(res.data.status)
        setQrCode(null)
        }catch(e){
        console.error(e)
        setStatus('Erro')
        }
    }



    return(
        <Container onClick={() => setModalOpen(false)}>
            <div onClick={e => e.stopPropagation()} className="iframe-container">
                <IoIosCloseCircleOutline className="icon" size={25} onClick={() => setModalOpen(false)} />
                <CardPayment
                    onSubmit={handleSubmit}
                    initialization={{
                        amount: 100
                    }}/>
                <button className="btn" onClick={confirm_endRequests}>Notificar via Whatsapp</button>
                {status && <p style={{marginTop:'2rem'}}>Status: {status}</p>}
            </div>
        </Container>
    )
}


export default MpModal






