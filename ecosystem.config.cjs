module.exports = {
  apps: [
    {
      name: 'cks-website',
      cwd: 'c:\\Users\\gugus\\Documents\\pjtki\\website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        PORT: 8000,
        NODE_ENV: 'production',
      },
    },
  ],
};
