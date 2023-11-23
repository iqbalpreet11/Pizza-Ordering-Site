import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utlis/helpers";

function CartOverview() {
         
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice= useSelector(getTotalCartPrice)
           
   if(!totalCartQuantity) return null;
 
  return (
    <div className="flex items-center justify-between bg-stone-800 p-4 text-stone-200 uppercase sm:px-6 text-sm md:text-base">
      <p className="space-x-4 font-semibold text-stone-300">
        <span>{totalCartQuantity} pizza's</span>
        <span> {formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to='/cart'>Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
