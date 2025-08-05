from models.perfil import Perfil
from models.empresa import Empresa
from utils.db import db
from typing import List, Optional
import uuid

class PerfilService:
    """Servicio para manejar operaciones de perfiles"""
    
    def get_all_perfiles(self) -> List[Perfil]:
        """Obtener todos los perfiles con información de empresa"""
        try:
            perfiles = Perfil.query.join(Empresa).order_by(Perfil.nombre).all()
            return perfiles
        except Exception as e:
            print(f"Error obteniendo perfiles: {e}")
            raise e
    
    def get_perfil_by_id(self, perfil_id: str) -> Optional[Perfil]:
        """Obtener un perfil por ID"""
        try:
            perfil = Perfil.query.join(Empresa).filter(Perfil.id_perfil == perfil_id).first()
            return perfil
        except Exception as e:
            print(f"Error obteniendo perfil {perfil_id}: {e}")
            raise e
    
    def get_perfiles_por_empresa(self, empresa_id: str) -> List[Perfil]:
        """Obtener perfiles por empresa"""
        try:
            perfiles = Perfil.query.join(Empresa).filter(
                Perfil.id_empresa == empresa_id,
                Perfil.estado == True
            ).order_by(Perfil.nombre).all()
            return perfiles
        except Exception as e:
            print(f"Error obteniendo perfiles por empresa {empresa_id}: {e}")
            raise e
    
    def create_perfil(self, data: dict) -> Perfil:
        """Crear un nuevo perfil"""
        try:
            # Verificar que la empresa existe
            empresa = Empresa.query.filter(Empresa.id_empresa == data['id_empresa']).first()
            if not empresa:
                raise ValueError("La empresa especificada no existe")
            
            # Verificar que el nombre no esté duplicado en la misma empresa
            perfil_existente = Perfil.query.filter(
                Perfil.nombre == data['nombre'],
                Perfil.id_empresa == data['id_empresa']
            ).first()
            if perfil_existente:
                raise ValueError("Ya existe un perfil con ese nombre en esta empresa")
            
            nuevo_perfil = Perfil(
                nombre=data['nombre'],
                descripcion=data.get('descripcion'),
                id_empresa=data['id_empresa'],
                estado=data.get('estado', True)
            )
            
            db.session.add(nuevo_perfil)
            db.session.commit()
            db.session.refresh(nuevo_perfil)
            
            return nuevo_perfil
        except Exception as e:
            db.session.rollback()
            print(f"Error creando perfil: {e}")
            raise e
    
    def update_perfil(self, perfil_id: str, data: dict) -> Perfil:
        """Actualizar un perfil existente"""
        try:
            perfil = Perfil.query.filter(Perfil.id_perfil == perfil_id).first()
            if not perfil:
                raise ValueError("Perfil no encontrado")
            
            # Verificar que el nombre no esté duplicado en la misma empresa (si se está cambiando)
            if 'nombre' in data and data['nombre'] != perfil.nombre:
                perfil_existente = Perfil.query.filter(
                    Perfil.nombre == data['nombre'],
                    Perfil.id_empresa == perfil.id_empresa,
                    Perfil.id_perfil != perfil_id
                ).first()
                if perfil_existente:
                    raise ValueError("Ya existe un perfil con ese nombre en esta empresa")
            
            # Actualizar campos
            if 'nombre' in data:
                perfil.nombre = data['nombre']
            if 'descripcion' in data:
                perfil.descripcion = data['descripcion']
            if 'estado' in data:
                perfil.estado = data['estado']
            
            db.session.commit()
            db.session.refresh(perfil)
            
            return perfil
        except Exception as e:
            db.session.rollback()
            print(f"Error actualizando perfil {perfil_id}: {e}")
            raise e
    
    def delete_perfil(self, perfil_id: str) -> bool:
        """Eliminar un perfil"""
        try:
            perfil = Perfil.query.filter(Perfil.id_perfil == perfil_id).first()
            if not perfil:
                raise ValueError("Perfil no encontrado")
            
            db.session.delete(perfil)
            db.session.commit()
            
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error eliminando perfil {perfil_id}: {e}")
            raise e
    
    def cambiar_estado_perfil(self, perfil_id: str, nuevo_estado: bool) -> Perfil:
        """Cambiar el estado de un perfil"""
        try:
            perfil = Perfil.query.filter(Perfil.id_perfil == perfil_id).first()
            if not perfil:
                raise ValueError("Perfil no encontrado")
            
            perfil.estado = nuevo_estado
            db.session.commit()
            db.session.refresh(perfil)
            
            return perfil
        except Exception as e:
            db.session.rollback()
            print(f"Error cambiando estado de perfil {perfil_id}: {e}")
            raise e 