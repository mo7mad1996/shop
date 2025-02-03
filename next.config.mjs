/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  sassOptions: {
    includePaths: ["./src"],
  },
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, "bcrypt"];

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
