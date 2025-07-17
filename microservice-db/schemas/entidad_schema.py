from marshmallow import Schema, fields

class EntidadSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True) 