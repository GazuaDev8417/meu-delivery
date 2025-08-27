import { BrowserRouter } from "react-router-dom"
import { GlobalState } from "./global/Context"
import Router from "./routes/Router"
import { createGlobalStyle } from "styled-components"


const GlobalStyle = createGlobalStyle`
    
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html::-webkit-scrollbar{
    width: .7rem;
  }

  html::-webkit-scrollbar-track{
    background: lightgray;
  }

  html::-webkit-scrollbar-thumb{
    background: #b11717;
    border-radius: 5rem;
  }

  body{
    font-family: "Roboto", sans-serif;
  }

  .logo-title{
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 2px;
    color: #a52a2a;
  }

  input{
    border-radius: 5px;
    border: 1px solid gray;
    outline: none;
    font-size: 1rem;
    height: 40px;
    padding-left: 10px;
  }

  button{
      border: none;
      border-radius: 5px;
      background-color: #b11717;
      padding: .75rem;
      color: white;
      font-weight: 500;
      box-shadow: 1px 1px 4px black;
      cursor: pointer;
      transition: .5s;

      &:hover{
        box-shadow: 0 0 6px #a11414;
        background-color: #990f0f;
      }

      &:active{
        transform: scale(.9);
      }

      .footer{
        position: absolute;
      }
  }

  .header-icon{
        font-size: 2rem;
        cursor: pointer;
        transition: .5s;
        &:hover{
            color: #b11717;
        }
        &:active{
            transform: scale(.9);
        }

    }
`


export default function App(){
  return(
    <BrowserRouter>
      <GlobalState>
        <GlobalStyle/>
        <Router/>
      </GlobalState>
    </BrowserRouter>
  )
}