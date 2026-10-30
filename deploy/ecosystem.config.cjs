// PM2 process file:  pm2 start deploy/ecosystem.config.cjs && pm2 save
module.exports = {
  apps: [
    {
      name: 'smparamount',
      script: 'dist/smparamount/server/server.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        SITE_URL: 'https://smparamount.in',
        SITE_INDEXABLE: 'true', // set to 'false' on staging
      },
    },
  ],
};
