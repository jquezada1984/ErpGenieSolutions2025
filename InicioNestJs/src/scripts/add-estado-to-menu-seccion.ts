import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function addEstadoColumn() {
  try {
    console.log('🔧 Conectando a la base de datos...');
    
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'postgres',
      ssl: {
        rejectUnauthorized: false
      },
    });

    console.log('✅ Conexión establecida');

    // Verificar si la columna ya existe
    const columnExists = await connection.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'menu_seccion' 
      AND column_name = 'estado'
    `);

    if (columnExists.length > 0) {
      console.log('ℹ️ La columna estado ya existe en menu_seccion');
      return;
    }

    // Agregar la columna estado
    console.log('🔧 Agregando columna estado a menu_seccion...');
    await connection.query(`
      ALTER TABLE menu_seccion 
      ADD COLUMN estado BOOLEAN DEFAULT true
    `);

    console.log('✅ Columna estado agregada exitosamente');

    // Actualizar registros existentes para que tengan estado = true
    console.log('🔧 Actualizando registros existentes...');
    await connection.query(`
      UPDATE menu_seccion 
      SET estado = true 
      WHERE estado IS NULL
    `);

    console.log('✅ Registros actualizados');

    await connection.close();
    console.log('✅ Conexión cerrada');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addEstadoColumn();
