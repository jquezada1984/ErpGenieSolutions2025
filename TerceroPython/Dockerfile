# Dockerfile para Microservicio TerceroPython (Flask)
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    tzdata \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/data

# IMPORTANTE: este servicio lo estás pensando como 3004
EXPOSE 3004

ENV FLASK_ENV=production
ENV PYTHONPATH=/app
ENV PORT=3004

# Comando para iniciar el servidor Flask
CMD ["python", "app.py"]
