module.exports = {
  apps: [
    {
      name: 'my-app',
      script: 'nodemon',
      args: '--exec babel-node server.js',
      watch: true,
      ignore_watch: ['node_modules'],
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
