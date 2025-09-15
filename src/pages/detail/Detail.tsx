import { 
    /* ChangeEvent, */ 
    ChangeEvent, 
    FC, 
    useContext, 
    useEffect, 
    useState,
    useRef 
} from "react"
import { useNavigate } from "react-router-dom"
import Context, { GlobalStateContext } from "../../global/Context"
import Header from "../../components/Header"
import { IoPersonOutline, IoCartOutline } from "react-icons/io5"
import { Products, Restaurant } from "../../types/types"
import { Container } from './styled'
import axios from "axios"
import { BASE_URL } from "../../constants/url"
//import { useLoadScript, Libraries } from "@react-google-maps/api"
import { productsImages } from '../../constants/index'






/* type Places = google.maps.places.PlaceResult
const libraries:Libraries = ['places'] */

type GroupedProducts = {
  category: string
  items: Products[]
}



const Detail:FC = ()=>{
    const navigate = useNavigate()
    const productsRef = useRef<HTMLDivElement | null>(null)
    const { getAllOrders } = useContext(Context) as GlobalStateContext
    const token = localStorage.getItem('token')
    const [restaurant, setRestaurant] = useState<Restaurant>({
        id:'',
        name:'',
        category:'',
        address:'',
        phone:'',
        description:'',
        cnpj:'',
        logourl:''
    })
    const [products, setProducts] = useState<Products[]>([])
    const [openCategory, setOpenCategory] = useState<string | null>(null)
    const [searchWord, setSearchWord] = useState<string>('')
    /* const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [selectedProduct, setSelectedProduct] = useState<Products>({
        category:'',
        description:'',
        id:'',
        name:'',
        photoUrl:'',
        price:0
    }) */

        /* LOCALIZAÇÃO COM GOOGLE MAPS */
    /*const [places, setPlaces] = useState<Places[]>([])
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY as string,
        libraries
    })

    useEffect(()=>{
        if(!isLoaded || !restaurant?.name) return

        let isCancelled = false

        navigator.geolocation.getCurrentPosition(position=>{
            if(isCancelled) return
            const { latitude, longitude } = position.coords
            const service = new window.google.maps.places.PlacesService(
                document.createElement('div')
            )

            const request = {
                location: new window.google.maps.LatLng(latitude, longitude),
                radius: 5000,
                keyword: restaurant.name
            }

            service.nearbySearch(request, (results, status)=>{
                if(isCancelled) return
                if(status === window.google.maps.places.PlacesServiceStatus.OK && results){
                    const filteredResults = results.filter(place =>(
                        place.name?.toLocaleLowerCase().includes(restaurant.name.toLocaleLowerCase())
                    ))
                    setPlaces(filteredResults)
                }else{
                    console.error(`Falha no PlaceServices: ${status}`)
                }
            })
        },
        (error) =>{
            console.error('Erro ao obter localização', error)
        }
    )
    return () =>{
        isCancelled = true
    }
    }, [isLoaded, restaurant?.name]) */


    useEffect(()=>{
        getRestaurant()
    }, [])


    useEffect(()=>{
        if(openCategory && productsRef.current){
            productsRef.current.scrollIntoView({ behavior:'smooth' })
        }
    }, [openCategory])
    
    
    
    const groupedByCategory = (products:Products[]):GroupedProducts[]=>{
        const grouped = products.reduce((acc, product)=>{
            if(!acc[product.category]){
                acc[product.category] = { category: product.category, items: []}
            }
            acc[product.category].items.push(product)
            return acc
        }, {} as Record<string, GroupedProducts>)

        return Object.values(grouped)
    }


    const getProducts = ()=>{
        axios.get(`${BASE_URL}/restaurant_products`)
            .then(res =>{
                setProducts(res.data)
            })
            .catch(e => console.error(e.response.data))
    }


    const getRestaurant = ()=>{
        axios.get(`${BASE_URL}/restaurant`)
            .then(res =>{
                setRestaurant(res.data)
                getProducts()
            })
            .catch(e => console.error(e.response.data))
    }  


    /* const handleFinalRequest = (product:Products)=>{
        const now = new Date().toISOString()
        const headers = {
            headers: { Authorization: localStorage.getItem('token')}
        }
        const body = {
            product: product.name, 
            price: product.price,
            photoUrl: product.photoUrl,
            quantity: 1,
            total: product.price,  
            momentString: now,
            description: product.description
        }
        
        axios.post(`${BASE_URL}/order`, body, headers).then(res=>{
            getAllOrders()
            const decide = confirm(res.data)
            if(decide){
                navigate('/meu-delivery/cart')
            }
        }).catch(e=>{
            const message = e.response?.data || 'Erro ao enviar pedido. Tente novamente.'
            const decide = confirm(message)
            if(decide){
                navigate('/meu-delivery/cart')
            }
        })
    } */    

    const request = (product: Products)=>{
        if(!token){
            const decide = window.confirm('Necessário efetuar login para fazer pedidos')
            if(decide){
                navigate('/meu-delivery/login')
            }
            return
        }
        
        const now = new Date().toISOString()
        const headers = {
            headers: { Authorization: localStorage.getItem('token')}
        }
        const body = {
            product: product.name, 
            price: product.price,
            photoUrl: product.photoUrl,
            quantity: 1,
            total: product.price,  
            momentString: now,
            description: product.description
        }
        
        axios.post(`${BASE_URL}/order`, body, headers).then(res=>{
            getAllOrders()
            const decide = confirm(res.data)
            if(decide){
                navigate('/meu-delivery/cart')
            }
        }).catch(e=>{
            const message = e.response?.data || 'Erro ao enviar pedido. Tente novamente.'
            const decide = confirm(message)
            if(decide){
                navigate('/meu-delivery/cart')
            }
        })
    }


    const groupedProducts = groupedByCategory(products)

    const handleInputSearch = (e:ChangeEvent<HTMLInputElement>)=>{
        if(openCategory === null){
            alert('Selectione o tipo de produto que quer procurar')
        }
        setSearchWord(e.target.value)
    }

    

    
    return(
        <>
        <Header
            leftIcon={ 
                token ? (
                    <IoCartOutline className="header-icon" onClick={()=>{
                        navigate('/meu-delivery/cart')
                    }}/>
                ) : <div/>
            }
            
            rightIcon={
                token ? (
                    <IoPersonOutline className="header-icon" onClick={()=>{
                        navigate('/meu-delivery/profile')
                    }}/>
                ) : <div/>
            }/>
        <Container>
            <div className="card">
                <div className="rest-name">{restaurant.name}</div>
                <img 
                    src={`/meu-delivery/imgs/restaurants/${restaurant.logourl}`}
                    alt="Imagem do restaurante"
                    className="image"/>               
                <div className="desc">
                    <p>
                        {restaurant.description}
                    </p>
                        {/* LOCALIZAÇÃO COM GOOGLE MAPS */}
                    {/* <h3 style={{textAlign:'center', marginTop:'20px', marginBottom:'10px'}}>
                        {restaurant.name} perto de você
                    </h3>
                    <div>
                        {places.length > 0 ? (
                            places.map(place=>(
                                <div key={place.place_id} style={{marginBottom:'10px'}}>
                                    {place.name}<br/>
                                    {place.vicinity}
                                </div>
                            ))
                        ) : <div>Não há {restaurant.name} em suas proximidades</div> }
                    </div> */}                    
                </div>
                <div className="products" title="Clique em uma das categorias abaixo">Menu Principal</div>
                {/* Barra fixa de categorias */}
                <div className="categories-bar" title="Clique para ver os produtos">
                    {groupedProducts.map(group => (
                    <h3 
                        key={group.category} 
                        onClick={() => setOpenCategory(group.category)}
                        style={{
                            color: openCategory === group.category ? "red" : "black"}}>
                        {group.category}
                    </h3>
                    ))}
                </div>
                {/* BUSCA POR PRODUTO */}
                <input 
                    style={{margin:10, width:'50%'}}
                    type="text" 
                    onChange={handleInputSearch}
                    placeholder="Buscar produto"/>
                {/* Renderizar somente a categoria aberta */}
                <div className="products-container" ref={productsRef}>
                    {groupedProducts.map(group => (
                        openCategory === group.category && (
                            <div key={group.category}>
                            {group.items.filter(product => (
                               product.name.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase()) 
                            )).map(product => (
                                <div 
                                    className="products-card"
                                    key={product.id}>
                                    <img
                                        className="product-image" 
                                        src={productsImages[product.photoUrl]}
                                        alt="Foto do produto"/>
                                    <div className="product-desc">
                                        <h4>{product.name}</h4><br/>
                                        {product.description}<br/><br/>
                                        <div>R$ {Number(product.price).toFixed(2)}</div>
                                    </div>
                                    <button 
                                        className="request-button"
                                        onClick={() => request(product)}>
                                        Pedir
                                    </button>                                    
                                </div>
                            ))}
                            {group.items.filter(product =>(
                                product.name.toLocaleLowerCase().includes(searchWord.toLowerCase())
                            )).length === 0 && (
                                <p>Nenhum produto encontrado nessa categoria</p>
                            )}
                            </div>
                        )
                    ))}
                </div>
            </div>
            {/* <Modal 
                isVisible={modalVisible} 
                product={selectedProduct}
                request={handleFinalRequest}
                onClose={() => setModalVisible(false)} /> */} 
        </Container>
        </>
    )
}

export default Detail