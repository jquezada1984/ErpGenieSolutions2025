from flask import Flask, jsonify
from flask_cors import CORS

from config.config import Config
from utils.db import db
from api.producto_routes import producto_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS
    CORS(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)

    # DB
    db.init_app(app)

    # Registrar modelos
    import models  # noqa: F401

    # Registrar rutas /api
    app.register_blueprint(producto_bp, url_prefix="/api")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", "3005"))
    app.run(host="0.0.0.0", port=port, debug=False)
