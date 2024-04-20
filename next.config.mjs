/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    prependData: `@import "./_mantine.scss";`,
  },
  future: {

    // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
    webpack5: true,   
  },

  webpack(config) {
    config.resolve.fallback = {
      fs: false, // the solution
      net:false,
      tls:false,
      child_process:false,
      crypto:false,
      path:false,
      os:false,
      stream:false,
      bufferutil:false
    };
    
    return config;
  },
};

export default nextConfig;
