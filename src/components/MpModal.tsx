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
    z-index: 1000;

    .iframe-container{
        width: 90%;
        height: 90%;
        background: white;
        position: relative;
        overflow-y: auto;
    }

    .icon{
        position: fixed;
        right: 6%;
        top: 6%;
        z-index: 10;
        color: red;
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
    setQrCode:Dispatch<SetStateAction<string | null>>
}

initMercadoPago(import.meta.env.VITE_PUBLIC_KEY_TP)

const MpModal:FC<MpModalProps> = ({ setModalOpen, setQrCode })=>{
    const [status, setStatus] = useState<string>('')
    


    const handleSubmit = async(formData:any)=>{
        try{
        const res = await axios.post(`${BASE_URL}/pay`, {
            token: formData.token,
            paymentMethodId: formData.paymentMethodId,
            email: formData.cardholderEmail
        })

        setStatus(res.data.status)
        setQrCode(null)

        const orderId = res.data.orderId;

        // inicia polling
        const interval = setInterval(async () => {
            const statusRes = await axios.get(`${BASE_URL}/payments/status/${orderId}`);
            if (statusRes.data.status !== status) {
                setStatus(statusRes.data.status);

                if (statusRes.data.status === 'approved') {
                    clearInterval(interval);
                    alert('Pagamento com cartão aprovado! 🎉');
                }
            }
        }, 5000)
        }catch(e){
        console.error(e)
        setStatus('Erro')
        }        
    }



    return(
        <Container onClick={() => setModalOpen(false)}>
            <div onClick={e => e.stopPropagation()} className="iframe-container">
                {window.innerWidth < 768 && <IoIosCloseCircleOutline className="icon" size={25} onClick={() => setModalOpen(false)} />}
                <CardPayment
                    onSubmit={handleSubmit}
                    initialization={{
                        amount: 100
                    }}/>
                {status && <p style={{marginTop:'2rem'}}>Status: {status}</p>}
            </div>
        </Container>
    )
}


export default MpModal






