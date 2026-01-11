/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb", // Increase this to 10MB or more
    },
  },
};

export default nextConfig;
