module.exports = {
  apps: [
    {
      name: "GraceFrontend",
      script: "server.js",
      watch: true,
      merge_logs: true,
      cwd: "./src",
    },
  ],
};
