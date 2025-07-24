import { DataSource } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'db.xfeycgctysoumclptgoh.supabase.co',
  port: 5432,
  username: 'postgres',
  password: 'XeCWl8Dam9CNUS1m',
  database: 'postgres',
  entities: [Empresa],
  ssl: {
    rejectUnauthorized: false
  },
});

async function seedEmpresas() {
  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    const empresaRepository = dataSource.getRepository(Empresa);

    // Verificar si ya existen empresas
    const empresasExistentes = await empresaRepository.count();
    console.log(`📊 Empresas existentes: ${empresasExistentes}`);

    if (empresasExistentes === 0) {
      // Insertar empresas de prueba
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
        const empresa = empresaRepository.create(empresaData);
        await empresaRepository.save(empresa);
        console.log(`✅ Empresa creada: ${empresa.nombre}`);
      }

      console.log('🎉 Todas las empresas de prueba han sido creadas');
    } else {
      console.log('ℹ️ Ya existen empresas en la base de datos');
    }

    // Mostrar todas las empresas
    const todasLasEmpresas = await empresaRepository.find();
    console.log('\n📋 Lista de empresas:');
    todasLasEmpresas.forEach(empresa => {
      console.log(`- ${empresa.nombre} (RUC: ${empresa.ruc})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexión cerrada');
  }
}

seedEmpresas(); 