"""Diarios contables estándar por empresa (configuración contable)."""

DIARIOS_DEFECTO = [
    {
        'codigo': 'AC',
        'nombre': 'Diario de compras - compras y devoluciones',
        'tipo_diario': 'COMPRAS',
    },
    {
        'codigo': 'AN',
        'nombre': 'Tiene un nuevo diario',
        'tipo_diario': 'GANANCIAS_RETENIDAS',
    },
    {
        'codigo': 'BQ',
        'nombre': 'Diario financiero',
        'tipo_diario': 'BANCO',
    },
    {
        'codigo': 'ER',
        'nombre': 'Diario informe de gastos',
        'tipo_diario': 'GASTOS',
    },
    {
        'codigo': 'INV',
        'nombre': 'Diario de inventario',
        'tipo_diario': 'INVENTARIO',
    },
    {
        'codigo': 'OD',
        'nombre': 'Diario general',
        'tipo_diario': 'OPERACIONES_VARIAS',
    },
    {
        'codigo': 'VT',
        'nombre': 'Diario de ventas - ventas y devoluciones',
        'tipo_diario': 'VENTAS',
    },
]
