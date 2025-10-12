import React, { Component, ErrorInfo, ReactNode } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface SafeApexChartProps {
  options: ApexOptions;
  series: any;
  type: 'line' | 'area' | 'bar' | 'histogram' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap' | 'boxPlot' | 'candlestick' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'funnel' | 'gauge';
  height?: number | string;
  width?: number | string;
  className?: string;
  fallbackMessage?: string;
}

interface SafeApexChartState {
  hasError: boolean;
  errorMessage: string;
}

class SafeApexChart extends Component<SafeApexChartProps, SafeApexChartState> {
  constructor(props: SafeApexChartProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): SafeApexChartState {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error para debugging
    console.warn('ApexCharts Error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // UI de fallback en caso de error
      return (
        <div className="text-center p-4" style={{ height: this.props.height || 200 }}>
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {this.props.fallbackMessage || 'Error al cargar el gráfico'}
          </div>
        </div>
      );
    }

    // Validar datos antes de renderizar
    const { series, options } = this.props;
    
    // Validar que series sea un array válido
    if (!Array.isArray(series)) {
      return (
        <div className="text-center p-4" style={{ height: this.props.height || 200 }}>
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Datos no disponibles
          </div>
        </div>
      );
    }

    // Validar que los datos de las series sean válidos
    const hasValidData = series.every(serie => {
      if (typeof serie === 'object' && serie.data) {
        return Array.isArray(serie.data) && serie.data.length > 0;
      }
      return Array.isArray(serie) && serie.length > 0;
    });

    if (!hasValidData) {
      return (
        <div className="text-center p-4" style={{ height: this.props.height || 200 }}>
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Datos no disponibles
          </div>
        </div>
      );
    }

    try {
      return (
        <Chart
          options={options}
          series={series}
          type={this.props.type}
          height={this.props.height}
          width={this.props.width}
          className={this.props.className}
        />
      );
    } catch (error) {
      console.warn('Error rendering ApexChart:', error);
      return (
        <div className="text-center p-4" style={{ height: this.props.height || 200 }}>
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error al renderizar el gráfico
          </div>
        </div>
      );
    }
  }
}

export default SafeApexChart;



