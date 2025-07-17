from repositories.entidad_repository import EntidadRepository

class EntidadService:
    @staticmethod
    def crear_entidad(data):
        return EntidadRepository.create(data['nombre'])

    @staticmethod
    def actualizar_entidad(id, data):
        return EntidadRepository.update(id, data['nombre']) 