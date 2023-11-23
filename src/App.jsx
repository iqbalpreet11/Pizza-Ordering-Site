import React from 'react'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Home from './ui/Home';
import Menu,{loader as menuLoader} from './features/menu/Menu';
import Error from './ui/Error'
import Cart from './features/cart/Cart'
import CreateOrder,{action as createOrderAction} from './features/order/CreateOrder'
import Order,{loader as orderLoader} from './features/order/Order'
import AppLayout from './ui/AppLayout'


//its imperative way of using router unlike declarative that we used in past 
//here we declaring router out of JSX with JS array, data fecthing and loading is possible in router version 6.
const router = createBrowserRouter([
  {
   element:<AppLayout />,
   errorElement: <Error />,
   children:[
    {
      path:'/',
      element:<Home />
    },
    {
      path:'/menu',
      element:<Menu />,
      loader: menuLoader,
      //instead of * , now we use this dynamic error loading
      errorElement : <Error />
    },
    {
      path:'/cart',
      element:<Cart />
    },
    {
      path:'/order/new',
      element:<CreateOrder />,
      action: createOrderAction,
    },
    {
      path:'/order/:orderId',
      element:<Order />,
       loader: orderLoader,
       errorElement: <Error />
    },
    
   ]
  },
 
])

const App = () => {
  return (
   <RouterProvider router={router} />

   
  )
}

export default App