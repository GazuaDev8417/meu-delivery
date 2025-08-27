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
    password:string
}



const EditProfile:FC = ()=>{
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState<boolean>(false)
    const [form, setForm] = useState<FormData>({
        username:'',
        email:'',
        phone: '',
        password:''
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

    const signup = (e:FormEvent<HTMLFormElement>):void=>{
        e.preventDefault()

        const body = {
            name: form.username,
            email: form.email,
            phone: form.phone.replace(/\D/g, ''),
            password: form.password
        }
        
        axios.post(`${BASE_URL}/signup`, body).then(res=>{
            localStorage.setItem('token',res.data)
            navigate('/meu-delivery/user-address')
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const clearForm = ()=>{
        setForm({
            username:'',
            email:'',
            phone:'',
            password:''
        })
    }



    return(
        <Container>
            <div className="title">Atualizar Cadastro</div>
                <form onSubmit={signup}>
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
                            <button className="signup-button" type="submit">Registrar</button>
                        </div>
                        <button 
                            className="signup-button signup-button-exception"
                            type="button"
                            onClick={()=> navigate('/meu-delivery/profile')}>Voltar para perfil</button>
                    </div>
                </form>
        </Container>
    )
}


export  default EditProfile