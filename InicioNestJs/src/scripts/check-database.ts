import { DataSource } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';
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
  entities: [Empresa],
  ssl: {
    rejectUnauthorized: false
  },
});

async function checkDatabase() {
  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar si la tabla empresa existe
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

    // Verificar estructura de la tabla empresa si existe
    const empresaTableExists = tables.some((table: any) => table.table_name === 'empresa');
    
    if (empresaTableExists) {
      console.log('\n🔍 Estructura de la tabla empresa:');
      const columns = await queryRunner.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'empresa'
        ORDER BY ordinal_position;
      `);
      
      columns.forEach((column: any) => {
        console.log(`- ${column.column_name}: ${column.data_type} ${column.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
      });

      // Contar registros
      const count = await queryRunner.query('SELECT COUNT(*) as count FROM empresa');
      console.log(`\n📊 Registros en tabla empresa: ${count[0].count}`);
    } else {
      console.log('\n❌ La tabla empresa no existe');
    }

    await queryRunner.release();

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
    console.log('\n🔌 Conexión cerrada');
  }
}

checkDatabase(); 