import { ReactNode, RefObject, useEffect, useRef } from 'react'
import styled from 'styled-components'


const Container = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
`

interface HeaderProps{
    leftIcon:ReactNode
    /* center:ReactNode */
    rightIcon:ReactNode
}


const Header = (props:HeaderProps)=>{
    const titleRef = useRef<HTMLDivElement>(null)

    const hideHeaderCenter = (title:HTMLDivElement)=>{
        if(window.scrollY > 0){
            title.style.display = 'none'
        }else{
            title.style.display = 'block'
        }
    }

    useEffect(()=>{
        const scroll = () =>{
            if(titleRef.current) hideHeaderCenter(titleRef.current)
        }
        window.addEventListener('scroll', scroll)
        return () => window.removeEventListener('scroll', scroll)
    })


    return(
        <Container>
            {props.leftIcon}
            <h2 ref={titleRef} className="logo-title">DISK90 DELIVERY</h2>
            {props.rightIcon}
        </Container>
    )
}

export default Header