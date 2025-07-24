import React, { useState, useEffect } from 'react';
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
  const [horarios, setHorarios] = useState<HorarioApertura[]>(data);

  const diasSemana = [
    { dia: 1, nombre: 'Lunes' },
    { dia: 2, nombre: 'Martes' },
    { dia: 3, nombre: 'Miércoles' },
    { dia: 4, nombre: 'Jueves' },
    { dia: 5, nombre: 'Viernes' },
    { dia: 6, nombre: 'Sábado' },
    { dia: 7, nombre: 'Domingo' }
  ];

  useEffect(() => {
    // Inicializar horarios si no existen
    if (horarios.length === 0) {
      const horariosIniciales = diasSemana.map(dia => ({
        id_horario: `temp_${dia.dia}`,
        dia: dia.dia,
        valor: ''
      }));
      setHorarios(horariosIniciales);
    }
  }, []);

  // Sincronizar el estado interno cuando cambien los datos externos
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setHorarios(data);
      onChange(data);
    }
  }, [data, onChange]);

  const handleInputChange = (dia: number, value: string) => {
    setHorarios(prev => 
      prev.map(horario => 
        horario.dia === dia 
          ? { ...horario, valor }
          : horario
      )
    );
  };

  const getHorarioByDia = (dia: number) => {
    return horarios.find(h => h.dia === dia) || { id_horario: `temp_${dia}`, dia, valor: '' };
  };

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
                          type="text"
                          placeholder="Ej: 8:00-18:00 o Cerrado"
                          value={horario.valor || ''}
                          onChange={(e) => handleInputChange(dia.dia, e.target.value)}
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