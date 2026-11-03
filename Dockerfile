FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production \
    PYTHONUNBUFFERED=1 \
    PYTHON_EXECUTABLE=/opt/venv/bin/python

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY requirements.txt ./
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

COPY . .
RUN npm run build

EXPOSE 10000
CMD ["npm", "start"]
