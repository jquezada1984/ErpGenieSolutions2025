"""CRUD de diccionarios (sin DELETE físico; baja por activo=false)."""
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from utils.db import db
from models.catalogos_diccionario import (
    CondicionPagoCatalogo,
    FormaPagoCatalogo,
    FormatoPapelCatalogo,
)
from models.empresa import Moneda, TipoEntidadComercial
from schemas.catalogos_diccionario_schema import (
    CondicionPagoSchema,
    FormaPagoSchema,
    MonedaDiccionarioSchema,
    TipoEntidadLegalSchema,
    FormatoPapelSchema,
    ActivoPatchSchema,
)

catalogos_bp = Blueprint('catalogos_bp', __name__)

condicion_schema = CondicionPagoSchema()
condiciones_schema = CondicionPagoSchema(many=True)
forma_schema = FormaPagoSchema()
formas_schema = FormaPagoSchema(many=True)
moneda_schema = MonedaDiccionarioSchema()
monedas_schema = MonedaDiccionarioSchema(many=True)
tipo_entidad_schema = TipoEntidadLegalSchema()
tipos_entidad_schema = TipoEntidadLegalSchema(many=True)
formato_schema = FormatoPapelSchema()
formatos_schema = FormatoPapelSchema(many=True)
activo_schema = ActivoPatchSchema()


def _options():
    return '', 204


def _solo_activos():
    v = request.args.get('solo_activos', '').lower()
    return v in ('1', 'true', 'yes')


def _err(msg, status=400):
    return jsonify({'success': False, 'error': msg}), status


def _ok(data, status=200, message=None):
    body = {'success': True, 'data': data}
    if message:
        body['message'] = message
    return jsonify(body), status


# ---------- Condiciones de pago ----------

@catalogos_bp.route('/catalogos/condicion-pago', methods=['GET', 'OPTIONS'])
def listar_condiciones_pago():
    if request.method == 'OPTIONS':
        return _options()
    q = CondicionPagoCatalogo.query
    if _solo_activos():
        q = q.filter_by(activo=True)
    rows = q.order_by(CondicionPagoCatalogo.orden, CondicionPagoCatalogo.codigo).all()
    return _ok(condiciones_schema.dump(rows))


@catalogos_bp.route('/catalogos/condicion-pago/<string:id_>', methods=['GET', 'OPTIONS'])
def obtener_condicion_pago(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = CondicionPagoCatalogo.query.get_or_404(id_)
    return _ok(condicion_schema.dump(row))


@catalogos_bp.route('/catalogos/condicion-pago', methods=['POST', 'OPTIONS'])
def crear_condicion_pago():
    if request.method == 'OPTIONS':
        return _options()
    data = request.get_json() or {}
    errors = condicion_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row = CondicionPagoCatalogo(**condicion_schema.load(data))
    db.session.add(row)
    try:
        db.session.commit()
        db.session.refresh(row)
        return _ok(condicion_schema.dump(row), 201, 'Condición de pago creada')
    except IntegrityError:
        db.session.rollback()
        return _err('Código duplicado', 409)


@catalogos_bp.route('/catalogos/condicion-pago/<string:id_>', methods=['PUT', 'OPTIONS'])
def actualizar_condicion_pago(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = CondicionPagoCatalogo.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = condicion_schema.validate(data, partial=True)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    for k, v in condicion_schema.load(data, partial=True).items():
        setattr(row, k, v)
    try:
        db.session.commit()
        return _ok(condicion_schema.dump(row), message='Actualizado')
    except IntegrityError:
        db.session.rollback()
        return _err('Código duplicado', 409)


@catalogos_bp.route('/catalogos/condicion-pago/<string:id_>/activo', methods=['PATCH', 'OPTIONS'])
def patch_activo_condicion_pago(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = CondicionPagoCatalogo.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = activo_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row.activo = data['activo']
    db.session.commit()
    return _ok(condicion_schema.dump(row))


# ---------- Modos de pago (forma_pago_catalogo) ----------

@catalogos_bp.route('/catalogos/forma-pago', methods=['GET', 'OPTIONS'])
@catalogos_bp.route('/catalogos/modos-pago', methods=['GET', 'OPTIONS'])
def listar_formas_pago():
    if request.method == 'OPTIONS':
        return _options()
    q = FormaPagoCatalogo.query
    if _solo_activos():
        q = q.filter_by(activo=True)
    tipo = request.args.get('tipo_uso')
    if tipo:
        q = q.filter(FormaPagoCatalogo.tipo_uso == tipo)
    rows = q.order_by(FormaPagoCatalogo.orden, FormaPagoCatalogo.codigo).all()
    return _ok(formas_schema.dump(rows))


@catalogos_bp.route('/catalogos/forma-pago/<string:id_>', methods=['GET', 'OPTIONS'])
def obtener_forma_pago(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = FormaPagoCatalogo.query.get_or_404(id_)
    return _ok(forma_schema.dump(row))


@catalogos_bp.route('/catalogos/forma-pago', methods=['POST', 'OPTIONS'])
def crear_forma_pago():
    if request.method == 'OPTIONS':
        return _options()
    data = request.get_json() or {}
    errors = forma_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row = FormaPagoCatalogo(**forma_schema.load(data))
    db.session.add(row)
    try:
        db.session.commit()
        db.session.refresh(row)
        return _ok(forma_schema.dump(row), 201, 'Modo de pago creado')
    except IntegrityError:
        db.session.rollback()
        return _err('Código duplicado', 409)


@catalogos_bp.route('/catalogos/forma-pago/<string:id_>', methods=['PUT', 'OPTIONS'])
def actualizar_forma_pago(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = FormaPagoCatalogo.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = forma_schema.validate(data, partial=True)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    for k, v in forma_schema.load(data, partial=True).items():
        setattr(row, k, v)
    try:
        db.session.commit()
        return _ok(forma_schema.dump(row))
    except IntegrityError:
        db.session.rollback()
        return _err('Código duplicado', 409)


@catalogos_bp.route('/catalogos/forma-pago/<string:id_>/activo', methods=['PATCH', 'OPTIONS'])
def patch_activo_forma_pago(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = FormaPagoCatalogo.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = activo_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row.activo = data['activo']
    db.session.commit()
    return _ok(forma_schema.dump(row))


# ---------- Monedas ----------

@catalogos_bp.route('/catalogos/moneda', methods=['GET', 'OPTIONS'])
def listar_monedas():
    if request.method == 'OPTIONS':
        return _options()
    q = Moneda.query
    if _solo_activos():
        q = q.filter_by(activo=True)
    rows = q.order_by(Moneda.codigo).all()
    return _ok(monedas_schema.dump(rows))


@catalogos_bp.route('/catalogos/moneda/<string:id_>', methods=['GET', 'OPTIONS'])
def obtener_moneda(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = Moneda.query.get_or_404(id_)
    return _ok(moneda_schema.dump(row))


@catalogos_bp.route('/catalogos/moneda', methods=['POST', 'OPTIONS'])
def crear_moneda():
    if request.method == 'OPTIONS':
        return _options()
    data = request.get_json() or {}
    errors = moneda_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row = Moneda(**moneda_schema.load(data))
    db.session.add(row)
    try:
        db.session.commit()
        db.session.refresh(row)
        return _ok(moneda_schema.dump(row), 201)
    except IntegrityError:
        db.session.rollback()
        return _err('Código duplicado', 409)


@catalogos_bp.route('/catalogos/moneda/<string:id_>', methods=['PUT', 'OPTIONS'])
def actualizar_moneda(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = Moneda.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = moneda_schema.validate(data, partial=True)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    for k, v in moneda_schema.load(data, partial=True).items():
        setattr(row, k, v)
    try:
        db.session.commit()
        return _ok(moneda_schema.dump(row))
    except IntegrityError:
        db.session.rollback()
        return _err('Código duplicado', 409)


@catalogos_bp.route('/catalogos/moneda/<string:id_>/activo', methods=['PATCH', 'OPTIONS'])
def patch_activo_moneda(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = Moneda.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = activo_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row.activo = data['activo']
    db.session.commit()
    return _ok(moneda_schema.dump(row))


# ---------- Tipo entidad legal ----------

@catalogos_bp.route('/catalogos/tipo-entidad-legal', methods=['GET', 'OPTIONS'])
def listar_tipos_entidad():
    if request.method == 'OPTIONS':
        return _options()
    q = TipoEntidadComercial.query
    if _solo_activos():
        q = q.filter_by(activo=True)
    rows = q.order_by(TipoEntidadComercial.nombre).all()
    return _ok(tipos_entidad_schema.dump(rows))


@catalogos_bp.route('/catalogos/tipo-entidad-legal/<int:id_>', methods=['GET', 'OPTIONS'])
def obtener_tipo_entidad(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = TipoEntidadComercial.query.get_or_404(id_)
    return _ok(tipo_entidad_schema.dump(row))


@catalogos_bp.route('/catalogos/tipo-entidad-legal', methods=['POST', 'OPTIONS'])
def crear_tipo_entidad():
    if request.method == 'OPTIONS':
        return _options()
    data = request.get_json() or {}
    errors = tipo_entidad_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row = TipoEntidadComercial(**tipo_entidad_schema.load(data))
    db.session.add(row)
    try:
        db.session.commit()
        db.session.refresh(row)
        return _ok(tipo_entidad_schema.dump(row), 201)
    except IntegrityError:
        db.session.rollback()
        return _err('Nombre duplicado', 409)


@catalogos_bp.route('/catalogos/tipo-entidad-legal/<int:id_>', methods=['PUT', 'OPTIONS'])
def actualizar_tipo_entidad(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = TipoEntidadComercial.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = tipo_entidad_schema.validate(data, partial=True)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    for k, v in tipo_entidad_schema.load(data, partial=True).items():
        setattr(row, k, v)
    try:
        db.session.commit()
        return _ok(tipo_entidad_schema.dump(row))
    except IntegrityError:
        db.session.rollback()
        return _err('Nombre duplicado', 409)


@catalogos_bp.route('/catalogos/tipo-entidad-legal/<int:id_>/activo', methods=['PATCH', 'OPTIONS'])
def patch_activo_tipo_entidad(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = TipoEntidadComercial.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = activo_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row.activo = data['activo']
    db.session.commit()
    return _ok(tipo_entidad_schema.dump(row))


# ---------- Formatos de papel ----------

@catalogos_bp.route('/catalogos/formato-papel', methods=['GET', 'OPTIONS'])
def listar_formatos_papel():
    if request.method == 'OPTIONS':
        return _options()
    q = FormatoPapelCatalogo.query
    if _solo_activos():
        q = q.filter_by(activo=True)
    rows = q.order_by(FormatoPapelCatalogo.orden, FormatoPapelCatalogo.codigo).all()
    return _ok(formatos_schema.dump(rows))


@catalogos_bp.route('/catalogos/formato-papel/<string:id_>', methods=['GET', 'OPTIONS'])
def obtener_formato_papel(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = FormatoPapelCatalogo.query.get_or_404(id_)
    return _ok(formato_schema.dump(row))


@catalogos_bp.route('/catalogos/formato-papel', methods=['POST', 'OPTIONS'])
def crear_formato_papel():
    if request.method == 'OPTIONS':
        return _options()
    data = request.get_json() or {}
    errors = formato_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row = FormatoPapelCatalogo(**formato_schema.load(data))
    db.session.add(row)
    try:
        db.session.commit()
        db.session.refresh(row)
        return _ok(formato_schema.dump(row), 201)
    except IntegrityError:
        db.session.rollback()
        return _err('Código duplicado', 409)


@catalogos_bp.route('/catalogos/formato-papel/<string:id_>', methods=['PUT', 'OPTIONS'])
def actualizar_formato_papel(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = FormatoPapelCatalogo.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = formato_schema.validate(data, partial=True)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    for k, v in formato_schema.load(data, partial=True).items():
        setattr(row, k, v)
    try:
        db.session.commit()
        return _ok(formato_schema.dump(row))
    except IntegrityError:
        db.session.rollback()
        return _err('Código duplicado', 409)


@catalogos_bp.route('/catalogos/formato-papel/<string:id_>/activo', methods=['PATCH', 'OPTIONS'])
def patch_activo_formato_papel(id_):
    if request.method == 'OPTIONS':
        return _options()
    row = FormatoPapelCatalogo.query.get_or_404(id_)
    data = request.get_json() or {}
    errors = activo_schema.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    row.activo = data['activo']
    db.session.commit()
    return _ok(formato_schema.dump(row))
