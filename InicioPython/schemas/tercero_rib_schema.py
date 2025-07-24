from marshmallow import Schema, fields

class TerceroRibSchema(Schema):
    id_rib = fields.Int(dump_only=True)
    fk_tercero = fields.Int(required=True)
    datec = fields.DateTime(dump_only=True)
    tms = fields.DateTime(dump_only=True)
    label = fields.Str()
    bank = fields.Str()
    code_banque = fields.Str()
    code_guichet = fields.Str()
    number = fields.Str()
    cle_rib = fields.Str()
    bic = fields.Str()
    iban_prefix = fields.Str()
    domiciliation = fields.Str() 