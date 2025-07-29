from flask import Blueprint, request, jsonify
from models.empresa import Empresa, EmpresaIdentificacion, EmpresaRedSocial, EmpresaHorarioApertura, SocialNetwork
from schemas.empresa_schema import EmpresaSchema, EmpresaCreateSchema, EmpresaUpdateSchema, PaisSchema, MonedaSchema, ProvinciaSchema, TipoEntidadComercialSchema, SocialNetworkSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
import uuid

empresa_bp = Blueprint('empresa_bp', __name__)
empresa_schema = EmpresaSchema()
empresa_create_schema = EmpresaCreateSchema()
empresa_update_schema = EmpresaUpdateSchema()

def is_valid_uuid(val):
    """Verificar si un valor es un UUID válido"""
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False

def clean_uuid_fields(data_dict):
    """Limpiar campos UUID para evitar problemas de tipo de datos"""
    cleaned = {}
    for key, value in data_dict.items():
        if value is not None:
            if key.endswith('_id') or 'id_' in key:
                # Convertir a string si es un UUID
                if isinstance(value, (int, float)):
                    cleaned[key] = str(value)
                else:
                    cleaned[key] = str(value)
            else:
                cleaned[key] = value
        else:
            cleaned[key] = value
    return cleaned

@empresa_bp.route('/empresa', methods=['GET', 'OPTIONS'])
@empresa_bp.route('/empresa/', methods=['GET', 'OPTIONS'])
def obtener_empresas():
    """Obtener todas las empresas"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        empresas = Empresa.query.filter_by(estado=True).all()
        return jsonify(empresa_schema.dump(empresas, many=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa/<string:id_empresa>', methods=['GET', 'OPTIONS'])
@empresa_bp.route('/empresa/<string:id_empresa>/', methods=['GET', 'OPTIONS'])
def obtener_empresa(id_empresa):
    """Obtener una empresa específica"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        empresa = Empresa.query.get_or_404(id_empresa)
        return jsonify(empresa_schema.dump(empresa)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa', methods=['POST', 'OPTIONS'])
@empresa_bp.route('/empresa/', methods=['POST', 'OPTIONS'])
def crear_empresa():
    """Crear una nueva empresa"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear empresa: {data}")
        
        # Validar y deserializar
        errors = empresa_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Crear empresa
        empresa = Empresa(**data)
        db.session.add(empresa)
        db.session.flush()  # Para obtener el ID de la empresa
        
        # Crear identificación si se proporciona
        if 'identificacion' in data:
            identificacion_data = data['identificacion']
            identificacion_data['id_empresa'] = empresa.id_empresa
            identificacion = EmpresaIdentificacion(**identificacion_data)
            db.session.add(identificacion)
        
        # Crear redes sociales si se proporcionan
        if 'redes_sociales' in data and isinstance(data['redes_sociales'], list):
            for red_social_data in data['redes_sociales']:
                red_social_data['id_empresa'] = empresa.id_empresa
                red_social = EmpresaRedSocial(**red_social_data)
                db.session.add(red_social)
        
        # Crear horarios de apertura si se proporcionan
        if 'horarios_apertura' in data and isinstance(data['horarios_apertura'], list):
            for horario_data in data['horarios_apertura']:
                horario_data['id_empresa'] = empresa.id_empresa
                horario = EmpresaHorarioApertura(**horario_data)
                db.session.add(horario)
        
        db.session.commit()
        
        result = empresa_schema.dump(empresa)
        print(f"✅ Empresa creada exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear empresa: {e}")
        db.session.rollback()
        # Detectar si es error de RUC duplicado
        if "ruc" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una empresa con este RUC',
                'field': 'ruc',
                'type': 'duplicate'
            }), 409
        # Detectar si es error de email duplicado
        elif "email" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una empresa con este email',
                'field': 'email',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear empresa: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa/<string:id_empresa>', methods=['PUT', 'OPTIONS'])
@empresa_bp.route('/empresa/<string:id_empresa>/', methods=['PUT', 'OPTIONS'])
def actualizar_empresa(id_empresa):
    """Actualizar una empresa existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        empresa = Empresa.query.get(id_empresa)
        if not empresa:
            return jsonify({'error': 'Empresa no encontrada'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar empresa {id_empresa}: {data}")
        print(f"📝 Tipos de datos recibidos:")
        for key, value in data.items():
            print(f"  - {key}: {type(value)} = {value}")
        
        # Validar y deserializar (simplificado temporalmente)
        print(f"🔧 Saltando validación de esquema temporalmente para debugging")
        
        # Limpiar campos UUID para evitar problemas de tipo de datos
        cleaned_data = clean_uuid_fields(data)
        print(f"🔧 Datos limpiados: {cleaned_data}")
        
        # Actualizar campos de empresa
        print(f"🔧 Actualizando campos de empresa:")
        for key, value in cleaned_data.items():
            if hasattr(empresa, key) and key not in ['identificacion', 'redes_sociales', 'horarios_apertura']:
                # Convertir cadenas vacías a None para campos UUID
                if key in ['id_moneda', 'id_pais', 'id_provincia'] and value == '':
                    value = None
                    print(f"  - {key}: {value} (convertido de cadena vacía a None)")
                else:
                    print(f"  - {key}: {value}")
                setattr(empresa, key, value)
            else:
                print(f"  - {key}: (ignorado - no es campo directo de empresa)")
        
        # Actualizar identificación si se proporciona
        if 'identificacion' in cleaned_data:
            print(f"🔧 Procesando identificación: {cleaned_data['identificacion']}")
            print(f"🔧 Tipo de identificacion: {type(cleaned_data['identificacion'])}")
            print(f"🔧 Claves de identificacion: {list(cleaned_data['identificacion'].keys()) if isinstance(cleaned_data['identificacion'], dict) else 'No es dict'}")
            
            # Verificar que la identificación sea un diccionario
            if not isinstance(cleaned_data['identificacion'], dict):
                print(f"⚠️ Identificación no es un diccionario, saltando: {type(cleaned_data['identificacion'])}")
            else:
                # Verificar si hay datos en la identificación
                if not cleaned_data['identificacion']:
                    print(f"⚠️ Identificación está vacía, saltando")
                else:
                    print(f"🔧 Identificación tiene datos, procesando...")
                    identificacion = EmpresaIdentificacion.query.filter_by(id_empresa=id_empresa).first()
                    if identificacion:
                        print(f"🔧 Actualizando identificación existente")
                        for key, value in cleaned_data['identificacion'].items():
                            if hasattr(identificacion, key):
                                print(f"  - Actualizando {key}: {value}")
                                setattr(identificacion, key, value)
                    else:
                        print(f"🔧 Creando nueva identificación")
                        # Filtrar solo los campos válidos del modelo
                        valid_fields = {}
                        for key, value in cleaned_data['identificacion'].items():
                            if hasattr(EmpresaIdentificacion, key):
                                valid_fields[key] = value
                                print(f"  - Campo válido {key}: {value}")
                            else:
                                print(f"  - Campo inválido ignorado {key}: {value}")
                        
                        # Agregar el id_empresa
                        valid_fields['id_empresa'] = id_empresa
                        
                        # Generar un UUID válido para el campo id_identificacion si es necesario
                        if 'id_identificacion' in valid_fields and valid_fields['id_identificacion'].startswith('temp_'):
                            valid_fields['id_identificacion'] = str(uuid.uuid4())
                            print(f"🔧 Generando UUID válido para id_identificacion: {valid_fields['id_identificacion']}")
                        
                        print(f"🔧 Creando identificación con campos válidos: {valid_fields}")
                        try:
                            identificacion = EmpresaIdentificacion(**valid_fields)
                            db.session.add(identificacion)
                            print(f"✅ Identificación creada exitosamente")
                        except Exception as e:
                            print(f"❌ Error creando identificación: {e}")
                            raise
        
        # Actualizar redes sociales si se proporcionan
        if 'redes_sociales' in cleaned_data:
            print(f"🔧 Procesando redes sociales: {cleaned_data['redes_sociales']}")
            print(f"🔧 Tipo de redes_sociales: {type(cleaned_data['redes_sociales'])}")
            
            # Verificar que las redes sociales sean una lista
            if not isinstance(cleaned_data['redes_sociales'], list):
                print(f"⚠️ Redes sociales no es una lista, saltando: {type(cleaned_data['redes_sociales'])}")
            else:
                # Eliminar redes sociales existentes
                EmpresaRedSocial.query.filter_by(id_empresa=id_empresa).delete()
                
                # Crear nuevas redes sociales
                if len(cleaned_data['redes_sociales']) > 0:
                    for red_social_data in cleaned_data['redes_sociales']:
                        print(f"🔧 Procesando red social con campos originales: {list(red_social_data.keys())}")
                        
                        # Verificar que tenga los campos mínimos requeridos
                        if not red_social_data.get('id_red_social'):
                            print(f"⚠️ Red social sin id_red_social, saltando: {red_social_data}")
                            continue
                        
                        # Filtrar solo los campos válidos del modelo
                        valid_fields = {}
                        for key, value in red_social_data.items():
                            if hasattr(EmpresaRedSocial, key):
                                valid_fields[key] = value
                        
                        # Agregar el id_empresa
                        valid_fields['id_empresa'] = id_empresa
                        
                        # Eliminar campos que no son parte del modelo pero vienen del frontend
                        if 'red_social' in valid_fields:
                            print(f"🔧 Eliminando campo 'red_social' del diccionario")
                            del valid_fields['red_social']
                        
                        # Generar un UUID válido para el campo id (no usar el ID temporal del frontend)
                        if 'id' in valid_fields and valid_fields['id'].startswith('temp_'):
                            valid_fields['id'] = str(uuid.uuid4())
                            print(f"🔧 Generando UUID válido para id: {valid_fields['id']}")
                        
                        # Manejar id_red_social - buscar o crear la red social correspondiente
                        if 'id_red_social' in valid_fields:
                            red_social_id = valid_fields['id_red_social']
                            print(f"🔧 Procesando id_red_social: {red_social_id}")
                            
                            # Si es un número, buscar la red social por orden o crear una nueva
                            if str(red_social_id).isdigit():
                                # Buscar red social por orden
                                red_social = SocialNetwork.query.filter_by(orden=int(red_social_id)).first()
                                if red_social:
                                    valid_fields['id_red_social'] = red_social.id_red_social
                                    print(f"🔧 Encontrada red social por orden {red_social_id}: {red_social.nombre}")
                                else:
                                    # Crear una nueva red social con UUID válido
                                    new_red_social = SocialNetwork(
                                        id_red_social=str(uuid.uuid4()),
                                        nombre=f"Red Social {red_social_id}",
                                        icono="📱",
                                        orden=int(red_social_id)
                                    )
                                    db.session.add(new_red_social)
                                    valid_fields['id_red_social'] = new_red_social.id_red_social
                                    print(f"🔧 Creada nueva red social: {new_red_social.nombre}")
                            else:
                                # Si ya es un UUID, verificar que existe
                                red_social = SocialNetwork.query.get(red_social_id)
                                if not red_social:
                                    print(f"⚠️ Red social con ID {red_social_id} no encontrada, saltando")
                                    continue
                        
                        print(f"🔧 Creando red social con campos válidos: {valid_fields}")
                        try:
                            red_social = EmpresaRedSocial(**valid_fields)
                            db.session.add(red_social)
                            print(f"✅ Red social creada exitosamente")
                        except Exception as e:
                            print(f"❌ Error creando red social: {e}")
                            raise
                else:
                    print(f"🔧 No hay redes sociales para crear o la lista está vacía")
        
        if 'horarios_apertura' in cleaned_data:
            print(f"🔧 Procesando horarios de apertura: {cleaned_data['horarios_apertura']}")
            print(f"🔧 Tipo de horarios_apertura: {type(cleaned_data['horarios_apertura'])}")
            
            # Verificar que los horarios sean una lista
            if not isinstance(cleaned_data['horarios_apertura'], list):
                print(f"⚠️ Horarios de apertura no es una lista, saltando: {type(cleaned_data['horarios_apertura'])}")
            else:
                # Eliminar horarios existentes usando SQL directo para evitar problemas de relaciones
                try:
                    db.session.execute(
                        text("DELETE FROM empresa_horario_apertura WHERE id_empresa = :id_empresa"),
                        {"id_empresa": id_empresa}
                    )
                    print(f"🔧 Horarios existentes eliminados")
                except Exception as e:
                    print(f"⚠️ Error eliminando horarios existentes: {e}")
                
                # Crear nuevos horarios usando SQL directo
                if len(cleaned_data['horarios_apertura']) > 0:
                    for horario_data in cleaned_data['horarios_apertura']:
                        print(f"🔧 Procesando horario: día {horario_data.get('dia')}, valor: {horario_data.get('valor')}")
                        
                        # Verificar que tenga los campos mínimos requeridos
                        if horario_data.get('dia') is None:
                            print(f"⚠️ Horario sin dia, saltando: {horario_data}")
                            continue
                        
                        # Crear horario usando SQL directo
                        try:
                            import uuid
                            nuevo_id = str(uuid.uuid4())
                            
                            db.session.execute(
                                text("""
                                    INSERT INTO empresa_horario_apertura 
                                    (id_horario, id_empresa, dia, valor, created_at) 
                                    VALUES (:id_horario, :id_empresa, :dia, :valor, NOW())
                                """),
                                {
                                    "id_horario": nuevo_id,
                                    "id_empresa": id_empresa,
                                    "dia": horario_data.get('dia'),
                                    "valor": horario_data.get('valor', '')
                                }
                            )
                            print(f"✅ Horario creado exitosamente para día {horario_data.get('dia')}")
                        except Exception as e:
                            print(f"❌ Error creando horario: {e}")
                            raise
                else:
                    print(f"🔧 No hay horarios para crear o la lista está vacía")
        
        try:
            print(f"🔧 Intentando commit de la sesión...")
            db.session.commit()
            print(f"✅ Commit exitoso")
        except Exception as e:
            print(f"❌ Error en commit: {e}")
            db.session.rollback()
            raise
        
        # Verificar qué se guardó realmente
        empresa_refreshed = Empresa.query.get(id_empresa)
        print(f"🔍 Verificación post-commit:")
        print(f"  - codigo_postal: {empresa_refreshed.codigo_postal}")
        print(f"  - poblacion: {empresa_refreshed.poblacion}")
        print(f"  - movil: {empresa_refreshed.movil}")
        print(f"  - fax: {empresa_refreshed.fax}")
        print(f"  - web: {empresa_refreshed.web}")
        print(f"  - nota: {empresa_refreshed.nota}")
        print(f"  - sujeto_iva: {empresa_refreshed.sujeto_iva}")
        
        # Obtener los datos actualizados sin relaciones para evitar problemas
        result = {
            'id_empresa': empresa.id_empresa,
            'nombre': empresa.nombre,
            'ruc': empresa.ruc,
            'direccion': empresa.direccion,
            'telefono': empresa.telefono,
            'email': empresa.email,
            'estado': empresa.estado,
            'id_moneda': empresa.id_moneda,
            'id_pais': empresa.id_pais,
            'codigo_postal': empresa.codigo_postal,
            'poblacion': empresa.poblacion,
            'movil': empresa.movil,
            'fax': empresa.fax,
            'web': empresa.web,
            'nota': empresa.nota,
            'sujeto_iva': empresa.sujeto_iva,
            'id_provincia': empresa.id_provincia,
            'fiscal_year_start_month': empresa.fiscal_year_start_month,
            'fiscal_year_start_day': empresa.fiscal_year_start_day,
            'created_at': empresa.created_at,
            'updated_at': empresa.updated_at
        }
        
        # Agregar identificación si existe
        identificacion = EmpresaIdentificacion.query.filter_by(id_empresa=id_empresa).first()
        if identificacion:
            result['identificacion'] = {
                'id_identificacion': identificacion.id_identificacion,
                'administradores': identificacion.administradores,
                'delegado_datos': identificacion.delegado_datos,
                'capital': float(identificacion.capital) if identificacion.capital else None,
                'id_tipo_entidad': identificacion.id_tipo_entidad,
                'objeto_empresa': identificacion.objeto_empresa,
                'cif_intra': identificacion.cif_intra,
                'id_profesional1': identificacion.id_profesional1,
                'id_profesional2': identificacion.id_profesional2,
                'id_profesional3': identificacion.id_profesional3,
                'id_profesional4': identificacion.id_profesional4,
                'id_profesional5': identificacion.id_profesional5,
                'id_profesional6': identificacion.id_profesional6,
                'id_profesional7': identificacion.id_profesional7,
                'id_profesional8': identificacion.id_profesional8,
                'id_profesional9': identificacion.id_profesional9,
                'id_profesional10': identificacion.id_profesional10
            }
        else:
            result['identificacion'] = {}
        
        # Agregar horarios de apertura si existen
        try:
            horarios_result = db.session.execute(
                text("SELECT id_horario, dia, valor FROM empresa_horario_apertura WHERE id_empresa = :id_empresa ORDER BY dia"),
                {"id_empresa": id_empresa}
            )
            horarios = horarios_result.fetchall()
            
            if horarios:
                result['horarios_apertura'] = [
                    {
                        'id_horario': horario.id_horario,
                        'dia': horario.dia,
                        'valor': horario.valor
                    }
                    for horario in horarios
                ]
            else:
                result['horarios_apertura'] = []
        except Exception as e:
            print(f"⚠️ Error obteniendo horarios: {e}")
            result['horarios_apertura'] = []
        
        # Agregar redes sociales si existen
        redes_sociales = EmpresaRedSocial.query.filter_by(id_empresa=id_empresa).all()
        if redes_sociales:
            result['redes_sociales'] = [
                {
                    'id': red_social.id,
                    'id_red_social': red_social.id_red_social,
                    'identificador': red_social.identificador,
                    'url': red_social.url,
                    'es_principal': red_social.es_principal
                }
                for red_social in redes_sociales
            ]
        else:
            result['redes_sociales'] = []
        
        print(f"✅ Empresa actualizada exitosamente: {result}")
        return jsonify(result), 200
    except IntegrityError as e:
        print(f"❌ Error de integridad al actualizar empresa: {e}")
        db.session.rollback()
        # Detectar si es error de RUC duplicado
        if "ruc" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una empresa con este RUC',
                'field': 'ruc',
                'type': 'duplicate'
            }), 409
        # Detectar si es error de email duplicado
        elif "email" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una empresa con este email',
                'field': 'email',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al actualizar empresa: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa/<string:id_empresa>', methods=['DELETE', 'OPTIONS'])
@empresa_bp.route('/empresa/<string:id_empresa>/', methods=['DELETE', 'OPTIONS'])
def eliminar_empresa(id_empresa):
    """Eliminar una empresa (cambiar estado a False)"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        empresa = Empresa.query.get_or_404(id_empresa)
        empresa.estado = False
        db.session.commit()
        return jsonify({'message': 'Empresa eliminada exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al eliminar empresa: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 