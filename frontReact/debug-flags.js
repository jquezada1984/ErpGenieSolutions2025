import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const flagsDir = path.join(__dirname, 'public', 'flags');

console.log('🔍 Diagnóstico de Banderas');
console.log('==========================');

// Verificar si existe el directorio
if (!fs.existsSync(flagsDir)) {
  console.log('❌ El directorio flags/ no existe');
  process.exit(1);
}

console.log(`✅ Directorio flags/ encontrado en: ${flagsDir}`);

// Listar archivos
const files = fs.readdirSync(flagsDir);
console.log(`📁 Total de archivos: ${files.length}`);

// Verificar archivos específicos
const testCountries = ['pe', 'ar', 'br', 'cl', 'co', 'mx', 'us', 'es', 'ru'];

console.log('\n🔍 Verificando archivos específicos:');
testCountries.forEach(country => {
  const filePath = path.join(flagsDir, `${country}.png`);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${country}.png - ${stats.size} bytes`);
  } else {
    console.log(`❌ ${country}.png - NO ENCONTRADO`);
  }
});

// Verificar URLs que se usarán en el componente
console.log('\n🌐 URLs que se usarán en el componente:');
testCountries.forEach(country => {
  console.log(`   /flags/${country}.png`);
});

// Verificar estructura de archivos
console.log('\n📋 Lista completa de archivos:');
files.forEach(file => {
  if (file.endsWith('.png')) {
    const filePath = path.join(flagsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${file} - ${stats.size} bytes`);
  }
});

console.log('\n💡 Sugerencias:');
console.log('1. Si los archivos existen, el problema puede ser en la ruta del servidor');
console.log('2. Verifica que el servidor de desarrollo esté sirviendo archivos estáticos');
console.log('3. Abre las herramientas de desarrollador y revisa la pestaña Network');
console.log('4. Intenta acceder directamente a: http://localhost:5173/flags/pe.png');

// Crear un archivo de prueba HTML
const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Banderas</title>
</head>
<body>
    <h1>Test de Banderas</h1>
    <p>Verificando que las imágenes se carguen correctamente:</p>
    <div>
        <img src="/flags/pe.png" alt="Perú" style="width: 40px; height: 30px; border: 1px solid #ccc;">
        <span>Perú</span>
    </div>
    <div>
        <img src="/flags/ar.png" alt="Argentina" style="width: 40px; height: 30px; border: 1px solid #ccc;">
        <span>Argentina</span>
    </div>
    <div>
        <img src="/flags/br.png" alt="Brasil" style="width: 40px; height: 30px; border: 1px solid #ccc;">
        <span>Brasil</span>
    </div>
    <script>
        // Verificar carga de imágenes
        document.querySelectorAll('img').forEach(img => {
            img.onload = () => console.log('✅ Cargada:', img.src);
            img.onerror = () => console.log('❌ Error cargando:', img.src);
        });
    </script>
</body>
</html>
`;

const testHtmlPath = path.join(__dirname, 'public', 'test-flags.html');
fs.writeFileSync(testHtmlPath, testHtml);
console.log(`\n📄 Archivo de prueba creado: ${testHtmlPath}`);
console.log('   Accede a: http://localhost:5173/test-flags.html'); 