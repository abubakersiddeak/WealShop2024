"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LiveSearchBar({ handleSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 1) {
        fetch(`/api/findproduct/search?query=${query}`)
          .then((res) => res.json())
          .then((data) => setSuggestions(data.products || []));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (name) => {
    setQuery(name);
    setSuggestions([]);
    router.push(`/searchproduct/${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="px-4 py-2 h-10 w-36 lg:w-48 xl:w-64 text-gray-700 outline-none"
      />
      <button
        onClick={handleSearch}
        className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        aria-label="Perform search"
      ></button>
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow z-50">
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
