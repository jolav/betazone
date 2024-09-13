/* */

module.exports = {
  apps: [{
    name: "BetaZone",
    script: 'betazone.js',
    env: {
      NODE_ENV: "production",
    },
    ignore_watch: [
      "node_modules",
    ],
    //instances: 1,
    max_memory_restart: "500M",
    output: `/home/${process.env.USER}/.myLogs/betazone-out.log`,
    error: `/home/${process.env.USER}/.myLogs/betazone-error.log`,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};
