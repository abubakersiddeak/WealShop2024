"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const [openSections, setOpenSections] = useState({
    man: false,
    kids: false,
    accessories: false,
    offer: false,
  });
  const [query, setQuery] = useState("");

  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      router.push(`/searchproduct/${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Search error:", error);
    }
  };
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <nav className="h-[80px] bg-white text-black border-b border-black flex justify-between items-center md:px-9 ">
      <div className="md:flex gap-2 md:gap-8  w-[40%] font-extrabold hidden">
        <button className="cursor-pointer">
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn p-0 m-0 bg-white border-0 shadow-none"
            >
              Man
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-50 w-52 p-3 shadow-sm mr-5"
            >
              <li>
                <a href="/daynamicShowproduct/Men-Half-Sleeve-Jersey">
                  <p>Half Sleeve Jersey</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/Men-Full-Sleeve-Jersey">
                  <p>Full Sleeve Jersey</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/Men-Shorts">
                  <p>Shorts</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/Men-Trouser">
                  <p>Trouser</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/Men-Others">
                  <p>Others</p>
                </a>
              </li>
            </ul>
          </div>
        </button>
        <button className="cursor-pointer">
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn p-0 m-0 bg-white border-0 shadow-none"
            >
              Kids
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-50 w-52 p-3 shadow-sm mr-5"
            >
              <li>
                <a href="/daynamicShowproduct/">
                  <p>Half Sleeve Jersey</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/">
                  <p>Full Sleeve Jersey</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/">
                  <p>Shorts</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/">
                  <p>Trouser</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/">
                  <p>Others</p>
                </a>
              </li>
            </ul>
          </div>
        </button>
        <button className="cursor-pointer">
          <div className="dropdown dropdown-hover ">
            <div
              role="button"
              className="btn  p-0 m-0 bg-white border-0 shadow-none"
            >
              {" "}
              Accessories
            </div>
            <ul className="dropdown-content menu bg-white rounded-box z-50 w-52 p-3 shadow-sm mr-5">
              <li>
                <a href="/daynamicShowproduct/Accessories-Cricket">
                  <p>Cricker</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/">
                  <p>Football</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/">
                  <p>Badmintion</p>
                </a>
              </li>
              <li>
                <a href="/daynamicShowproduct/">
                  <p>Volleyball</p>
                </a>
              </li>

              <li>
                <a href="/daynamicShowproduct/">
                  <p>Others</p>
                </a>
              </li>
            </ul>
          </div>
        </button>
        <button className="cursor-pointer">
          <div className="dropdown dropdown-hover ">
            <div
              role="button"
              className="btn  bg-white border-0 p-0 m-0 shadow-none"
            >
              Offer
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-50 w-52 p-3 shadow-sm mr-5"
            >
              <li>
                <a>
                  <p className="text-red-500">No offer Available Now</p>
                </a>
              </li>
            </ul>
          </div>
        </button>
      </div>
      <div className="flex justify-center items-center gap-2 ">
        <div className="relative font-bold cursor-pointer  h-[50px] w-[50px] xl:h-[70px] xl:w-[70px] ">
          <Image
            src="/weal.jpg"
            alt="weal image"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <p className="text-3xl lg:text-5xl font-extrabold">WEAL</p>
      </div>

      <div className="md:flex hidden   w-[40%] cursor-pointer justify-end gap-2 md:gap-6 ">
        <div className="relative">
          {/* Search bar */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-400 rounded-xl px-2 h-8 lg:h-9 md:w-30 lg:w-34 xl:w-56"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch} className="cursor-pointer">
              <Image
                src={"/search-svgrepo-com.svg"}
                alt="iconimage"
                height={20}
                width={20}
              />
            </button>
          </div>
        </div>
        <button className="cursor-pointer">
          <Image
            src={"/favorite-svgrepo-com.svg"}
            alt="weal image"
            height={20}
            width={20}
          />
        </button>{" "}
        <button className="cursor-pointer">
          <div className="dropdown dropdown-hover ">
            <div
              tabIndex={0}
              role="button"
              className="btn  bg-white border-0 p-0 m-0  "
            >
              <Image
                src={"/person-svgrepo-com.svg"}
                alt="weal image"
                height={30}
                width={30}
              />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-50 w-52 p-3 shadow-sm mr-5"
            >
              <li>
                <a>
                  <Image
                    src={"/login-2-svgrepo-com.svg"}
                    alt="Loginimage"
                    height={10}
                    width={10}
                  />
                  <p>Login</p>
                </a>
              </li>
              <li>
                <a>
                  <Image
                    src={"/register-svgrepo-com.svg"}
                    alt="Registerimage"
                    height={10}
                    width={10}
                  />
                  <p>Register</p>
                </a>
              </li>
            </ul>
          </div>
        </button>
        <button className="cursor-pointer">
          <Image
            src={"/cart-shopping-svgrepo-com.svg"}
            alt="weal image"
            height={20}
            width={20}
          />
        </button>
      </div>
      {/* movile device responsive start */}
      <div className=" md:hidden md:gap-7 gap-1 flex z-50">
        <button>
          {" "}
          <Image
            src={"/cart-shopping-svgrepo-com.svg"}
            alt="weal image"
            height={30}
            width={30}
          />
        </button>
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer"
              className="btn btn-primary drawer-button bg-white border-0 shadow-none"
            >
              {" "}
              <Image
                src={"/menu-symbol-of-three-parallel-lines-svgrepo-com.svg"}
                alt="iconimage"
                height={20}
                width={20}
              />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>

            <div className="menu bg-base-200 text-base-content min-h-full w-60 p-4">
              {/* Sidebar content here */}
              <label className="input">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input type="search" required placeholder="Search" />
              </label>
              <div className="mt-7 p-2 flex flex-col gap-6 text-xl">
                {/* Man */}
                <div className="flex justify-between">
                  <p>Man</p>
                  <button onClick={() => toggleSection("man")}>
                    {openSections.man ? `-` : `+`}
                  </button>
                </div>
                {openSections.man && (
                  <ul className="text-gray-800 text-xs">
                    <li>
                      <a href="/daynamicShowproduct/Men-Full-Sleeve-Jersey">
                        Full Sleeve Jersey{" "}
                      </a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Men-Half-Sleeve-Jersey">
                        Half Sleeve Jersey{" "}
                      </a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Men-Shorts">Shorts</a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Men-Trouser">Trouser</a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Men-Others">Other</a>
                    </li>
                  </ul>
                )}

                {/* Kids */}
                <div className="flex justify-between">
                  <p>Kids</p>
                  <button onClick={() => toggleSection("kids")}>
                    {openSections.kids ? `-` : `+`}
                  </button>
                </div>
                {openSections.kids && (
                  <ul className="text-gray-800 text-xs">
                    <li>
                      <a href="/daynamicShowproduct/Kids-Full-Sleeve-Jersey">
                        Full Sleeve Jersey{" "}
                      </a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Kids-Half-Sleeve-Jersey">
                        Half Sleeve Jersey{" "}
                      </a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Kids-Shorts">Shorts</a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Kids-Trouser">Trouser</a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Kids-Others">Other</a>
                    </li>
                  </ul>
                )}

                {/* Accessories */}
                <div className="flex justify-between">
                  <p>Accessories</p>
                  <button onClick={() => toggleSection("accessories")}>
                    {openSections.accessories ? `-` : `+`}
                  </button>
                </div>
                {openSections.accessories && (
                  <ul className="text-gray-800 text-xs">
                    <li>
                      <a href="/daynamicShowproduct/Accessories-Cricket">
                        Cricker
                      </a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Accessories-Football">
                        Football
                      </a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Accessories-Badmintion">
                        Batminton
                      </a>
                    </li>
                    <li>
                      <a href="/daynamicShowproduct/Accessories-Volleyball">
                        Volleyball
                      </a>
                    </li>

                    <li>
                      <a href="/daynamicShowproduct/Accessories-Others">
                        Other
                      </a>
                    </li>
                  </ul>
                )}

                <div className="flex justify-between">
                  <p>Offer</p>
                  <button onClick={() => toggleSection("offer")}>
                    {openSections.offer ? `-` : `+`}
                  </button>
                </div>
                {openSections.offer && (
                  <ul className="text-gray-800 text-xs">
                    <li>
                      <a href="#" className="text-red-500">
                        No Offer Avalible now
                      </a>
                    </li>
                  </ul>
                )}
              </div>
              <hr />
              <div className="mt-5 text-2xl">
                <select
                  className="bg-white border border-gray-300 text-gray-700 text-base rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name=""
                  id=""
                >
                  <option value="">My Account</option>
                  <option value="">Login</option>
                  <option value="">Register</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* movile device responsive end */}
    </nav>
  );
}
