module.exports = {
  apps: [
    {
      name: 'cks-dev',
      cwd: 'c:\\Users\\gugus\\Documents\\pjtki\\website',
      script: 'node_modules/next/dist/bin/next',
      args: 'dev --turbopack',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
