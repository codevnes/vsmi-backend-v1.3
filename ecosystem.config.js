module.exports = {
  apps: [
    {
      name: 'vsmi-backend-v2',
      script: './dist/index.js',
      instances: 1,
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
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}; 