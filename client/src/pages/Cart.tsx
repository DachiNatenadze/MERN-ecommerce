/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { userContext } from '../components/UserContext'
import { useContext, useState } from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { RiDeleteBin6Line } from 'react-icons/ri'
import visa from '../assets/visa.png'
import amex from '../assets/amex.png'
import mastercard from '../assets/mastercard.png'
import paypal from '../assets/paypal.png'
import { PiCurrencyDollarSimple } from 'react-icons/pi'
import Loader from '../components/Loader'
import axios from 'axios'
import toast from 'react-hot-toast'

const Cart = () => {
  const { user } = useContext<any>(userContext)
  const [activeCard, setActiveCard] = useState<number>(0)

  const cardsData = [
    { src: visa },
    { src: amex },
    { src: mastercard },
    { src: paypal },
  ]

  const decrementFromCart = async (product: any) => {
    try {
      if (product.productCount === 1) {
        user.cartContext = user.cartContext.filter((item: any) => {
          return product._id !== item._id
        })
        await axios.put('/user/remove-from-cart', {
          product: product,
        })
        toast.success('Product has been removed from the cart')
        return
      }
      product.productCount -= 1
      const response = await axios.put('user/decrement-product-count', {
        productId: product._id,
      })
      const data = await response.data
      toast.success(data.message)
    } catch (error) {
      toast.error('something went wrong')
    }
  }

  return (
    <main className='w-full overflow-scroll h-screen flex flex-col justify-center items-center px-10 py-10 bg-slate-500'>
      {user?.cartContext ? (
        <div className='cart w-full h-[calc(100vh-5rem)] rounded-[35px] bg-gray-100 px-10 overflow-y-scroll py-5 flex justify-between gap-[70px] max-xl:flex-col'>
          <div className='flex flex-col gap-10 w-[70%] max-xl:w-full'>
            <div>
              <Link
                to='/'
                className='flex items-center gap-2 py-7 text-gray-600 text-[18px] max-w-[205px]'
              >
                <MdKeyboardArrowLeft />
                Continue Shopping
              </Link>
              <h1 className='text-3xl max-md:text-2xl font-[500] w-full py-3 border-b border-gray-500'>
                Shopping Cart
              </h1>
            </div>

            {user?.cartContext.map((product: any, idx: number) => {
              return (
                <div
                  key={idx}
                  className='bg-white rounded-2xl px-4 py-2 shadow-sm drop-shadow-2xl flex items-center justify-between max-md:flex-col'
                >
                  <div className='flex items-center gap-4 max-md:w-[95%]'>
                    <img
                      src={product.productImage}
                      alt='product image'
                      className='w-[100px] h-[100px] object-contain'
                    />
                    <div className='flex flex-col justify-center gap-1'>
                      <h2 className='text-[20px] max-md:text-[17px]'>
                        {product.productTitle}
                      </h2>
                      <div>
                        <div className='flex items-center gap-1'>
                          <span className='text-gray-500 max-sm:text-[14px]'>
                            color
                          </span>
                          <div
                            className='w-5 h-5 rounded-full border max-sm:h-4 max-sm:w-4'
                            style={{
                              background: product.productColor,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center w-[38%] px-2 justify-between max-md:w-[90%]'>
                    <div className='flex items-center gap-2'>
                      <span className='cursor-pointer text-[22px]'>+</span>
                      <div className='border w-[20px] h-[20px] flex justify-center items-center rounded-lg'>
                        <span className='text-[12px]'>
                          {product.productCount}
                        </span>
                      </div>
                      <span
                        className='cursor-pointer text-[25px]'
                        onClick={() => decrementFromCart(product)}
                      >
                        -
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='font-[600] text-[20px] text-gray-700 max-sm:text-[17px] flex items-center'>
                        <PiCurrencyDollarSimple />
                        {(product.productPrice * product.productCount).toFixed(
                          2
                        )}
                      </span>
                      <RiDeleteBin6Line className='text-[22px] text-gray-600 hover:text-red-600 transition-all max-md:text-[18px] duration-500 cursor-pointer' />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className='bg-slate-500 p-10 rounded-3xl'>
            <h2 className='text-white text-2xl font-[500] mb-5 max-sm:text-xl flex items-center gap-3'>
              Card Details
              <span className='text-[13px] text-red-100 bg-red-500 px-3 rounded-xl'>
                demo
              </span>
            </h2>
            {/* TODO: card selection */}
            <div className='grid grid-cols-4 place-items-center mb-10 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1'>
              {cardsData.map((card, idx) => {
                return (
                  <img
                    onClick={() => setActiveCard(idx)}
                    key={idx}
                    src={card.src}
                    className={`w-[150px] h-[70px] object-contain border-2 border-white rounded-lg px-10 cursor-pointer transition-all duration-500 hover:border-gray-700  ${
                      idx === activeCard && '!border-gray-700'
                    }`}
                  />
                )
              })}
            </div>
            <form className='flex flex-col justify-center gap-[15px] border-b py-5'>
              <div className='flex flex-col items-start justify-center gap-2'>
                <h3 className='text-gray-300 text-[14px] max-sm:text-[12px]'>
                  CARDHOLDER NAME
                </h3>
                <input
                  className='bg-slate-400 text-gray-100 w-full py-1 px-5 rounded-sm outline-none placeholder:text-gray-200'
                  required
                  placeholder='John Doe'
                />
              </div>
              <div className='flex flex-col items-start justify-center gap-2'>
                <h3 className='text-gray-300 text-[14px] max-sm:text-[12px]'>
                  CARD NUMBER
                </h3>
                <input className='bg-slate-400 text-gray-100 w-full py-1 px-5 rounded-sm outline-none' />
              </div>
              <div className='flex items-center justify-center gap-5'>
                <div className='flex flex-col w-full gap-2'>
                  <h3 className='text-gray-300 text-[14px] max-sm:text-[12px]'>
                    EXPIRATION DATE
                  </h3>
                  <input
                    type='text'
                    className='bg-slate-400 text-gray-100 w-full py-1 px-5 rounded-sm outline-none'
                  />
                </div>
                <div className='flex flex-col gap-2 w-full'>
                  <h3 className='text-gray-300 text-[14px] max-sm:text-[12px]'>
                    CVV
                  </h3>
                  <input
                    type='text'
                    className='bg-slate-400 text-gray-100 w-full py-1 px-5 rounded-sm outline-none'
                  />
                </div>
              </div>
            </form>
            <div className='py-5 flex flex-col gap-4'>
              <div className='w-full flex items-center justify-between'>
                <h3 className='text-[18px] text-gray-100'>Subtotal</h3>
                <span className='flex items-center text-[17px] text-gray-100'>
                  <PiCurrencyDollarSimple />
                  {user?.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className='w-full flex items-center justify-between'>
                <h3 className='text-[18px] text-gray-100'>Shipping</h3>
                <span className='flex items-center text-[17px] text-gray-100'>
                  <PiCurrencyDollarSimple />
                  {(20).toFixed(2)}
                </span>
              </div>
              <div className='w-full flex items-center justify-between'>
                <h3 className='text-[18px] text-gray-100'>Total(tax.incl.)</h3>
                <span className='flex items-center text-[17px] text-gray-100'>
                  <PiCurrencyDollarSimple />
                  {(user?.totalPrice + 90).toFixed(2)}
                </span>
              </div>
              <button className='text-gray-700 bg-gray-200 px-10 py-1 rounded-full max-w-[200px] m-auto mt-2 hover:bg-gray-300 transition-all duration-300'>
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </main>
  )
}

export default Cart
