#!/usr/bin/env python3
"""
Script para probar la creación de una empresa con todos los nuevos campos y relaciones
"""

import sys
import os
import requests
import json
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_empresa_completa():
    """Probar la creación de una empresa con todos los campos"""
    
    # URL del microservicio
    base_url = "http://localhost:5000/api"
    
    # Datos de la empresa completa
    empresa_data = {
        "nombre": "TechCorp Solutions S.L.",
        "ruc": "B12345678",
        "direccion": "Calle Mayor 123, Madrid",
        "telefono": "+34 91 123 45 67",
        "email": "info@techcorp.es",
        "estado": True,
        "id_moneda": None,  # Se asignará después
        "id_pais": None,    # Se asignará después
        "codigo_postal": "28001",
        "poblacion": "Madrid",
        "movil": "+34 600 123 456",
        "fax": "+34 91 123 45 68",
        "web": "https://www.techcorp.es",
        "nota": "Empresa especializada en soluciones tecnológicas",
        "sujeto_iva": True,
        "id_provincia": None,  # Se asignará después
        "fiscal_year_start_month": 1,
        "fiscal_year_start_day": 1,
        "identificacion": {
            "administradores": "Juan Pérez García",
            "delegado_datos": "María López Fernández",
            "capital": 50000.00,
            "id_tipo_entidad": 2,  # Sociedad Limitada
            "objeto_empresa": "Desarrollo de software y consultoría tecnológica",
            "cif_intra": "ESB12345678",
            "id_profesional1": "Juan Pérez García",
            "id_profesional2": "María López Fernández"
        },
        "redes_sociales": [
            {
                "id_red_social": None,  # Se asignará después
                "identificador": "techcorp_solutions",
                "url": "https://www.linkedin.com/company/techcorp-solutions",
                "es_principal": True
            },
            {
                "id_red_social": None,  # Se asignará después
                "identificador": "@techcorp_solutions",
                "url": "https://twitter.com/techcorp_solutions",
                "es_principal": False
            }
        ],
        "horarios_apertura": [
            {"dia": 1, "valor": "09:00-18:00"},  # Lunes
            {"dia": 2, "valor": "09:00-18:00"},  # Martes
            {"dia": 3, "valor": "09:00-18:00"},  # Miércoles
            {"dia": 4, "valor": "09:00-18:00"},  # Jueves
            {"dia": 5, "valor": "09:00-17:00"},  # Viernes
            {"dia": 6, "valor": "10:00-14:00"},  # Sábado
            {"dia": 7, "valor": "Cerrado"}       # Domingo
        ]
    }
    
    try:
        print("🔍 Obteniendo datos maestros...")
        
        # Obtener monedas
        response = requests.get(f"{base_url}/moneda")
        if response.status_code == 200:
            monedas = response.json()
            if monedas:
                empresa_data["id_moneda"] = monedas[0]["id_moneda"]  # Primera moneda (EUR)
                print(f"✅ Moneda asignada: {monedas[0]['nombre']}")
        
        # Obtener países
        response = requests.get(f"{base_url}/pais")
        if response.status_code == 200:
            paises = response.json()
            espana = next((p for p in paises if p["codigo_iso"] == "ES"), None)
            if espana:
                empresa_data["id_pais"] = espana["id_pais"]
                print(f"✅ País asignado: {espana['nombre']}")
        
        # Obtener provincias de España
        response = requests.get(f"{base_url}/provincia")
        if response.status_code == 200:
            provincias = response.json()
            madrid = next((p for p in provincias if p["nombre"] == "Madrid"), None)
            if madrid:
                empresa_data["id_provincia"] = madrid["id_provincia"]
                print(f"✅ Provincia asignada: {madrid['nombre']}")
        
        # Obtener redes sociales
        response = requests.get(f"{base_url}/red-social")
        if response.status_code == 200:
            redes = response.json()
            linkedin = next((r for r in redes if r["nombre"] == "LinkedIn"), None)
            twitter = next((r for r in redes if r["nombre"] == "Twitter"), None)
            
            if linkedin:
                empresa_data["redes_sociales"][0]["id_red_social"] = linkedin["id_red_social"]
                print(f"✅ Red social LinkedIn asignada")
            
            if twitter:
                empresa_data["redes_sociales"][1]["id_red_social"] = twitter["id_red_social"]
                print(f"✅ Red social Twitter asignada")
        
        print("\n📝 Creando empresa con datos completos...")
        print(json.dumps(empresa_data, indent=2, ensure_ascii=False))
        
        # Crear empresa
        response = requests.post(
            f"{base_url}/empresa",
            json=empresa_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            empresa_creada = response.json()
            print(f"\n✅ Empresa creada exitosamente!")
            print(f"ID: {empresa_creada['id_empresa']}")
            print(f"Nombre: {empresa_creada['nombre']}")
            print(f"RUC: {empresa_creada['ruc']}")
            print(f"Email: {empresa_creada['email']}")
            
            # Verificar que se crearon las relaciones
            if 'identificacion' in empresa_creada:
                print(f"✅ Identificación creada: {empresa_creada['identificacion']['administradores']}")
            
            if 'redes_sociales' in empresa_creada and empresa_creada['redes_sociales']:
                print(f"✅ {len(empresa_creada['redes_sociales'])} redes sociales creadas")
            
            if 'horarios_apertura' in empresa_creada and empresa_creada['horarios_apertura']:
                print(f"✅ {len(empresa_creada['horarios_apertura'])} horarios de apertura creados")
            
            return empresa_creada['id_empresa']
            
        else:
            print(f"❌ Error al crear empresa: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error en la prueba: {e}")
        return None

def test_obtener_empresa(id_empresa):
    """Probar la obtención de una empresa con todas sus relaciones"""
    if not id_empresa:
        return
    
    base_url = "http://localhost:5000/api"
    
    try:
        print(f"\n🔍 Obteniendo empresa {id_empresa}...")
        
        response = requests.get(f"{base_url}/empresa/{id_empresa}")
        
        if response.status_code == 200:
            empresa = response.json()
            print(f"✅ Empresa obtenida exitosamente!")
            print(f"Nombre: {empresa['nombre']}")
            print(f"País: {empresa.get('pais', {}).get('nombre', 'N/A')}")
            print(f"Moneda: {empresa.get('moneda', {}).get('nombre', 'N/A')}")
            print(f"Provincia: {empresa.get('provincia', {}).get('nombre', 'N/A')}")
            
            if 'identificacion' in empresa:
                print(f"Administradores: {empresa['identificacion']['administradores']}")
                print(f"Capital: {empresa['identificacion']['capital']}")
            
            if 'redes_sociales' in empresa and empresa['redes_sociales']:
                print("Redes sociales:")
                for red in empresa['redes_sociales']:
                    print(f"  - {red['red_social']['nombre']}: {red['url']}")
            
            if 'horarios_apertura' in empresa and empresa['horarios_apertura']:
                print("Horarios de apertura:")
                for horario in empresa['horarios_apertura']:
                    print(f"  - Día {horario['dia']}: {horario['valor']}")
        else:
            print(f"❌ Error al obtener empresa: {response.status_code}")
            print(f"Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Error al obtener empresa: {e}")

if __name__ == '__main__':
    print("🚀 Iniciando prueba de empresa completa...")
    
    # Crear empresa
    id_empresa = test_empresa_completa()
    
    # Obtener empresa
    test_obtener_empresa(id_empresa)
    
    print("\n✅ Prueba completada!") 