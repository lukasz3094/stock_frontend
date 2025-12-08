module.exports = {
  features: {
    // Enable Vue Language Server plugin for Vue files
    vue: true,
    // Enable TypeScript Language Server plugin for TypeScript files
    typescript: {
      // Enable TypeScript support
      enable: true,
      // Specify the tsconfig file to use
      tsconfig: './tsconfig.app.json',
    },
  },
};
