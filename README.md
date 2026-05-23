# KukaLog - Gestión de Incidencias KUKA

Plataforma web interna para registrar, documentar y consultar incidencias técnicas de robots KUKA en planta de automoción.

## Ejecutar el proyecto

### Backend (puerto 8001)

```bash
cd backend
pip install -r requirements.txt
python seed.py          # Genera 50 incidencias mock
python main.py          # Arranca en http://localhost:8001
```

### Frontend (puerto 3000)

```bash
cd frontend
npm install
npm run dev             # Arranca en http://localhost:3000
```

Abre http://localhost:3000 en el navegador.

## Stack

- **Backend**: Python 3.12 + FastAPI + SQLite + SQLAlchemy
- **Frontend**: Next.js 16 + React + TypeScript + TailwindCSS + Recharts
- **Datos**: 50 incidencias mock realistas (robots KUKA, errores reales, soluciones técnicas)

## Funcionalidades

- Dashboard con métricas, gráficas y tabla de incidencias recientes
- Lista de incidencias con búsqueda full-text y filtros avanzados
- Página de detalle completa por incidencia
- Formulario de registro de nuevas incidencias
- Página de búsqueda rápida con sugerencias
