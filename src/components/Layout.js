import React, { useState } from "react";
import '../App.css';
import image from '../asset/image.webp';
import { useNavigate } from "react-router-dom";
import { stripeCheckOut } from "../Stripe/StripeMethod";

export default function Layout() {
  const [quantity, setQuantity] = useState(1);
  const navigator = useNavigate();

  const handelCheckOut = async () => {
    const session = await stripeCheckOut(quantity)
    window.location.replace(session.url)

  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={image} alt="logo" />

        Unlimited photo image

        <button className="btn btn-primary m-2" onClick={() => navigator('/stripeSubscription')}>Subscription </button>
        <button className="btn btn-info " onClick={() => navigator('/stripe')}> Payment</button>

        <div className="mt-3 mb-3">
          <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <button className="btn btn-primary m-2" onClick={handelCheckOut}> CheckOut</button>
        </div>
      </header>


    </div>
  )
}