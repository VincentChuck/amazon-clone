/** @type {import("prettier").Config} */
const config = {
  plugins: [
    require.resolve('prettier-plugin-tailwindcss'),
    require.resolve('prettier-plugin-prisma'),
  ],
  singleQuote: true,
};

module.exports = config;
