#!/bin/bash

echo "🔧 Script de construcción y prueba para ERP Python Service"
echo "=================================================="

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [opción]"
    echo ""
    echo "Opciones:"
    echo "  psycopg3    - Construir con psycopg3 (recomendado)"
    echo "  psycopg2    - Construir con psycopg2-binary (fallback)"
    echo "  test        - Solo probar conexión"
    echo "  help        - Mostrar esta ayuda"
}

# Función para construir con psycopg3
build_psycopg3() {
    echo "🚀 Construyendo con psycopg3..."
    
    # Verificar que requirements.txt tenga psycopg3
    if grep -q "psycopg\[binary\]" requirements.txt; then
        echo "✅ requirements.txt ya configurado para psycopg3"
    else
        echo "⚠️  Actualizando requirements.txt para psycopg3..."
        cp requirements-psycopg2.txt requirements.txt
        sed -i 's/psycopg2-binary==2.9.9/psycopg[binary]==3.2.3/' requirements.txt
    fi
    
    echo "🐳 Construyendo imagen Docker..."
    docker build -t erp-python-service:psycopg3 .
    
    echo "🧪 Probando conexión..."
    docker run --rm erp-python-service:psycopg3 python test_psycopg_connection.py
}

# Función para construir con psycopg2
build_psycopg2() {
    echo "🚀 Construyendo con psycopg2-binary..."
    
    echo "⚠️  psycopg2-binary puede tener problemas con Python 3.13"
    echo "🔄 Usando Python 3.12 en el Dockerfile..."
    
    # Restaurar requirements.txt original
    cp requirements-psycopg2.txt requirements.txt
    
    echo "🐳 Construyendo imagen Docker..."
    docker build -t erp-python-service:psycopg2 .
    
    echo "🧪 Probando conexión..."
    docker run --rm erp-python-service:psycopg2 python test_psycopg_connection.py
}

# Función para solo probar
test_only() {
    echo "🧪 Solo probando conexión..."
    docker run --rm erp-python-service:latest python test_psycopg_connection.py
}

# Procesar argumentos
case "${1:-psycopg3}" in
    "psycopg3")
        build_psycopg3
        ;;
    "psycopg2")
        build_psycopg2
        ;;
    "test")
        test_only
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "❌ Opción no válida: $1"
        show_help
        exit 1
        ;;
esac

echo "✅ Proceso completado"



















