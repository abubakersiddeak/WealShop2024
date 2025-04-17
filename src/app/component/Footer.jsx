import React from "react";

export default function Footer() {
  return (
    <footer className="w-full h-[50vh] mt-4 relative">
      <div className="w-full h-[10vh] bg-gray-900 text-white flex justify-center items-center gap-12 md:gap-24 lg:gap-40">
        <a href="#">
          <img
            src="/facebook-176-svgrepo-com.svg"
            alt="facebook"
            className="h-4 w-4 md:h-7 md:w-7 filter invert"
          />
        </a>
        <a href="#">
          <img
            src="/instagram-svgrepo-com.svg"
            alt="instagram"
            className="h-4 w-4 md:h-7 md:w-7 filter invert"
          />
        </a>
        <a href="#">
          <img
            src="/brand-tiktok-svgrepo-com.svg"
            alt="tiktok"
            className="h-4 w-4 md:h-7 md:w-7 filter invert"
          />
        </a>
        <a href="#">
          <img
            src="/whatsapp-svgrepo-com.svg"
            alt="whatsapp"
            className="h-4 w-4 md:h-7 md:w-7 filter invert"
          />
        </a>
      </div>
      <div className="w-full mt-10 md:mt-5 md:h-[60%] flex flex-col  md:flex-row justify-between px-5 md:px-10 items-center gap-3 p-7 border-b-2 md:border-0">
        <div className="border-gray-400  md:border-l-2 h-full md:w-[20%] px-3  ">
          <h1 className="text-2xl font-bold text-center md:text-start">
            Services
          </h1>
          <div className="mt-4 text-gray-600 font-medium justify-center items-center md:justify-start md:items-start flex flex-col gap-2">
            <a href="#"> Men's Collection</a>
            <a href="#"> Kids Collection</a>
            <a href="#"> Accessories </a>
            <a href="#"> Size Guide </a>
          </div>
        </div>
        <div className="border-gray-400  md:border-l-2 h-full md:w-[20%] px-3  ">
          <h1 className="text-2xl font-bold text-center md:text-start">
            Company
          </h1>
          <div className="mt-4 text-gray-600 font-medium justify-center items-center md:justify-start md:items-start flex flex-col gap-2">
            <a href="#"> About Us</a>
            <a href="#"> Terms & Conditions</a>
            <a href="#"> Privacy Policy </a>
            <a href="#"> FAQ </a>
          </div>
        </div>
        <div className="border-gray-400  md:border-l-2 h-full md:w-[20%] px-3  ">
          <h1 className="text-2xl font-bold text-center md:text-start">Help</h1>
          <div className="mt-4 text-gray-600 font-medium justify-center items-center md:justify-start md:items-start flex flex-col gap-2">
            <a href="#"> SHIPPING & EXCHANGE POLICY</a>
            <a href="#"> Connect Us</a>
            <a href="#"> Store </a>
          </div>
        </div>
        <div className="border-gray-400  md:border-l-2 h-full md:w-[20%] px-3  ">
          <h1 className="text-2xl font-bold text-center md:text-start">
            Contact
          </h1>
          <div className="mt-4 text-gray-600 font-medium justify-center items-center md:justify-start md:items-start flex flex-col gap-2">
            <a href="#">
              <span>Mail us:</span>
              <span className="text-sky-600"> wealbd2024@gmail.com</span>
            </a>
            <a href="#">
              {" "}
              <span>Phone:</span>
              <span className="text-blue-700"> 01403000212</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
