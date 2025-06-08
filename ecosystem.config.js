module.exports = {
  apps: [
    {
      name: 'vsmi-backend-v2',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3030
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3030
      },
      max_memory_restart: '1G',
      autorestart: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      node_args: '--max-old-space-size=1024',
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 50000,
      cron_restart: '0 3 * * *',
      exp_backoff_restart_delay: 100
    }
  ]
}; 