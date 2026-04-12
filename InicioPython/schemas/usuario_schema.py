from marshmallow import Schema, fields, pre_load, validate


class UsuarioSchema(Schema):
    # dump_only: no entra en load(); Nest manda id_usuario en el PUT → hay que quitarlo antes del load.
    @pre_load
    def _strip_non_loadable_keys(self, data, **kwargs):
        if not isinstance(data, dict):
            return data
        return {k: v for k, v in data.items() if k not in ('id_usuario', 'created_at', 'updated_at')}

    id_usuario = fields.Str(dump_only=True)
    id_empresa = fields.Str(required=True)
    id_perfil = fields.Str(required=True)
    username = fields.Str(required=True)
    password = fields.Str(load_only=True)
    password_hash = fields.Str(load_only=True, allow_none=True)
    nombre_completo = fields.Str(allow_none=True)
    email = fields.Str(allow_none=True)
    estado = fields.Bool(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    scope_acceso = fields.Str(
        allow_none=True,
        validate=validate.OneOf(['GLOBAL', 'EMPRESA'], error='scope_acceso debe ser GLOBAL o EMPRESA'),
    )
