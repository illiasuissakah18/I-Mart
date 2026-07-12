module.exports = {
  apps: [
    {
      name: "i-mart",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
