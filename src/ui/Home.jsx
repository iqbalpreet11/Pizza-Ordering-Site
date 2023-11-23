import { useSelector } from "react-redux";
import CreateUser from "../features/order/CreateUser";
import Button from "./Button";

function Home() {

  const username = useSelector((state) => state.user.username)
  return (
    <div className="my-10 text-center sm:my-16">
      <h1 className="mb-8 text-xl text-yellow-500 font-semibold  ">
        The best pizza.
        <br />
        <span className="text-yellow-500">
        Straight out of the oven, straight to you.
        </span>
      </h1>
      {username === '' ? <CreateUser /> : <Button
      to='/' type='primary'>Continue Ordering,{username}</Button>}
    </div>
  );
}

export default Home;
