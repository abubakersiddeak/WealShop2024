"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react"; // Import useRef and useEffect
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import Link from "next/link";

export default function Navbar() {
  const { cartItems } = useCart();
  const router = useRouter();

  // State for mobile menu dropdowns (collapsed/expanded categories)
  const [openMobileSections, setOpenMobileSections] = useState({
    man: false,
    kids: false,
    accessories: false,
    offer: false,
  });

  // State for mobile drawer open/close
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(""); // Renamed for clarity

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Ref for the mobile drawer checkbox
  const drawerCheckboxRef = useRef(null);

  // Close mobile drawer when route changes (e.g., after search)
  useEffect(() => {
    const handleRouteChange = () => {
      if (drawerCheckboxRef.current) {
        drawerCheckboxRef.current.checked = false;
        setIsDrawerOpen(false);
      }
    };
    router.events?.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/searchproduct/${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMobileSection = (section) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper for consistent dropdown structure
  const DropdownMenu = ({ label, items }) => (
    <div className="dropdown dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className="btn p-0 m-0 bg-white border-0 shadow-none hover:bg-transparent focus:outline-none" // Added hover/focus styles
      >
        {label}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-white rounded-box z-50 w-52 p-3 shadow-md border border-gray-100" // Added shadow-md and border
      >
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.href || "#"}>
              {" "}
              {/* Use Link component */}
              <p className={item.isOffer ? "text-red-500" : ""}>{item.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white text-black border-b border-gray-200 shadow-sm">
      {/* Sticky nav, subtle shadow */}
      <div className="container mx-auto h-[80px] flex justify-between items-center px-4 md:px-6 lg:px-8">
        {/* Responsive padding */}

        {/* Left Section - Desktop Nav */}
        {/* For LG and up, this section will flex-grow to push the center logo */}
        <div className="hidden md:flex lg:flex flex-grow gap-4 lg:gap-8 font-semibold text-lg justify-start">
          {/* Increased font size */}
          <DropdownMenu
            label="Man"
            items={[
              {
                text: "Half Sleeve Jersey",
                href: "/daynamicShowproduct/Men-Half-Sleeve-Jersey",
              },
              {
                text: "Full Sleeve Jersey",
                href: "/daynamicShowproduct/Men-Full-Sleeve-Jersey",
              },
              { text: "Shorts", href: "/daynamicShowproduct/Men-Shorts" },
              { text: "Trouser", href: "/daynamicShowproduct/Men-Trouser" },
              { text: "Others", href: "/daynamicShowproduct/Men-Others" },
            ]}
          />
          <DropdownMenu
            label="Kids"
            items={[
              {
                text: "Half Sleeve Jersey",
                href: "/daynamicShowproduct/Kids-Half-Sleeve-Jersey",
              },
              {
                text: "Full Sleeve Jersey",
                href: "/daynamicShowproduct/Kids-Full-Sleeve-Jersey",
              },
              { text: "Shorts", href: "/daynamicShowproduct/Kids-Shorts" },
              { text: "Trouser", href: "/daynamicShowproduct/Kids-Trouser" },
              { text: "Others", href: "/daynamicShowproduct/Kids-Others" },
            ]}
          />
          <DropdownMenu
            label="Accessories"
            items={[
              {
                text: "Cricket",
                href: "/daynamicShowproduct/Accessories-Cricket",
              },
              {
                text: "Football",
                href: "/daynamicShowproduct/Accessories-Football",
              },
              {
                text: "Badminton",
                href: "/daynamicShowproduct/Accessories-Badminton",
              },
              {
                text: "Volleyball",
                href: "/daynamicShowproduct/Accessories-Volleyball",
              },
              {
                text: "Others",
                href: "/daynamicShowproduct/Accessories-Others",
              },
            ]}
          />
          <DropdownMenu
            label="Offer"
            items={[
              { text: "No Offer Available Now", href: "#", isOffer: true },
            ]}
          />
        </div>

        {/* Center Section - Logo */}
        {/* This section will remain its defined size and be pushed to center by flex-grow siblings */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={"/"}
            className="relative h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 flex-shrink-0"
          >
            {/* Adjusted size and added flex-shrink */}
            <Image
              src="/weal.jpg"
              alt="WealShop Logo"
              fill
              sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px" // Improved image optimization
              style={{ objectFit: "contain" }}
              priority // Prioritize loading for LCP
            />
          </Link>
          <p className="text-3xl lg:text-5xl font-extrabold text-gray-800">
            WEAL
          </p>
          {/* Refined text color */}
        </div>

        {/* Right Section - Desktop Icons & Search */}
        {/* For LG and up, this section will flex-grow to push the center logo and align its content to the end */}
        <div className="hidden md:flex lg:flex flex-grow items-center gap-4 lg:gap-6 justify-end">
          {/* Search bar */}
          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            {/* Professional search bar styling */}
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 h-10 w-36 lg:w-48 xl:w-64 text-gray-700 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress} // Handle Enter key
              aria-label="Search products"
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Perform search"
            >
              <Image
                src={"/search-svgrepo-com.svg"}
                alt="Search icon"
                height={20}
                width={20}
              />
            </button>
          </div>

          {/* Account */}
          <DropdownMenu
            label={
              <Image
                src={"/person-svgrepo-com.svg"}
                alt="Account icon"
                height={28}
                width={28}
              />
            }
            items={[
              {
                text: "Login",
                href: "/login",
                icon: "/login-2-svgrepo-com.svg",
              },
              {
                text: "Register",
                href: "/createUser",
                icon: "/register-svgrepo-com.svg",
              },
            ]}
          />

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label={`View shopping cart with ${totalItems} items`}
          >
            <Image
              src="/cart-shopping-svgrepo-com.svg"
              alt="Cart icon"
              height={24}
              width={24}
            />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {/* Adjusted size and position */}
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Navigation (visible on mobile, hidden on desktop) */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Cart Icon */}
          <Link
            href="/cart"
            className="relative"
            aria-label={`View shopping cart with ${totalItems} items`}
          >
            <Image
              src="/cart-shopping-svgrepo-com.svg"
              alt="Cart icon"
              height={48}
              width={48}
            />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Drawer (Hamburger Menu) */}
          <div className="drawer drawer-end mr-[-10px]">
            {/* Moved drawer-end here */}
            <input
              id="my-drawer"
              type="checkbox"
              className="drawer-toggle"
              ref={drawerCheckboxRef} // Assign ref
              checked={isDrawerOpen} // Control state
              onChange={() => setIsDrawerOpen(!isDrawerOpen)} // Handle changes
            />
            <div className="drawer-content ">
              <label htmlFor="my-drawer" className="btn btn-ghost p-0 m-0">
                {/* Ghost button for hamburger */}
                <Image
                  src={"/menu-symbol-of-three-parallel-lines-svgrepo-com.svg"}
                  alt="Menu icon"
                  height={24}
                  width={24}
                />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <div className="menu bg-base-200 text-base-content min-h-full w-64 sm:w-80 p-4 pt-8">
                {/* Increased width for mobile sidebar */}
                {/* Mobile Search Bar */}
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden mb-6">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="flex-1 px-4 py-2 text-gray-700 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    aria-label="Search products"
                  />
                  <button
                    onClick={handleSearch}
                    className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Perform search"
                  >
                    <Image
                      src={"/search-svgrepo-com.svg"}
                      alt="Search icon"
                      height={20}
                      width={20}
                    />
                  </button>
                </div>
                {/* Mobile Category Navigation */}
                <ul className="space-y-4 text-xl font-semibold">
                  {/* Added spacing */}
                  <li>
                    <div
                      className="flex justify-between items-center cursor-pointer py-2"
                      onClick={() => toggleMobileSection("man")}
                    >
                      <span>Man</span>
                      <span>{openMobileSections.man ? "-" : "+"}</span>
                    </div>
                    {openMobileSections.man && (
                      <ul className="ml-4 space-y-2 text-base font-normal text-gray-700">
                        <li>
                          <Link href="/daynamicShowproduct/Men-Full-Sleeve-Jersey">
                            Full Sleeve Jersey
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Men-Half-Sleeve-Jersey">
                            Half Sleeve Jersey
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Men-Shorts">
                            Shorts
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Men-Trouser">
                            Trouser
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Men-Others">
                            Others
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <div
                      className="flex justify-between items-center cursor-pointer py-2"
                      onClick={() => toggleMobileSection("kids")}
                    >
                      <span>Kids</span>
                      <span>{openMobileSections.kids ? "-" : "+"}</span>
                    </div>
                    {openMobileSections.kids && (
                      <ul className="ml-4 space-y-2 text-base font-normal text-gray-700">
                        <li>
                          <Link href="/daynamicShowproduct/Kids-Full-Sleeve-Jersey">
                            Full Sleeve Jersey
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Kids-Half-Sleeve-Jersey">
                            Half Sleeve Jersey
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Kids-Shorts">
                            Shorts
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Kids-Trouser">
                            Trouser
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Kids-Others">
                            Others
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <div
                      className="flex justify-between items-center cursor-pointer py-2"
                      onClick={() => toggleMobileSection("accessories")}
                    >
                      <span>Accessories</span>
                      <span>{openMobileSections.accessories ? "-" : "+"}</span>
                    </div>
                    {openMobileSections.accessories && (
                      <ul className="ml-4 space-y-2 text-base font-normal text-gray-700">
                        <li>
                          <Link href="/daynamicShowproduct/Accessories-Cricket">
                            Cricket
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Accessories-Football">
                            Football
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Accessories-Badminton">
                            Badminton
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Accessories-Volleyball">
                            Volleyball
                          </Link>
                        </li>
                        <li>
                          <Link href="/daynamicShowproduct/Accessories-Others">
                            Others
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <div
                      className="flex justify-between items-center cursor-pointer py-2"
                      onClick={() => toggleMobileSection("offer")}
                    >
                      <span>Offer</span>
                      <span>{openMobileSections.offer ? "-" : "+"}</span>
                    </div>
                    {openMobileSections.offer && (
                      <ul className="ml-4 space-y-2 text-base font-normal text-gray-700">
                        <li>
                          <Link href="#" className="text-red-500">
                            No Offer Available Now
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
                <hr className="my-6 border-gray-300" /> {/* Separator */}
                {/* Account Links */}
                <div className="mt-5 text-2xl">
                  <h3 className="font-semibold mb-3">My Account</h3>{" "}
                  {/* Added heading for clarity */}
                  <ul className="space-y-2 text-base font-normal">
                    <li>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 py-2"
                      >
                        <Image
                          src={"/login-2-svgrepo-com.svg"}
                          alt="Login"
                          height={16}
                          width={16}
                        />
                        <span>Login</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/createUser"
                        className="flex items-center gap-2 py-2"
                      >
                        <Image
                          src={"/register-svgrepo-com.svg"}
                          alt="Register"
                          height={16}
                          width={16}
                        />
                        <span>Register</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
