from marshmallow import Schema, fields

class TerceroSchema(Schema):
    id_tercero = fields.Int(dump_only=True)
    entity = fields.Int()
    ref_ext = fields.Str()
    ref_int = fields.Str()
    parent = fields.Int(allow_none=True)
    statut = fields.Int()
    status = fields.Int()
    code_client = fields.Str()
    code_fournisseur = fields.Str()
    code_compta = fields.Str()
    code_compta_fournisseur = fields.Str()
    ruc = fields.Str()
    fk_typent = fields.Int()
    fk_forme_juridique = fields.Int()
    siren = fields.Str()
    siret = fields.Str()
    ape = fields.Str()
    capital = fields.Decimal(as_string=True)
    fk_currency = fields.Int()
    nombre = fields.Str(required=True)
    direccion = fields.Str()
    zip = fields.Str()
    town = fields.Str()
    fk_departement = fields.Int()
    fk_pays = fields.Int()
    phone = fields.Str()
    fax = fields.Str()
    email = fields.Str()
    url = fields.Str()
    mode_reglement = fields.Int()
    cond_reglement = fields.Int()
    tva_intra = fields.Str()
    localtax1_assuj = fields.Bool()
    localtax2_assuj = fields.Bool()
    remise_client = fields.Decimal(as_string=True)
    price_level = fields.Int()
    outstanding_limit = fields.Decimal(as_string=True)
    barcode = fields.Str()
    fk_barcode_type = fields.Int()
    default_lang = fields.Str()
    logo = fields.Raw()
    canvas = fields.Str()
    import_key = fields.Str()
    es_prospecto = fields.Bool()
    es_cliente = fields.Bool()
    customer_rank = fields.Int()
    supplier_rank = fields.Int()
    create_uid = fields.Int(required=True)
    create_date = fields.DateTime(dump_only=True)
    write_uid = fields.Int(allow_none=True)
    write_date = fields.DateTime(allow_none=True) 