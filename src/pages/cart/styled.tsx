import styled from 'styled-components'


interface ContainerProps{
    $hasqrcode:boolean
}

export const Container = styled.div<ContainerProps>`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 15vh 5rem;
    padding-bottom: ${({ $hasqrcode }) => ($hasqrcode ? '0' : '100px' )};

    h1{
        text-align: center;
        margin: 20px 0 10vh;
    }

    .address-section{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background-color: lightgray;
        padding: 10px;
        line-height: 30px;
        border-radius: 10px;
    }

    .addressAndName{
        margin: 20px 0 10px;
        line-height: 30px;
    }

    .icon{
        font-size: 1.5rem;
        cursor: pointer;
    }

    .rest-name{
        text-align: center;
        font-size: 1.5rem;
        margin: 2vh 0;
    }

    .cart-container{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .card{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border: .5px solid;
        border-radius: 10px;
        padding: 10px;        
        margin: 0 0 10px;
    }

    .btn-container{
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 10px;

        .input-number{
            width: 50px;
        }
    }

    .btn-remove{
        padding: 10px;
        color: #fff;
        font-size: .8rem;
    }
    
    .card img{
        /* width: 150px;
        height: 150px; */
        border-radius: 10px;  
        /* box-shadow: 2px 2px 4px; */
    }

    .totalByGroup{
        font-size: 1.2rem;
    }

    .total-container{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: white;
        padding: 1rem;
        border-top: 1px solid lightgrey;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        align-items: center;
    }

    .requestOrder-btn{
        margin-top: 1rem;
        background: green !important;
        font-size: 1rem;
        font-weight: bold;
        color: #fff;
        height: 40px;
    }

    .product-name{
        color: #dc2b2b;
        margin: 5px 0 10px;
        font-size: 1.5rem;
    }
/* MEDIA QUERY */
    @media(max-width: 820px){
        .product-name{
            font-size: 1rem;
        }

        .product-details{
            font-size: .7rem;
        }
    }

    @media(max-width: 734px){
        h1{
            font-size: 1.5rem;
        }

        .rest-name{
            font-size: 1.2rem;
        }

        /* .card{
            flex-direction: column;
            width: 110%;
        } */

        .btn-container{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 80%;
            margin: 10px;

            input{
                width: 30%;
            }
        }

        /* .card img{
            width: 30vw;      
        } */            
    }

    @media(max-width: 532px){
        .address-section{
            width: 120%;
        }

        .card{
            flex-direction: column;
        }
    }

    @media(max-width: 416px){
        margin: 13vh 5rem;
        padding-bottom: 150px;

        .address-section{
            width: 140%;
            font-size: 13px;
        }

        .card{
            width: 130%;
        }
    }

    @media(max-width: 326px){
        .card{
            width: 150%;
        }
    }
`
