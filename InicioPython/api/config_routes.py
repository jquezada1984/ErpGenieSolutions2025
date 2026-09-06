"""Config por empresa / instancia vía SP (solo funciones nombradas)."""
from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest
from utils.db import db
from utils.empresa_context import get_company_id
from sqlalchemy import text
import json

config_bp = Blueprint('config_bp', __name__)


def _options():
    return '', 204


def _err(msg, status=400):
    return jsonify({'success': False, 'error': msg}), status


def _ok(data, status=200, message=None):
    body = {'success': True, 'data': data}
    if message:
        body['message'] = message
    return jsonify(body), status


def _user_id():
    return request.headers.get('X-User-Id') or None


def _scope():
    return str(request.headers.get('X-Scope-Acceso') or 'EMPRESA').upper()


def _json_param(val):
    if val is None:
        return None
    return json.dumps(val, ensure_ascii=False)


def _row_empresa(row):
    if not row:
        return None
    return {
        'id_empresa': str(row[0]),
        'paneles': row[1] if row[1] is not None else [],
        'alertas': row[2] if row[2] is not None else {},
        'emails': row[3] if row[3] is not None else {},
        'updated_at': row[4].isoformat() if row[4] else None,
    }


@config_bp.route('/config/empresa', methods=['GET', 'OPTIONS'])
def obtener_empresa_config():
    if request.method == 'OPTIONS':
        return _options()
    try:
        id_empresa = get_company_id(required=True)
    except BadRequest as e:
        return _err(str(e.description or e), 400)
    result = db.session.execute(
        text('SELECT * FROM sp_empresa_config_obtener(:p)'),
        {'p': id_empresa},
    ).fetchone()
    return _ok(_row_empresa(result) or {
        'id_empresa': id_empresa,
        'paneles': [],
        'alertas': {},
        'emails': {},
        'updated_at': None,
    })


@config_bp.route('/config/empresa', methods=['PUT', 'OPTIONS'])
def guardar_empresa_config():
    if request.method == 'OPTIONS':
        return _options()
    try:
        id_empresa = get_company_id(required=True)
    except BadRequest as e:
        return _err(str(e.description or e), 400)
    data = request.get_json() or {}
    result = db.session.execute(
        text(
            """
            SELECT * FROM sp_empresa_config_guardar(
              :id_empresa,
              CAST(:paneles AS jsonb),
              CAST(:alertas AS jsonb),
              CAST(:emails AS jsonb),
              CAST(:updated_by AS uuid)
            )
            """
        ),
        {
            'id_empresa': id_empresa,
            'paneles': _json_param(data.get('paneles')) if 'paneles' in data else None,
            'alertas': _json_param(data.get('alertas')) if 'alertas' in data else None,
            'emails': _json_param(data.get('emails')) if 'emails' in data else None,
            'updated_by': _user_id(),
        },
    ).fetchone()
    db.session.commit()
    return _ok(_row_empresa(result), message='Configuración guardada')


@config_bp.route('/config/empresa/paneles', methods=['PUT', 'OPTIONS'])
def guardar_paneles():
    if request.method == 'OPTIONS':
        return _options()
    try:
        id_empresa = get_company_id(required=True)
    except BadRequest as e:
        return _err(str(e.description or e), 400)
    data = request.get_json() or {}
    paneles = data.get('paneles')
    if not isinstance(paneles, list):
        return _err('paneles debe ser un array')
    result = db.session.execute(
        text(
            """
            SELECT * FROM sp_empresa_config_guardar(
              :id_empresa, CAST(:paneles AS jsonb), NULL, NULL, CAST(:updated_by AS uuid)
            )
            """
        ),
        {
            'id_empresa': id_empresa,
            'paneles': _json_param(paneles),
            'updated_by': _user_id(),
        },
    ).fetchone()
    db.session.commit()
    return _ok(_row_empresa(result), message='Paneles guardados')


@config_bp.route('/config/empresa/alertas', methods=['PUT', 'OPTIONS'])
def guardar_alertas():
    if request.method == 'OPTIONS':
        return _options()
    try:
        id_empresa = get_company_id(required=True)
    except BadRequest as e:
        return _err(str(e.description or e), 400)
    data = request.get_json() or {}
    alertas = data.get('alertas')
    if not isinstance(alertas, dict):
        return _err('alertas debe ser un objeto')
    result = db.session.execute(
        text(
            """
            SELECT * FROM sp_empresa_config_guardar(
              :id_empresa, NULL, CAST(:alertas AS jsonb), NULL, CAST(:updated_by AS uuid)
            )
            """
        ),
        {
            'id_empresa': id_empresa,
            'alertas': _json_param(alertas),
            'updated_by': _user_id(),
        },
    ).fetchone()
    db.session.commit()
    return _ok(_row_empresa(result), message='Alertas guardadas')


@config_bp.route('/config/empresa/emails', methods=['PUT', 'OPTIONS'])
def guardar_emails():
    if request.method == 'OPTIONS':
        return _options()
    try:
        id_empresa = get_company_id(required=True)
    except BadRequest as e:
        return _err(str(e.description or e), 400)
    data = request.get_json() or {}
    emails = data.get('emails')
    if not isinstance(emails, dict):
        return _err('emails debe ser un objeto')
    result = db.session.execute(
        text(
            """
            SELECT * FROM sp_empresa_config_guardar(
              :id_empresa, NULL, NULL, CAST(:emails AS jsonb), CAST(:updated_by AS uuid)
            )
            """
        ),
        {
            'id_empresa': id_empresa,
            'emails': _json_param(emails),
            'updated_by': _user_id(),
        },
    ).fetchone()
    db.session.commit()
    return _ok(_row_empresa(result), message='E-mails guardados')


@config_bp.route('/config/instancia/seguridad', methods=['GET', 'OPTIONS'])
def obtener_seguridad():
    if request.method == 'OPTIONS':
        return _options()
    row = db.session.execute(text('SELECT * FROM sp_instancia_config_obtener()')).fetchone()
    return _ok({
        'seguridad': row[0] if row else {},
        'updated_at': row[1].isoformat() if row and row[1] else None,
    })


@config_bp.route('/config/instancia/seguridad', methods=['PUT', 'OPTIONS'])
def guardar_seguridad():
    if request.method == 'OPTIONS':
        return _options()
    if _scope() != 'GLOBAL':
        return _err('Solo usuarios GLOBAL pueden modificar la seguridad de instancia', 403)
    data = request.get_json() or {}
    seguridad = data.get('seguridad')
    if not isinstance(seguridad, dict):
        return _err('seguridad debe ser un objeto')
    row = db.session.execute(
        text(
            """
            SELECT * FROM sp_instancia_config_guardar_seguridad(
              CAST(:seguridad AS jsonb), CAST(:updated_by AS uuid)
            )
            """
        ),
        {
            'seguridad': _json_param(seguridad),
            'updated_by': _user_id(),
        },
    ).fetchone()
    db.session.commit()
    return _ok({
        'seguridad': row[0] if row else {},
        'updated_at': row[1].isoformat() if row and row[1] else None,
    }, message='Seguridad de instancia guardada')
