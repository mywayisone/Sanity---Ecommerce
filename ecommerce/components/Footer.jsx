import React from "react";
import Link from "next/link";
import {
  AiFillInstagram,
  AiFillYoutube,
  AiFillYahoo,
  AiOutlineTwitter,
} from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer-container">
      <p>2022 EssenceTop All rights reserved</p>

      <p className="icons">
        <Link href="https://twitter.com/mywayisone">
          <a target="_blank">
            <AiOutlineTwitter />
          </a>
        </Link>
        <AiFillInstagram />
        <AiFillYahoo />
        <AiFillYoutube />
      </p>
    </div>
  );
};

export default Footer;
