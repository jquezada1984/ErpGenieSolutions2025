from marshmallow import Schema, fields, validates, ValidationError, EXCLUDE


class CategoriaGastoCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    codigo = fields.Str(required=True)
    nombre = fields.Str(required=True)
    descripcion = fields.Str(allow_none=True)
    estado = fields.Bool(load_default=True)

    @validates('codigo')
    def codigo_ok(self, value):
        if not value or not str(value).strip():
            raise ValidationError('codigo es obligatorio')
        if len(str(value).strip()) > 20:
            raise ValidationError('codigo máximo 20 caracteres')

    @validates('nombre')
    def nombre_ok(self, value):
        if not value or not str(value).strip():
            raise ValidationError('nombre es obligatorio')
        if len(str(value).strip()) > 100:
            raise ValidationError('nombre máximo 100 caracteres')


class CategoriaGastoUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    codigo = fields.Str()
    nombre = fields.Str()
    descripcion = fields.Str(allow_none=True)
    estado = fields.Bool()

    @validates('codigo')
    def codigo_ok(self, value):
        if value is None:
            return
        if not str(value).strip():
            raise ValidationError('codigo no puede estar vacío')
        if len(str(value).strip()) > 20:
            raise ValidationError('codigo máximo 20 caracteres')

    @validates('nombre')
    def nombre_ok(self, value):
        if value is None:
            return
        if not str(value).strip():
            raise ValidationError('nombre no puede estar vacío')
        if len(str(value).strip()) > 100:
            raise ValidationError('nombre máximo 100 caracteres')


class CategoriaGastoOutSchema(Schema):
    id_categoria_gasto = fields.UUID(dump_only=True)
    id_empresa = fields.UUID()
    codigo = fields.Str()
    nombre = fields.Str()
    descripcion = fields.Str(allow_none=True)
    estado = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
