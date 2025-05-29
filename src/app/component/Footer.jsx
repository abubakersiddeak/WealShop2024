import React from "react";
import Link from "next/link"; // Import Next.js Link for internal navigation

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Get current year for copyright

  return (
    <footer className="w-full bg-gray-100 pt-8 mt-12 md:pt-12 relative text-gray-800">
      {/* Social Media Section */}
      <div className="w-full bg-gray-900 py-4 text-white flex justify-center items-center gap-6 md:gap-12 lg:gap-20">
        <a
          href="https://www.facebook.com/wealbd2024"
          target="_blank" // Open in new tab
          rel="noopener noreferrer" // Security best practice
          aria-label="Visit us on Facebook"
          className="hover:scale-110 transition-transform duration-200"
        >
          <img
            src="/facebook-176-svgrepo-com.svg"
            alt="Facebook icon"
            className="h-5 w-5 md:h-8 md:w-8 filter invert"
          />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit us on Instagram"
          className="hover:scale-110 transition-transform duration-200"
        >
          <img
            src="/instagram-svgrepo-com.svg"
            alt="Instagram icon"
            className="h-5 w-5 md:h-8 md:w-8 filter invert"
          />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit us on TikTok"
          className="hover:scale-110 transition-transform duration-200"
        >
          <img
            src="/brand-tiktok-svgrepo-com.svg"
            alt="TikTok icon"
            className="h-5 w-5 md:h-8 md:w-8 filter invert"
          />
        </a>
        <a
          href="https://wa.me/8801403000212" // Example: WhatsApp direct link
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="hover:scale-110 transition-transform duration-200"
        >
          <img
            src="/whatsapp-svgrepo-com.svg"
            alt="WhatsApp icon"
            className="h-5 w-5 md:h-8 md:w-8 filter invert"
          />
        </a>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 px-4 md:px-6 lg:px-8">
        {/* Services Column */}
        <nav className="text-center md:text-left" aria-label="Services links">
          <h3 className="text-xl font-bold mb-4">Services</h3>
          <ul className="space-y-2 text-gray-700 font-medium">
            <li>
              <Link
                href="/collections/men"
                className="hover:text-blue-600 transition-colors"
              >
                Men's Collection
              </Link>
            </li>
            <li>
              <Link
                href="/collections/kids"
                className="hover:text-blue-600 transition-colors"
              >
                Kids Collection
              </Link>
            </li>
            <li>
              <Link
                href="/collections/accessories"
                className="hover:text-blue-600 transition-colors"
              >
                Accessories
              </Link>
            </li>
            <li>
              <Link
                href="/size-guide"
                className="hover:text-blue-600 transition-colors"
              >
                Size Guide
              </Link>
            </li>
          </ul>
        </nav>

        {/* Company Column */}
        <nav className="text-center md:text-left" aria-label="Company links">
          <h3 className="text-xl font-bold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-700 font-medium">
            <li>
              <Link
                href="/about"
                className="hover:text-blue-600 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-blue-600 transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-blue-600 transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        {/* Help Column */}
        <nav className="text-center md:text-left" aria-label="Help links">
          <h3 className="text-xl font-bold mb-4">Help</h3>
          <ul className="space-y-2 text-gray-700 font-medium">
            <li>
              <Link
                href="/shipping-exchange"
                className="hover:text-blue-600 transition-colors"
              >
                Shipping & Exchange Policy
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-600 transition-colors"
              >
                Connect Us
              </Link>
            </li>
            <li>
              <Link
                href="/stores"
                className="hover:text-blue-600 transition-colors"
              >
                Store Locator
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact Column */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <address className="not-italic space-y-2 text-gray-700 font-medium">
            <div>
              <span>Mail us: </span>
              <a
                href="mailto:wealbd2024@gmail.com"
                className="text-blue-600 hover:underline"
              >
                wealbd2024@gmail.com
              </a>
            </div>
            <div>
              <span>Phone: </span>
              <a
                href="tel:+8801403000212"
                className="text-blue-600 hover:underline"
              >
                +8801403000212
              </a>
            </div>
            {/* Add physical address if available */}
            {/* <div>
              <span>Address:</span>
              <p>123 Main St, City, Country</p>
            </div> */}
          </address>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="w-full bg-gray-950 py-4 text-center text-gray-400 text-sm">
        <p>&copy; {currentYear} WEAL BD. All rights reserved.</p>
      </div>
    </footer>
  );
}
