from marshmallow import Schema, fields, validates, ValidationError


class BancoCreateSchema(Schema):
    nombre = fields.Str(required=True)
    codigo = fields.Str(allow_none=True)
    swift = fields.Str(allow_none=True)
    web = fields.Str(allow_none=True)
    estado = fields.Bool(load_default=True)


class BancoUpdateSchema(Schema):
    nombre = fields.Str()
    codigo = fields.Str(allow_none=True)
    swift = fields.Str(allow_none=True)
    web = fields.Str(allow_none=True)
    estado = fields.Bool()


class BancoOutSchema(Schema):
    id_banco = fields.Str()
    nombre = fields.Str()
    codigo = fields.Str()
    swift = fields.Str()
    web = fields.Str()
    estado = fields.Bool()
    created_by = fields.Str()
    updated_by = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
