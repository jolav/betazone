/* */

//const os = require("os");
//const cpus = os.cpus().length;

module.exports = {
  apps: [{
    name: "betazone",
    script: 'betazone.js',
    env: {
      NODE_ENV: "production",
    },
    ignore_watch: [
      "node_modules",
    ],
    instances: 1, // cpus - 1,
    max_memory_restart: "500M",
    output: `/home/${process.env.USER}/.mylogs/info.log`,
    error: `/home/${process.env.USER}/.mylogs/error.log`,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};
