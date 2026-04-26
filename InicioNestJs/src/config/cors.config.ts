const origins = (process.env.CORS_ORIGINS?.split(',') ?? [])
  .map((o) => o.trim())
  .filter(Boolean);

if (origins.length === 0) {
  throw new Error(
    'CORS_ORIGINS no está definido o está vacío. Configúralo en .env (orígenes separados por coma).',
  );
}

export const corsConfig = {
  origin: origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};
