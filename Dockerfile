FROM python:3.11-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl git && \
    rm -rf /var/lib/apt/lists/*

COPY pyproject.toml README.md LICENSE ./
COPY src/ src/

RUN pip install --no-cache-dir -e "." && \
    pip install --no-cache-dir uvicorn[standard]

# Download swagger-ui-dist so /docs works without CDN (avoids upstream CSP blocks)
RUN mkdir -p /app/static/swagger-ui && \
    curl -sL "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js" \
         -o /app/static/swagger-ui/swagger-ui-bundle.js && \
    curl -sL "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" \
         -o /app/static/swagger-ui/swagger-ui.css

COPY configs/ configs/
COPY data/samples/ data/samples/

EXPOSE 8000

CMD ["affectlog", "serve", "--host", "0.0.0.0", "--port", "8000"]
