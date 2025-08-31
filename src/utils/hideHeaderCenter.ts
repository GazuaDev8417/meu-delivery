import { RefObject } from "react"




const hideHeaderCenter = (title:RefObject<HTMLDivElement>)=>{

    if(title.current && window.scrollY > 0){
        title.current.style.display = 'none'
    }else if(title.current && window.scrollY < 100){
        title.current.style.display = 'block'
    }
}




export default hideHeaderCenter