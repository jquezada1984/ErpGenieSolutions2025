from models.entidad import Entidad, db

class EntidadRepository:
    @staticmethod
    def create(nombre):
        entidad = Entidad(nombre=nombre)
        db.session.add(entidad)
        db.session.commit()
        return entidad

    @staticmethod
    def update(id, nombre):
        entidad = Entidad.query.get(id)
        if entidad:
            entidad.nombre = nombre
            db.session.commit()
        return entidad 