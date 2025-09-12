import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { handleKeyPress } from "../../utils/inputsAndKeys"
import formatPhoneNumber from "../../utils/formatPhoneNumber"
import { BASE_URL } from "../../constants/url"
import { Container } from "./styled"



interface FormData{
    username:string
    email:string
    phone:string
}



const EditProfile:FC = ()=>{
    const navigate = useNavigate()
    const [form, setForm] = useState<FormData>({
        username:'',
        email:'',
        phone: ''
    })


    useEffect(()=>{
        const token = localStorage.getItem('token')

        if(!token){
            navigate('/meu-delivery')
        }
    }, [])


    const onChange = (e:ChangeEvent<HTMLInputElement>):void=>{
        const { name, value } = e.target
        const updatedValue = name === 'phone' ? value.replace(/\D/g, '') : value

        setForm({ ...form, [name]: updatedValue })
    }

    const updateUser = (e:FormEvent<HTMLFormElement>):void=>{
        e.preventDefault()

        const body = {
            username: form.username,
            email: form.email,
            phone: form.phone.replace(/\D/g, '')
        }
        const headers = {
            headers: { Authorization: localStorage.getItem('token') }
        }
        
        axios.patch(`${BASE_URL}/user`, body, headers).then(()=>{
            navigate('/meu-delivery/profile')
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const clearForm = ()=>{
        setForm({
            username:'',
            email:'',
            phone:''
        })
    }



    return(
        <Container>
            <div className="title">Atualizar Cadastro</div>
                <form onSubmit={updateUser}>
                    <label htmlFor="name" className="sr-only">Nome</label>
                    <input
                        id="name"
                        type="text"
                        className="form-input"
                        name="username"
                        value={form.username}
                        onChange={onChange}
                        placeholder="Nome e sobrenome" 
                        autoComplete="name"
                        aria-label="Nome do usuário"
                        required/>
                    <label htmlFor="tel" className="sr-only">Telefone</label>
                    <input
                        id="tel"
                        type="text"
                        className="form-input"
                        name="phone"
                        onKeyPress={handleKeyPress}
                        maxLength={15}
                        value={formatPhoneNumber(form.phone)}
                        onChange={onChange}
                        placeholder="Número de telefone" 
                        autoComplete="tel"
                        aria-label="Número de telefone"
                        required/>
                    <label htmlFor="email" className="sr-only">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="name@email.com" 
                        autoComplete="email"
                        aria-label="Endereço de email"
                        required/>
                    <div className="btn-container">
                        <div className="submit-btn">
                            <button className="signup-button" type="button" onClick={clearForm}>Limpar</button>
                            <button className="signup-button" type="submit">Atualizar</button>
                        </div>
                        <button 
                            className="signup-button signup-button-exception"
                            type="button"
                            onClick={()=> navigate('/meu-delivery/')}>Voltar para home</button>
                    </div>
                </form>
        </Container>
    )
}


export  default EditProfile