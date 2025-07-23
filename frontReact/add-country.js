import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);
const countryCode = args[0]?.toUpperCase();
const countryName = args[1];

if (!countryCode || !countryName) {
  console.log('❌ Uso: node add-country.js <CODIGO_PAIS> <NOMBRE_PAIS>');
  console.log('Ejemplo: node add-country.js MX México');
  process.exit(1);
}

const flagsDir = path.join(__dirname, 'public', 'flags');
const filePath = path.join(flagsDir, `${countryCode.toLowerCase()}.png`);

// Verificar si ya existe
if (fs.existsSync(filePath)) {
  console.log(`⚠️  La bandera para ${countryCode} ya existe`);
  process.exit(0);
}

function downloadFlag() {
  return new Promise((resolve, reject) => {
    const url = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ ${countryCode} - ${countryName} descargado exitosamente`);
          resolve();
        });
      } else {
        console.log(`❌ Error ${response.statusCode} al descargar ${countryCode}`);
        fs.unlink(filePath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.log(`❌ Error de red: ${err.message}`);
      reject(err);
    });
  });
}

async function addCountry() {
  console.log(`🚀 Agregando país: ${countryCode} - ${countryName}`);
  
  try {
    await downloadFlag();
    
    console.log('\n📝 Pasos adicionales:');
    console.log('1. Agregar el emoji correspondiente en CountryFlag.tsx');
    console.log('2. Actualizar la lista de países en el backend si es necesario');
    console.log('3. Ejecutar npm run build para incluir la nueva bandera');
    
  } catch (error) {
    console.log(`❌ Error al agregar ${countryCode}: ${error.message}`);
    process.exit(1);
  }
}

addCountry(); 