import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'erp',
  entities: [],
  migrations: [],
  synchronize: false,
});

async function addIconoToMenuSeccion() {
  try {
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    // Agregar columna icono si no existe
    const query = `
      ALTER TABLE public.menu_seccion 
      ADD COLUMN IF NOT EXISTS icono character varying(100);
      
      COMMENT ON COLUMN public.menu_seccion.icono IS 'Icono de la sección del menú (ej: bi bi-list-ul)';
    `;

    await AppDataSource.query(query);
    console.log('✅ Campo icono agregado exitosamente a la tabla menu_seccion');

  } catch (error) {
    console.error('❌ Error al agregar el campo icono:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

addIconoToMenuSeccion(); 