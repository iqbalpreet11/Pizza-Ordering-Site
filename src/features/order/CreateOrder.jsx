import { useState } from "react";
import { Form, redirect, useActionData, useNavigate, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { formatCurrency } from '../../utlis/helpers';
import fetchAddress from '../../features/user/userSlice'
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );



function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const {username, staus: addressStatus,position, address} = useSelector((state)=> state.user.username);

  const isLoadingAddress = address === 'loading'
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const dispatch = useDispatch()

  
  const formErrors = useActionData();
  
  const cart = useSelector(getCart);

  const totalCartPrice = useSelector(getTotalCartPrice);
const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;


  if(!cart.length) return <EmptyCart />

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      

      <Form method="POST" >
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center" >
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" type="text" name="customer"
          defaultValue={username} required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label  className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input  className="input w-full" type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">{formErrors.phone}</p>}
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input className="input w-full" type="text" name="address" disabled={isLoadingAddress} required />
          </div>
          {/* <span className="absolute right-[3px] z-50">
          <Button disabled={isLoadingAddress} type='small'
           onClick={() => dispatch(fetchAddress())}
           defaultValue={address}
           >
        Get position
      </Button>
      </span> */}
        </div>

        <div  className="mb-12 flex items-center gap-5">
          <input
             className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority"  className="font-medium">Want to yo give your order priority?</label>
        </div>

        <div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <Button disabled={isSubmitting } type="primary">
            {isSubmitting
              ? 'Placing order....'
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({request}) {
     const formData = await request.formData();
       const data = Object.fromEntries(formData);
       
       const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority : data.priority === 'true'
       }
   
    

       const errors = {}
       if(!isValidPhone(order.phone))
       errors.phone = "Plz fill correct Number";

        if(Object.keys(errors).length>0) return errors;
        
        //if everything is okay , create new order and redirect
        const newOrder = await createOrder(order);

        //here we r using this redux state in regular function instead of  component , this should not be overdo
        store.dispatch(clearCart());
        return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
