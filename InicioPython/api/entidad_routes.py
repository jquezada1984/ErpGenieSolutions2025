from flask import Blueprint, request, jsonify
from models.empresa import Pais, Moneda, Provincia, TipoEntidadComercial, SocialNetwork
from schemas.empresa_schema import PaisSchema, MonedaSchema, ProvinciaSchema, TipoEntidadComercialSchema, SocialNetworkSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

entidad_bp = Blueprint('entidad_bp', __name__)

# Esquemas
pais_schema = PaisSchema()
moneda_schema = MonedaSchema()
provincia_schema = ProvinciaSchema()
tipo_entidad_schema = TipoEntidadComercialSchema()
social_network_schema = SocialNetworkSchema()

# Rutas para Países
@entidad_bp.route('/pais', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/pais/', methods=['GET', 'OPTIONS'])
def obtener_paises():
    """Obtener todos los países"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        paises = Pais.query.all()
        return jsonify(pais_schema.dump(paises, many=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/pais/<string:id_pais>', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/pais/<string:id_pais>/', methods=['GET', 'OPTIONS'])
def obtener_pais(id_pais):
    """Obtener un país específico"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        pais = Pais.query.get_or_404(id_pais)
        return jsonify(pais_schema.dump(pais)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/pais', methods=['POST', 'OPTIONS'])
@entidad_bp.route('/pais/', methods=['POST', 'OPTIONS'])
def crear_pais():
    """Crear un nuevo país"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = pais_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        pais = Pais(**data)
        db.session.add(pais)
        db.session.commit()
        
        return jsonify(pais_schema.dump(pais)), 201
    except IntegrityError as e:
        db.session.rollback()
        if "nombre" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({'error': 'Ya existe un país con este nombre'}), 409
        elif "codigo_iso" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({'error': 'Ya existe un país con este código ISO'}), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rutas para Monedas
@entidad_bp.route('/moneda', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/moneda/', methods=['GET', 'OPTIONS'])
def obtener_monedas():
    """Obtener todas las monedas"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        monedas = Moneda.query.all()
        return jsonify(moneda_schema.dump(monedas, many=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/moneda/<string:id_moneda>', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/moneda/<string:id_moneda>/', methods=['GET', 'OPTIONS'])
def obtener_moneda(id_moneda):
    """Obtener una moneda específica"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        moneda = Moneda.query.get_or_404(id_moneda)
        return jsonify(moneda_schema.dump(moneda)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/moneda', methods=['POST', 'OPTIONS'])
@entidad_bp.route('/moneda/', methods=['POST', 'OPTIONS'])
def crear_moneda():
    """Crear una nueva moneda"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = moneda_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        moneda = Moneda(**data)
        db.session.add(moneda)
        db.session.commit()
        
        return jsonify(moneda_schema.dump(moneda)), 201
    except IntegrityError as e:
        db.session.rollback()
        if "codigo" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({'error': 'Ya existe una moneda con este código'}), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rutas para Provincias
@entidad_bp.route('/provincia', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/provincia/', methods=['GET', 'OPTIONS'])
def obtener_provincias():
    """Obtener todas las provincias"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        provincias = Provincia.query.all()
        return jsonify(provincia_schema.dump(provincias, many=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/provincia/<string:id_provincia>', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/provincia/<string:id_provincia>/', methods=['GET', 'OPTIONS'])
def obtener_provincia(id_provincia):
    """Obtener una provincia específica"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        provincia = Provincia.query.get_or_404(id_provincia)
        return jsonify(provincia_schema.dump(provincia)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/provincia', methods=['POST', 'OPTIONS'])
@entidad_bp.route('/provincia/', methods=['POST', 'OPTIONS'])
def crear_provincia():
    """Crear una nueva provincia"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = provincia_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        provincia = Provincia(**data)
        db.session.add(provincia)
        db.session.commit()
        
        return jsonify(provincia_schema.dump(provincia)), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rutas para Tipos de Entidad Comercial
@entidad_bp.route('/tipo-entidad', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/tipo-entidad/', methods=['GET', 'OPTIONS'])
def obtener_tipos_entidad():
    """Obtener todos los tipos de entidad comercial"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        tipos = TipoEntidadComercial.query.all()
        return jsonify(tipo_entidad_schema.dump(tipos, many=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/tipo-entidad/<int:id_tipo_entidad>', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/tipo-entidad/<int:id_tipo_entidad>/', methods=['GET', 'OPTIONS'])
def obtener_tipo_entidad(id_tipo_entidad):
    """Obtener un tipo de entidad comercial específico"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        tipo = TipoEntidadComercial.query.get_or_404(id_tipo_entidad)
        return jsonify(tipo_entidad_schema.dump(tipo)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/tipo-entidad', methods=['POST', 'OPTIONS'])
@entidad_bp.route('/tipo-entidad/', methods=['POST', 'OPTIONS'])
def crear_tipo_entidad():
    """Crear un nuevo tipo de entidad comercial"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = tipo_entidad_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        tipo = TipoEntidadComercial(**data)
        db.session.add(tipo)
        db.session.commit()
        
        return jsonify(tipo_entidad_schema.dump(tipo)), 201
    except IntegrityError as e:
        db.session.rollback()
        if "nombre" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({'error': 'Ya existe un tipo de entidad con este nombre'}), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rutas para Redes Sociales
@entidad_bp.route('/red-social', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/red-social/', methods=['GET', 'OPTIONS'])
def obtener_redes_sociales():
    """Obtener todas las redes sociales"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        redes = SocialNetwork.query.order_by(SocialNetwork.orden).all()
        return jsonify(social_network_schema.dump(redes, many=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/red-social/<string:id_red_social>', methods=['GET', 'OPTIONS'])
@entidad_bp.route('/red-social/<string:id_red_social>/', methods=['GET', 'OPTIONS'])
def obtener_red_social(id_red_social):
    """Obtener una red social específica"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        red = SocialNetwork.query.get_or_404(id_red_social)
        return jsonify(social_network_schema.dump(red)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entidad_bp.route('/red-social', methods=['POST', 'OPTIONS'])
@entidad_bp.route('/red-social/', methods=['POST', 'OPTIONS'])
def crear_red_social():
    """Crear una nueva red social"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = social_network_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        red = SocialNetwork(**data)
        db.session.add(red)
        db.session.commit()
        
        return jsonify(social_network_schema.dump(red)), 201
    except IntegrityError as e:
        db.session.rollback()
        if "nombre" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({'error': 'Ya existe una red social con este nombre'}), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 