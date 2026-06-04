# KukaLog

**Industrial robot incident logging system** — track stoppages, errors, and maintenance events for KUKA robot cells.

Web application for production floor operators and maintenance engineers to log, categorize, and analyze robot incidents in manufacturing environments.

## Features

- **Incident logging** — Quick entry forms for operators during stoppages
- **Categorization** — Error codes, severity levels, affected components
- **Timeline view** — Chronological incident history per robot cell
- **Analytics dashboard** — MTBF, MTTR, and downtime trends
- **Export** — CSV and PDF report generation
- **Multi-user** — Role-based access (operator, engineer, admin)

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Python, Flask |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |
| Charts | Chart.js |

## Getting Started

```bash
# Install dependencies
pip install -r requirements.txt

# Seed demo data
python seed.py

# Run the application
python app.py
```

The app starts at `http://localhost:5000`.

## Project Structure

```
├── app.py           # Flask application
├── seed.py          # Demo data generator
├── templates/       # HTML templates
├── static/          # CSS, JS, assets
├── requirements.txt
└── .gitignore
```

## License

MIT
