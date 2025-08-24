import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcryptjs';

async function createTestUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    console.log('🔍 Verificando si existe usuario de prueba...');
    
    // Verificar si ya existe un usuario con email test@example.com
    const existingUser = await authService['usuarioRepository'].findOne({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('✅ Usuario de prueba ya existe:', existingUser.email);
      console.log('📋 Datos del usuario:');
      console.log('   - ID:', existingUser.id_usuario);
      console.log('   - Email:', existingUser.email);
      console.log('   - Username:', existingUser.username);
      console.log('   - Estado:', existingUser.estado);
      return;
    }

    console.log('📝 Creando usuario de prueba...');
    
    // Crear hash de la contraseña
    const passwordHash = await bcrypt.hash('123456', 10);
    
    // Crear usuario de prueba
    const testUser = authService['usuarioRepository'].create({
      username: 'testuser',
      email: 'test@example.com',
      password_hash: passwordHash,
      nombre_completo: 'Usuario de Prueba',
      estado: true,
      id_empresa: '00000000-0000-0000-0000-000000000001', // UUID por defecto
      id_perfil: '00000000-0000-0000-0000-000000000001', // UUID por defecto
    });

    const savedUser = await authService['usuarioRepository'].save(testUser);
    
    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log('   - ID:', savedUser.id_usuario);
    console.log('   - Email:', savedUser.email);
    console.log('   - Username:', savedUser.username);
    console.log('   - Contraseña: 123456');
    console.log('   - Estado:', savedUser.estado);
    
    console.log('\n🎯 Credenciales para login:');
    console.log('   Email: test@example.com');
    console.log('   Contraseña: 123456');
    
  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error);
  } finally {
    await app.close();
  }
}

createTestUser(); 