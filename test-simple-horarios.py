#!/usr/bin/env python3
"""
Script de prueba simple para horarios de apertura
"""

import requests
import json

# Configuración
GATEWAY_URL = "http://localhost:3002"

def test_simple_horarios():
    """Probar la actualización simple de horarios"""
    
    print("🧪 Iniciando prueba simple de horarios...")
    
    # 1. Obtener una empresa existente
    print("\n1️⃣ Obteniendo empresa existente...")
    try:
        response = requests.get(f"{GATEWAY_URL}/api/empresas")
        if response.status_code == 200:
            empresas = response.json().get('data', [])
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
    
    # 2. Preparar datos de horarios simples
    print("\n2️⃣ Preparando datos de horarios simples...")
    horarios_simples = [
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
        "horarios_apertura": horarios_simples
    }
    
    print(f"📝 Datos de actualización: {json.dumps(update_data, indent=2)}")
    
    # 4. Actualizar empresa
    print(f"\n3️⃣ Actualizando empresa {empresa_id}...")
    try:
        response = requests.put(
            f"{GATEWAY_URL}/api/empresas/{empresa_id}",
            json=update_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📊 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Actualización exitosa!")
            
            # 5. Verificar que los datos se guardaron
            print("\n4️⃣ Verificando datos guardados...")
            verify_response = requests.get(f"{GATEWAY_URL}/api/empresas/{empresa_id}")
            if verify_response.status_code == 200:
                empresa_actualizada = verify_response.json().get('data', {})
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
    print("🚀 Iniciando prueba simple de horarios...")
    test_simple_horarios()
    print("\n✅ Prueba completada!") 