import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);

  let foundProduct;

  const onRemove = (id) => {
    foundProduct = cartItems.find((item) => item._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);
    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );

    console.log(newCartItems);
    console.log(foundProduct);

    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);

    const cartItemsInstance = cartItems;

    if (value === "inc") {
      const newCartItems = cartItemsInstance.filter((item) => {
        if (item._id === id) {
          item.quantity += 1;
          return item;
        }
        return item;
      });

      setCartItems(newCartItems);
      console.log(cartItems);

      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        const newCartItems = cartItemsInstance.filter((item) => {
          if (item._id === id) {
            item.quantity -= 1;
            return item;
          }
          return item;
        });
        setCartItems(newCartItems);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const onAdd = (product, quantity) => {
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    const checkProductsInCart = cartItems.find(
      (item) => item._id === product._id
    );

    if (checkProductsInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) cartProduct.quantity += quantity;
        return cartProduct;
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to cart successfully`);
  };

  const increaseQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decreaseQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 <= 1) {
        return 1;
      }
      return prevQty - 1;
    });
  };

  const getTotalPrice = () => {};
  const getCartItems = () => {};
  const getTotalQuantities = () => {};

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        setShowCart,
        increaseQty,
        decreaseQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
