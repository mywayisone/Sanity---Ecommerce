import React, { useRef } from "react";
import {
  AiOutlineShopping,
  AiOutlineLeft,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import Link from "next/link";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";

import { useStateContext } from "../context/StateContext";
import { urlFor } from "../lib/client";

import PaystackPop from "paystack/inline-js";

import getStripe from "../lib/getStripe";

const Cart = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext();

  const payWithPaystack = () => {
    let handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // Replace with your public key
      email: "kay_1oneway@yahoo.com",
      amount: totalPrice * 100,
      ref: new Date().getTime(), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      currency: "USD",
      onClose: function () {
        alert("Window closed.");
      },
      callback: function (response) {
        let message = "Payment complete! Reference: " + response.reference;
        alert(message);
      },
    });
  };

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        content_Type: "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if ((response.statusCode = 500)) return;

    const data = await response.json();

    toast.loading("Redirecting...");

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Cart is empty</h3>
            <Link href="/">
              <button
                type="button"
                className="btn"
                onClick={() => setShowCart(false)}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                  alt=""
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span
                          className="num"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                        >
                          {item.quantity}
                        </span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      className="remove-item"
                      type="button"
                      onClick={() => onRemove(item._id)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {cartItems.length >= 1 && (
            <div className="cart-bottom">
              <div className="total">
                <h3>Subtotal:</h3>
                <h3>${totalPrice}</h3>
              </div>
              <div className="btn-container">
                <div className="payment-buttons">
                  <button
                    type="button"
                    className="btn"
                    onClick={handleCheckout}
                  >
                    Pay With Stripe
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={payWithPaystack}
                  >
                    Pay With Paystack
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

<script src="https://js.paystack.co/v1/inline.js"></script>;
