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


const MpModal:FC<MpModalProps> = ({ setModalOpen, mpUrl, endRequests })=>{
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


export default MpModal






