from flask import Blueprint, request, jsonify
from models.empresa import Empresa, Pais, Moneda, Provincia, TipoEntidadComercial, SocialNetwork, EmpresaIdentificacion, EmpresaRedSocial, EmpresaHorarioApertura
from schemas.empresa_schema import EmpresaSchema, EmpresaCreateSchema, EmpresaUpdateSchema, PaisSchema, MonedaSchema, ProvinciaSchema, TipoEntidadComercialSchema, SocialNetworkSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

empresa_bp = Blueprint('empresa_bp', __name__)
empresa_schema = EmpresaSchema()
empresa_create_schema = EmpresaCreateSchema()
empresa_update_schema = EmpresaUpdateSchema()

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
        
        # Validar y deserializar
        errors = empresa_update_schema.validate(data, partial=True)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            # Filtrar solo los campos válidos para la empresa principal
            valid_empresa_fields = {}
            for key, value in data.items():
                if key in ['nombre', 'ruc', 'direccion', 'telefono', 'email', 'estado', 
                          'id_moneda', 'id_pais', 'codigo_postal', 'poblacion', 'movil', 
                          'fax', 'web', 'nota', 'sujeto_iva', 'id_provincia', 
                          'fiscal_year_start_month', 'fiscal_year_start_day']:
                    # Convertir cadenas vacías a None para campos UUID
                    if key in ['id_moneda', 'id_pais', 'id_provincia'] and value == '':
                        valid_empresa_fields[key] = None
                    else:
                        valid_empresa_fields[key] = value
            
            # Si no hay campos válidos, devolver error
            if not valid_empresa_fields:
                return jsonify(errors), 400
            
            # Usar solo los campos válidos
            data = valid_empresa_fields
            print(f"✅ Campos válidos filtrados: {valid_empresa_fields}")
        
        # Actualizar campos de empresa
        print(f"🔧 Actualizando campos de empresa:")
        for key, value in data.items():
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
        if 'identificacion' in data:
            identificacion = EmpresaIdentificacion.query.filter_by(id_empresa=id_empresa).first()
            if identificacion:
                for key, value in data['identificacion'].items():
                    if hasattr(identificacion, key):
                        setattr(identificacion, key, value)
            else:
                identificacion_data = data['identificacion']
                identificacion_data['id_empresa'] = id_empresa
                identificacion = EmpresaIdentificacion(**identificacion_data)
                db.session.add(identificacion)
        
        # Actualizar redes sociales si se proporcionan
        if 'redes_sociales' in data:
            # Eliminar redes sociales existentes
            EmpresaRedSocial.query.filter_by(id_empresa=id_empresa).delete()
            
            # Crear nuevas redes sociales
            if isinstance(data['redes_sociales'], list):
                for red_social_data in data['redes_sociales']:
                    red_social_data['id_empresa'] = id_empresa
                    red_social = EmpresaRedSocial(**red_social_data)
                    db.session.add(red_social)
        
        # Actualizar horarios de apertura si se proporcionan
        if 'horarios_apertura' in data:
            # Eliminar horarios existentes
            EmpresaHorarioApertura.query.filter_by(id_empresa=id_empresa).delete()
            
            # Crear nuevos horarios
            if isinstance(data['horarios_apertura'], list):
                for horario_data in data['horarios_apertura']:
                    horario_data['id_empresa'] = id_empresa
                    horario = EmpresaHorarioApertura(**horario_data)
                    db.session.add(horario)
        
        db.session.commit()
        
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
        
        result = empresa_schema.dump(empresa)
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