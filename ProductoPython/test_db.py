from app import app
from models.producto import Producto

with app.app_context():
    print("Total productos:", Producto.query.count())
