# KukaLog - Gestión de Incidencias KUKA KRC2

Plataforma web interna para registrar, documentar y consultar incidencias técnicas de robots KUKA KRC2 en planta de automoción.

## Inicio rápido (Docker)

```bash
git clone https://github.com/megatron54/kukalog.git
cd kukalog
docker compose up --build
```

- **Frontend**: http://localhost:3080
- **API**: http://localhost:8002
- **API docs**: http://localhost:8002/docs

La base de datos se genera automáticamente con datos de ejemplo al construir el contenedor.

## Ejecución manual (desarrollo)

### Backend (puerto 8002)

```bash
cd backend
pip install -r requirements.txt
python seed_public.py       # Genera incidencias de ejemplo
python main.py              # Arranca en http://localhost:8002
```

### Frontend (puerto 3000)

```bash
cd frontend
npm install
npm run dev                 # Arranca en http://localhost:3000
```

## Stack

- **Backend**: Python 3.12 + FastAPI + SQLite + SQLAlchemy
- **Frontend**: Next.js 16 + React + TypeScript + TailwindCSS + Recharts
- **Contenedores**: Docker Compose (2 servicios)

## Funcionalidades

- Dashboard con métricas, gráficas y tabla de incidencias recientes
- Lista de incidencias con búsqueda full-text y filtros avanzados
- Página de detalle completa por incidencia
- Formulario de registro de nuevas incidencias
- Página de búsqueda rápida con sugerencias
