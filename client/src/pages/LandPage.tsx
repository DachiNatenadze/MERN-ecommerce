/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from '../components/Header.jsx'
import banner from '../assets/banner.png'
import { FaShoppingCart } from 'react-icons/fa'
import { useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../components/Loader.js'
import { userContext } from '../components/UserContext.js'
import { PiCurrencyDollarSimple } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

const LandPage = () => {
  const { setCartLength, cartLength, allProducts, user } =
    useContext<any>(userContext)
  const navigate = useNavigate()

  const addToCart = async (product: any) => {
    try {
      if (user) {
        if (cartLength > 4) {
          return toast.error(`Can't add more items to the cart`)
        }
        setCartLength((prev: number) => prev + 1)
        await axios.post('user/add-to-cart', {
          productTitle: product.title,
          productImage: product.image,
          productType: product.type,
          productColor: product.color,
          productPrice: product.price,
        })
        toast.success('Successfully added product to the cart')
      } else {
        navigate('/account')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <main className='w-full h-screen overflow-y-scroll py-10 relative bg-gray-100'>
      <div className='w-full px-16 py-4 bg-main flex flex-col'>
        <Header />
        <div className='flex justify-center items-center mt-[5rem] gap-x-[100px] max-xl:flex-col'>
          <div className='flex flex-col items-start justify-center gap-[10px] max-xl:items-center max-xl:text-center'>
            <h1 className='text-white text-[55px] max-md:text-[40px]'>
              Macbook 14 Pro
            </h1>
            <p className='text-gray-300 max-w-[470px] text-[18px] max-sm:text-[16px]'>
              Supercharged by M2 Pro or M2 Max, macbook pro takes its power and
              efficiency further than ever. it delivers exceptional performance
              whether its plugged in or not, and now it has eveno longer battery
              life.
            </p>
            <div className='flex gap-2 py-2 max-md:flex-col'>
              <button className='border bg-transparent rounded-lg px-5 py-[5.5px] text-white text-[18px]'>
                Read more
              </button>
              <button className='border bg-white border-green-900 rounded-lg px-5 py-[5.5px] text-green-900 flex items-center justify-center gap-2 text-[18px]'>
                <FaShoppingCart />
                Add to cart
              </button>
            </div>
          </div>
          <img
            src={banner}
            alt='banner'
            className='w-[600px] object-contain max-lg:w-[100%]'
          />
        </div>
      </div>
      <div className='px-10'>
        <h1 className='mb-5 text-[30px] mt-6'>New Arrivals</h1>
        {allProducts ? (
          <div className='flex flex-wrap gap-[20px] w-full justify-center items-center'>
            {allProducts.slice(0, 10).map((product: any, idx: number) => (
              <div key={idx}>
                <div className='w-[300px] h-[240px] bg-white rounded-xl flex items-center justify-center'>
                  <img
                    src={product.image}
                    alt='product image'
                    className='w-[200px] h-[200px] object-contain'
                  />
                </div>
                <div>
                  <h2 className='capitalize p-[2.5px]'>{product.title}</h2>
                  <div className='flex items-center justify-start gap-2'>
                    <span className='font-bold'>
                      <div className='flex items-center'>
                        <PiCurrencyDollarSimple className='text-[16px]' />
                        {product.price}
                      </div>
                    </span>
                    <button
                      className='border border-green-900 rounded-lg text-green-900 px-4 py-1'
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full flex justify-center items-center p-20'>
            <Loader />
          </div>
        )}
      </div>
    </main>
  )
}

export default LandPage
