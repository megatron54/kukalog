from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db, init_db
from schemas import IncidentCreate, IncidentUpdate, IncidentResponse
from crud import get_incidents, get_incident, create_incident, update_incident, get_stats
from seed import generate_mock_data

app = FastAPI(title="KukaLog API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/api/stats")
def stats(db: Session = Depends(get_db)):
    return get_stats(db)


@app.get("/api/incidents", response_model=list[IncidentResponse])
def list_incidents(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    controller: Optional[str] = None,
    line: Optional[str] = None,
    robot_type: Optional[str] = None,
    error_code: Optional[str] = None,
    operator: Optional[str] = None,
    engineer: Optional[str] = None,
    cell: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return get_incidents(
        db, skip=skip, limit=limit, search=search, status=status,
        priority=priority, category=category, controller=controller,
        line=line, robot_type=robot_type, error_code=error_code,
        operator=operator, engineer=engineer, cell=cell
    )


@app.get("/api/incidents/{incident_id}", response_model=IncidentResponse)
def read_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = get_incident(db, incident_id)
    if not incident:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Incidencia no encontrada")
    return incident


@app.post("/api/incidents", response_model=IncidentResponse)
def new_incident(incident: IncidentCreate, db: Session = Depends(get_db)):
    return create_incident(db, incident)


@app.put("/api/incidents/{incident_id}", response_model=IncidentResponse)
def edit_incident(incident_id: int, incident: IncidentUpdate, db: Session = Depends(get_db)):
    result = update_incident(db, incident_id, incident)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Incidencia no encontrada")
    return result


@app.post("/api/seed")
def seed_data():
    generate_mock_data(50)
    return {"message": "50 incidencias generadas correctamente"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
