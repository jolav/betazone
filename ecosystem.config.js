module.exports = {
  apps: [{
    name: 'betazone',
    script: 'betazone.js',
    ignore_watch: ["node_modules", "sp500/data"],
    output: './../logs/hits.log',
    error: './../logs/errors.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};