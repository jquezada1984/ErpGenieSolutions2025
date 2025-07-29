#!/usr/bin/env python3
"""
Script para probar directamente la funcionalidad de horarios
"""

import requests
import json

def test_horarios_direct():
    """Probar horarios directamente con el microservicio Python"""
    
    print("🧪 Probando horarios directamente con Python...")
    
    # URL del microservicio Python
    PYTHON_URL = "http://localhost:5000"
    
    # 1. Obtener una empresa existente
    print("\n1️⃣ Obteniendo empresa existente...")
    try:
        response = requests.get(f"{PYTHON_URL}/api/empresa")
        if response.status_code == 200:
            empresas = response.json()
            if empresas:
                empresa_id = empresas[0]['id_empresa']
                print(f"✅ Empresa encontrada: {empresa_id}")
            else:
                print("❌ No hay empresas disponibles")
                return
        else:
            print(f"❌ Error obteniendo empresas: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return
    
    # 2. Preparar datos de horarios
    print("\n2️⃣ Preparando datos de horarios...")
    horarios_data = [
        {"dia": 1, "valor": "8:00-18:00"},
        {"dia": 2, "valor": "8:00-18:00"},
        {"dia": 3, "valor": "8:00-18:00"},
        {"dia": 4, "valor": "8:00-18:00"},
        {"dia": 5, "valor": "8:00-18:00"},
        {"dia": 6, "valor": "9:00-14:00"},
        {"dia": 7, "valor": "Cerrado"}
    ]
    
    # 3. Preparar datos de actualización
    update_data = {
        "horarios_apertura": horarios_data
    }
    
    print(f"📝 Datos de actualización: {json.dumps(update_data, indent=2)}")
    
    # 4. Actualizar empresa directamente en Python
    print(f"\n3️⃣ Actualizando empresa {empresa_id} directamente en Python...")
    try:
        response = requests.put(
            f"{PYTHON_URL}/api/empresa/{empresa_id}",
            json=update_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📊 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Actualización exitosa!")
            
            # 5. Verificar que los datos se guardaron
            print("\n4️⃣ Verificando datos guardados...")
            verify_response = requests.get(f"{PYTHON_URL}/api/empresa/{empresa_id}")
            if verify_response.status_code == 200:
                empresa_actualizada = verify_response.json()
                horarios_guardados = empresa_actualizada.get('horarios_apertura', [])
                print(f"✅ Horarios guardados: {len(horarios_guardados)}")
                for horario in horarios_guardados:
                    print(f"  - Día {horario['dia']}: {horario['valor']}")
            else:
                print(f"❌ Error verificando datos: {verify_response.status_code}")
        else:
            print(f"❌ Error en actualización: {response.status_code}")
            print(f"❌ Error details: {response.text}")
            
    except Exception as e:
        print(f"❌ Error durante actualización: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando prueba directa de horarios...")
    test_horarios_direct()
    print("\n✅ Prueba completada!") 