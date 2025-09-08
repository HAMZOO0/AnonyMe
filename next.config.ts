/** @type {import('next').NextConfig} */
const nextConfig = {
   eslint: {
      // ⚠️ WARNING: This allows production builds to successfully complete
      ignoreDuringBuilds: true,
   },
};

module.exports = nextConfig;
