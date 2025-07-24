import { DataSource } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';
import { Sucursal } from '../entities/sucursal.entity';
import { Usuario } from '../entities/usuario.entity';
import { Perfil } from '../entities/perfil.entity';
import { MenuSeccion, MenuItem } from '../entities/menu.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'db.xfeycgctysoumclptgoh.supabase.co',
  port: 5432,
  username: 'postgres',
  password: 'XeCWl8Dam9CNUS1m',
  database: 'postgres',
  entities: [Empresa, Sucursal, Usuario, Perfil, MenuSeccion, MenuItem],
  ssl: {
    rejectUnauthorized: false
  },
});

async function fixDatabase() {
  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    const queryRunner = dataSource.createQueryRunner();
    
    // Verificar datos existentes
    console.log('\n🔍 Verificando datos existentes...');
    const empresasExistentes = await queryRunner.query('SELECT * FROM empresa');
    console.log(`📊 Empresas encontradas: ${empresasExistentes.length}`);
    
    empresasExistentes.forEach((empresa: any, index: number) => {
      console.log(`${index + 1}. ID: ${empresa.id_empresa}, Nombre: ${empresa.nombre}, RUC: ${empresa.ruc || 'NULL'}`);
    });

    // Eliminar registros con RUC NULL o vacío
    console.log('\n🧹 Limpiando registros con RUC NULL...');
    const deleteResult = await queryRunner.query(`
      DELETE FROM empresa 
      WHERE ruc IS NULL OR ruc = '' OR ruc = 'null'
    `);
    console.log(`🗑️ Registros eliminados: ${deleteResult.rowCount}`);

    // Verificar si quedan empresas
    const empresasRestantes = await queryRunner.query('SELECT COUNT(*) as count FROM empresa');
    console.log(`📊 Empresas restantes: ${empresasRestantes[0].count}`);

    // Si no quedan empresas, insertar datos de prueba
    if (empresasRestantes[0].count === 0) {
      console.log('\n📝 Insertando empresas de prueba...');
      
      const empresasPrueba = [
        {
          nombre: 'Empresa Demo 1',
          ruc: '12345678901',
          direccion: 'Av. Principal 123, Lima',
          telefono: '01-123-4567',
          email: 'demo1@empresa.com',
          estado: true
        },
        {
          nombre: 'Empresa Demo 2',
          ruc: '98765432109',
          direccion: 'Jr. Comercial 456, Arequipa',
          telefono: '054-987-6543',
          email: 'demo2@empresa.com',
          estado: true
        },
        {
          nombre: 'Empresa Demo 3',
          ruc: '55566677788',
          direccion: 'Calle Industrial 789, Trujillo',
          telefono: '044-555-6666',
          email: 'demo3@empresa.com',
          estado: true
        }
      ];

      for (const empresaData of empresasPrueba) {
        await queryRunner.query(`
          INSERT INTO empresa (nombre, ruc, direccion, telefono, email, estado)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [empresaData.nombre, empresaData.ruc, empresaData.direccion, empresaData.telefono, empresaData.email, empresaData.estado]);
        console.log(`✅ Empresa creada: ${empresaData.nombre}`);
      }
    }

    // Verificar estructura de la tabla
    console.log('\n🔍 Verificando estructura de la tabla empresa...');
    const columns = await queryRunner.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'empresa'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Estructura actual:');
    columns.forEach((column: any) => {
      console.log(`- ${column.column_name}: ${column.data_type} ${column.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });

    // Verificar datos finales
    console.log('\n📋 Datos finales:');
    const empresasFinales = await queryRunner.query('SELECT * FROM empresa ORDER BY nombre');
    empresasFinales.forEach((empresa: any) => {
      console.log(`- ${empresa.nombre} (RUC: ${empresa.ruc})`);
    });

    await queryRunner.release();

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
    console.log('\n🔌 Conexión cerrada');
  }
}

fixDatabase(); 