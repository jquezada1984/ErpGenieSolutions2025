#!/usr/bin/env python3
"""
Script para insertar datos maestros en las tablas de países, monedas, provincias, etc.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models.empresa import db, Pais, Moneda, Provincia, TipoEntidadComercial, SocialNetwork

def insert_master_data():
    """Insertar datos maestros en las tablas"""
    with app.app_context():
        try:
            print("🚀 Iniciando inserción de datos maestros...")
            
            # Insertar países
            print("📍 Insertando países...")
            paises_data = [
                {'nombre': 'España', 'codigo_iso': 'ES', 'icono': '🇪🇸'},
                {'nombre': 'Estados Unidos', 'codigo_iso': 'US', 'icono': '🇺🇸'},
                {'nombre': 'México', 'codigo_iso': 'MX', 'icono': '🇲🇽'},
                {'nombre': 'Argentina', 'codigo_iso': 'AR', 'icono': '🇦🇷'},
                {'nombre': 'Colombia', 'codigo_iso': 'CO', 'icono': '🇨🇴'},
                {'nombre': 'Chile', 'codigo_iso': 'CL', 'icono': '🇨🇱'},
                {'nombre': 'Perú', 'codigo_iso': 'PE', 'icono': '🇵🇪'},
                {'nombre': 'Brasil', 'codigo_iso': 'BR', 'icono': '🇧🇷'},
                {'nombre': 'Ecuador', 'codigo_iso': 'EC', 'icono': '🇪🇨'},
                {'nombre': 'Venezuela', 'codigo_iso': 'VE', 'icono': '🇻🇪'},
            ]
            
            for pais_data in paises_data:
                pais = Pais.query.filter_by(codigo_iso=pais_data['codigo_iso']).first()
                if not pais:
                    pais = Pais(**pais_data)
                    db.session.add(pais)
                    print(f"  ✅ País agregado: {pais_data['nombre']}")
                else:
                    print(f"  ⚠️  País ya existe: {pais_data['nombre']}")
            
            # Insertar monedas
            print("💰 Insertando monedas...")
            monedas_data = [
                {'codigo': 'EUR', 'nombre': 'Euro'},
                {'codigo': 'USD', 'nombre': 'Dólar Estadounidense'},
                {'codigo': 'MXN', 'nombre': 'Peso Mexicano'},
                {'codigo': 'ARS', 'nombre': 'Peso Argentino'},
                {'codigo': 'COP', 'nombre': 'Peso Colombiano'},
                {'codigo': 'CLP', 'nombre': 'Peso Chileno'},
                {'codigo': 'PEN', 'nombre': 'Sol Peruano'},
                {'codigo': 'BRL', 'nombre': 'Real Brasileño'},
                {'codigo': 'USD', 'nombre': 'Dólar Estadounidense'},  # Ecuador usa USD
                {'codigo': 'VES', 'nombre': 'Bolívar Venezolano'},
            ]
            
            for moneda_data in monedas_data:
                moneda = Moneda.query.filter_by(codigo=moneda_data['codigo']).first()
                if not moneda:
                    moneda = Moneda(**moneda_data)
                    db.session.add(moneda)
                    print(f"  ✅ Moneda agregada: {moneda_data['nombre']}")
                else:
                    print(f"  ⚠️  Moneda ya existe: {moneda_data['nombre']}")
            
            # Insertar provincias de España
            print("🏛️  Insertando provincias de España...")
            espana = Pais.query.filter_by(codigo_iso='ES').first()
            if espana:
                provincias_espana = [
                    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza',
                    'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao',
                    'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón',
                    'L\'Hospitalet de Llobregat', 'A Coruña', 'Vitoria-Gasteiz',
                    'Granada', 'Elche', 'Tarrasa', 'Badalona', 'Oviedo',
                    'Cartagena', 'Jerez de la Frontera', 'Sabadell', 'Móstoles',
                    'Alcalá de Henares', 'Pamplona', 'Fuenlabrada', 'Almería',
                    'San Sebastián', 'Leganés', 'Santander', 'Castellón de la Plana',
                    'Burgos', 'Albacete', 'Alcorcón', 'Getafe', 'Salamanca',
                    'Logroño', 'Huelva', 'Marbella', 'Lleida', 'Tarragona',
                    'León', 'Cádiz', 'Jaén', 'Girona', 'Lugo', 'Cáceres',
                    'Toledo', 'Ceuta', 'Melilla'
                ]
                
                for nombre_provincia in provincias_espana:
                    provincia = Provincia.query.filter_by(nombre=nombre_provincia, id_pais=espana.id_pais).first()
                    if not provincia:
                        provincia = Provincia(nombre=nombre_provincia, id_pais=espana.id_pais)
                        db.session.add(provincia)
                        print(f"  ✅ Provincia agregada: {nombre_provincia}")
                    else:
                        print(f"  ⚠️  Provincia ya existe: {nombre_provincia}")
            
            # Insertar tipos de entidad comercial
            print("🏢 Insertando tipos de entidad comercial...")
            tipos_entidad = [
                {'nombre': 'Sociedad Anónima', 'descripcion': 'Sociedad mercantil con responsabilidad limitada'},
                {'nombre': 'Sociedad Limitada', 'descripcion': 'Sociedad de responsabilidad limitada'},
                {'nombre': 'Autónomo', 'descripcion': 'Persona física que ejerce una actividad económica'},
                {'nombre': 'Sociedad Cooperativa', 'descripcion': 'Sociedad cooperativa'},
                {'nombre': 'Asociación', 'descripcion': 'Entidad sin ánimo de lucro'},
                {'nombre': 'Fundación', 'descripcion': 'Entidad sin ánimo de lucro de carácter fundacional'},
                {'nombre': 'Sociedad Civil', 'descripcion': 'Sociedad civil'},
                {'nombre': 'Comunidad de Bienes', 'descripcion': 'Comunidad de bienes'},
            ]
            
            for tipo_data in tipos_entidad:
                tipo = TipoEntidadComercial.query.filter_by(nombre=tipo_data['nombre']).first()
                if not tipo:
                    tipo = TipoEntidadComercial(**tipo_data)
                    db.session.add(tipo)
                    print(f"  ✅ Tipo de entidad agregado: {tipo_data['nombre']}")
                else:
                    print(f"  ⚠️  Tipo de entidad ya existe: {tipo_data['nombre']}")
            
            # Insertar redes sociales
            print("📱 Insertando redes sociales...")
            redes_sociales = [
                {'nombre': 'Facebook', 'icono': '📘', 'orden': 1},
                {'nombre': 'Twitter', 'icono': '🐦', 'orden': 2},
                {'nombre': 'Instagram', 'icono': '📷', 'orden': 3},
                {'nombre': 'LinkedIn', 'icono': '💼', 'orden': 4},
                {'nombre': 'YouTube', 'icono': '📺', 'orden': 5},
                {'nombre': 'TikTok', 'icono': '🎵', 'orden': 6},
                {'nombre': 'WhatsApp', 'icono': '💬', 'orden': 7},
                {'nombre': 'Telegram', 'icono': '📡', 'orden': 8},
                {'nombre': 'Discord', 'icono': '🎮', 'orden': 9},
                {'nombre': 'Twitch', 'icono': '🎥', 'orden': 10},
            ]
            
            for red_data in redes_sociales:
                red = SocialNetwork.query.filter_by(nombre=red_data['nombre']).first()
                if not red:
                    red = SocialNetwork(**red_data)
                    db.session.add(red)
                    print(f"  ✅ Red social agregada: {red_data['nombre']}")
                else:
                    print(f"  ⚠️  Red social ya existe: {red_data['nombre']}")
            
            # Commit de todos los cambios
            db.session.commit()
            print("✅ Todos los datos maestros han sido insertados correctamente")
            
        except Exception as e:
            print(f"❌ Error al insertar datos maestros: {e}")
            db.session.rollback()
            raise

if __name__ == '__main__':
    insert_master_data() 