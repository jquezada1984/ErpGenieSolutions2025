# Dockerfile para Microservicio ContabilidadPython (Flask)
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

EXPOSE 5002

ENV FLASK_ENV=production
ENV PYTHONPATH=/app
ENV PORT=5002

CMD ["python", "app.py"]
