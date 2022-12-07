import React, { useState } from "react";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { client, urlFor } from "../../lib/client";
import Product from "../../components/Product";
import { useStateContext } from "../../context/StateContext";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price } = product;
  const { qty, increaseQty, decreaseQty, onAdd } = useStateContext();
  const [index, setIndex] = useState(0);
  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              className="product-detail-image"
              src={urlFor(image && image[index])}
              alt=""
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                src={urlFor(item)}
                onMouseEnter={() => setIndex(i)}
                className={
                  i == index ? "small-image selected-image" : "small-image"
                }
                alt=""
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiOutlineStar />
          </div>
          <p>(20)</p>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className="price">Price: ${price}</p>
          <div className="quantity">
            <h4>Quantity:</h4>
            <p className="quantity-desc">
              <span className="minus" onClick={decreaseQty}>
                <AiOutlineMinus />
              </span>
              <span className="num" onClick="">
                {qty}
              </span>
              <span className="plus" onClick={increaseQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              onClick={() => onAdd(product, qty)}
              className="add-to-cart"
            >
              Add to Cart
            </button>
            <button type="button" onClick="" className="buy-now">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export const getStaticPaths = async (slug) => {
  const query = `*[_type == "product"]{
    slug
  }`;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug == '${slug}'][0]`;
  const product = await client.fetch(query);

  const productsQuery = '*[_type == "product"]';
  const products = await client.fetch(productsQuery);

  return {
    props: { product, products },
  };
};

export default ProductDetails;
