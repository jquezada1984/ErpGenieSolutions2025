export const corsConfig = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}; 