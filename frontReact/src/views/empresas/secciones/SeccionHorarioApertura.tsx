import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Row, 
  Col, 
  FormGroup, 
  Label, 
  Input, 
  Table,
  Card,
  CardBody
} from 'reactstrap';

interface HorarioApertura {
  id_horario: string;
  dia: number;
  valor?: string;
}

interface SeccionHorarioAperturaProps {
  data: HorarioApertura[];
  onChange: (data: HorarioApertura[]) => void;
}

const SeccionHorarioApertura: React.FC<SeccionHorarioAperturaProps> = ({ data, onChange }) => {
  const [horarios, setHorarios] = useState<HorarioApertura[]>([]);

  const diasSemana = [
    { dia: 1, nombre: 'Lunes', nombreCorto: 'lunes' },
    { dia: 2, nombre: 'Martes', nombreCorto: 'martes' },
    { dia: 3, nombre: 'Miércoles', nombreCorto: 'miercoles' },
    { dia: 4, nombre: 'Jueves', nombreCorto: 'jueves' },
    { dia: 5, nombre: 'Viernes', nombreCorto: 'viernes' },
    { dia: 6, nombre: 'Sábado', nombreCorto: 'sabado' },
    { dia: 7, nombre: 'Domingo', nombreCorto: 'domingo' }
  ];

  // Inicializar horarios cuando se reciban datos
  const isInitializedRef = useRef(false);
  
  useEffect(() => {
    console.log('🕐 SeccionHorarioApertura - Datos recibidos:', data);
    
    if (data && Array.isArray(data) && data.length > 0) {
      console.log('🕐 SeccionHorarioApertura - Usando datos existentes:', data);
      setHorarios(data);
      isInitializedRef.current = true;
    } else if (!isInitializedRef.current) {
      console.log('🕐 SeccionHorarioApertura - Inicializando horarios vacíos');
      const horariosIniciales = diasSemana.map(dia => ({
        id_horario: `temp_${Date.now()}_${dia.dia}`,
        dia: dia.dia,
        valor: ''
      }));
      console.log('🕐 SeccionHorarioApertura - Horarios iniciales creados:', horariosIniciales);
      setHorarios(horariosIniciales);
      isInitializedRef.current = true;
    }
  }, [data]); // Removido onChange de las dependencias

  // Notificar cambios al componente padre cuando cambie el estado interno
  // Usar useRef para evitar bucles infinitos
  const prevHorariosRef = useRef<string>('');
  const onChangeRef = useRef(onChange);
  
  // Actualizar la referencia cuando onChange cambie
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  
  useEffect(() => {
    // Solo notificar si los horarios realmente han cambiado y ya se ha inicializado
    if (isInitializedRef.current) {
      const currentHorariosString = JSON.stringify(horarios);
      if (prevHorariosRef.current !== currentHorariosString) {
        console.log('🕐 SeccionHorarioApertura - Notificando cambios al padre:', horarios);
        onChangeRef.current(horarios);
        prevHorariosRef.current = currentHorariosString;
      }
    }
  }, [horarios]); // Removido onChange de las dependencias

  const handleInputChange = useCallback((dia: number, value: string) => {
    console.log('🕐 SeccionHorarioApertura - Cambiando día', dia, 'a valor:', value);
    
    const updatedHorarios = horarios.map(horario => 
      horario.dia === dia 
        ? { ...horario, valor: value }
        : horario
    );
    
    console.log('🕐 SeccionHorarioApertura - Horarios actualizados:', updatedHorarios);
    setHorarios(updatedHorarios);
  }, [horarios]);

  const getHorarioByDia = useCallback((dia: number) => {
    const horario = horarios.find(h => h.dia === dia);
    if (horario) {
      return horario;
    }
    
    // Si no existe, crear uno temporal
    const horarioTemporal = { 
      id_horario: `temp_${Date.now()}_${dia}`, 
      dia, 
      valor: '' 
    };
    console.log('🕐 SeccionHorarioApertura - Creando horario temporal para día', dia, ':', horarioTemporal);
    return horarioTemporal;
  }, [horarios]);

  return (
    <div className="seccion-horario-apertura">
      <Card>
        <CardBody>
          <h5 className="mb-4">
            <i className="fas fa-clock text-primary me-2"></i>
            Horario de Apertura
          </h5>

          <p className="text-muted mb-4">
            Teclea el horario normal de apertura de tu compañía.
          </p>

          <Table responsive className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>
                  <i className="fas fa-calendar me-1"></i>
                  Día
                </th>
                <th style={{ width: '70%' }}>
                  <i className="fas fa-clock me-1"></i>
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {diasSemana.map(dia => {
                const horario = getHorarioByDia(dia.dia);
                return (
                  <tr key={dia.dia}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">
                          <i className="fas fa-info-circle text-muted"></i>
                        </span>
                        <span>{dia.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <FormGroup className="mb-0">
                        <Input
                          id={`horario-${dia.nombreCorto}`}
                          name={`horario-${dia.nombreCorto}`}
                          type="text"
                          placeholder="Ej: 8:00-18:00 o Cerrado"
                          value={horario.valor || ''}
                          onChange={(e) => handleInputChange(dia.dia, e.target.value)}
                          className="form-control"
                        />
                      </FormGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <div className="mt-3">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Ejemplos de formato: "8:00-18:00", "9:00-17:00", "Cerrado", "24h"
            </small>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SeccionHorarioApertura; 