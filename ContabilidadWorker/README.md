# ContabilidadWorker
#
# Consume RabbitMQ:
#   financiero.#  → procesar factura / pago
#   inventario.#  → procesar-ajuste-inventario (diario INV)
#
# Variables:
#   RABBITMQ_URL=amqp://erp:erp@localhost:5672/
#   CONTABILIDAD_PY_BASE_URL=http://localhost:5002
#   RABBITMQ_ROUTING_KEY=financiero.#
#   RABBITMQ_ROUTING_INVENTARIO=inventario.#
