import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [],
  ssl: {
    rejectUnauthorized: false
  },
});

async function checkDatabase() {
  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida (Financiero)');

    // Verificar tablas
    const queryRunner = dataSource.createQueryRunner();
    
    // Listar todas las tablas
    const tables = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tablas en la base de datos:');
    tables.forEach((table: any) => {
      console.log(`- ${table.table_name}`);
    });

    await queryRunner.release();

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
    console.log('\n🔌 Conexión cerrada');
  }
}

checkDatabase();

