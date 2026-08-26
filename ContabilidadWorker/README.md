# ContabilidadWorker
#
# Consume RabbitMQ (financiero.factura.validada) y llama a ContabilidadPython
# POST /api/transferencia-contable/procesar-factura
#
# Variables:
#   RABBITMQ_URL=amqp://erp:erp@localhost:5672/
#   CONTABILIDAD_PY_BASE_URL=http://localhost:5002
