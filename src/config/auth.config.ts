export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'vsmi-secret-key',
  jwtExpiration: 86400, // 24 hours in seconds
  jwtRefreshExpiration: 604800, // 7 days in seconds
}; 