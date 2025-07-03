/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // অথবা প্রয়োজনমতো নির্দিষ্ট path pattern দিন
      },
    ],
  },
};

export default nextConfig;
