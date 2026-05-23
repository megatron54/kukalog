from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from database import Incident
from schemas import IncidentCreate, IncidentUpdate
from datetime import datetime


def get_incidents(db: Session, skip: int = 0, limit: int = 100,
                  search: str = None, status: str = None, priority: str = None,
                  category: str = None, controller: str = None, line: str = None,
                  robot_type: str = None, error_code: str = None,
                  operator: str = None, engineer: str = None, cell: str = None):
    query = db.query(Incident)

    if search:
        s = f"%{search}%"
        query = query.filter(
            (Incident.title.ilike(s)) |
            (Incident.description.ilike(s)) |
            (Incident.error_code.ilike(s)) |
            (Incident.solution.ilike(s)) |
            (Incident.symptoms.ilike(s)) |
            (Incident.robot_type.ilike(s)) |
            (Incident.cell.ilike(s))
        )
    if status:
        query = query.filter(Incident.status == status)
    if priority:
        query = query.filter(Incident.priority == priority)
    if category:
        query = query.filter(Incident.category == category)
    if controller:
        query = query.filter(Incident.controller == controller)
    if line:
        query = query.filter(Incident.line == line)
    if robot_type:
        query = query.filter(Incident.robot_type == robot_type)
    if error_code:
        query = query.filter(Incident.error_code.ilike(f"%{error_code}%"))
    if operator:
        query = query.filter(Incident.operator.ilike(f"%{operator}%"))
    if engineer:
        query = query.filter(Incident.engineer.ilike(f"%{engineer}%"))
    if cell:
        query = query.filter(Incident.cell.ilike(f"%{cell}%"))

    return query.order_by(desc(Incident.created_at)).offset(skip).limit(limit).all()


def get_incident(db: Session, incident_id: int):
    return db.query(Incident).filter(Incident.id == incident_id).first()


def create_incident(db: Session, incident: IncidentCreate):
    now = datetime.now()
    db_incident = Incident(
        **incident.model_dump(),
        created_at=now,
        updated_at=now
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident


def update_incident(db: Session, incident_id: int, incident: IncidentUpdate):
    db_incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not db_incident:
        return None
    for key, value in incident.model_dump().items():
        setattr(db_incident, key, value)
    db_incident.updated_at = datetime.now()
    db.commit()
    db.refresh(db_incident)
    return db_incident


def get_stats(db: Session):
    total = db.query(Incident).count()
    open_count = db.query(Incident).filter(Incident.status == "abierta").count()
    closed_count = db.query(Incident).filter(Incident.status == "cerrada").count()
    in_progress_count = db.query(Incident).filter(Incident.status == "en_progreso").count()

    avg_downtime = db.query(func.avg(Incident.downtime_min)).filter(
        Incident.downtime_min.isnot(None)
    ).scalar() or 0

    # Top errors
    top_errors = db.query(
        Incident.error_code, func.count(Incident.id).label("count")
    ).group_by(Incident.error_code).order_by(desc("count")).limit(5).all()

    # Top robots
    top_robots = db.query(
        Incident.robot_type, func.count(Incident.id).label("count")
    ).group_by(Incident.robot_type).order_by(desc("count")).limit(5).all()

    # By category
    by_category = db.query(
        Incident.category, func.count(Incident.id).label("count")
    ).group_by(Incident.category).all()

    # By priority
    by_priority = db.query(
        Incident.priority, func.count(Incident.id).label("count")
    ).group_by(Incident.priority).all()

    # By controller
    by_controller = db.query(
        Incident.controller, func.count(Incident.id).label("count")
    ).group_by(Incident.controller).all()

    # By week (last 8 weeks)
    incidents = db.query(Incident.created_at).all()
    from collections import defaultdict
    weeks = defaultdict(int)
    for (dt,) in incidents:
        if dt:
            week_key = dt.strftime("%Y-W%W")
            weeks[week_key] += 1
    by_week = [{"week": k, "count": v} for k, v in sorted(weeks.items())[-8:]]

    # Recent
    recent = db.query(Incident).order_by(desc(Incident.created_at)).limit(10).all()
    recent_list = [
        {"id": i.id, "title": i.title, "error_code": i.error_code,
         "robot_type": i.robot_type, "priority": i.priority, "status": i.status,
         "created_at": i.created_at.isoformat(), "downtime_min": i.downtime_min}
        for i in recent
    ]

    return {
        "total": total,
        "open": open_count,
        "closed": closed_count,
        "in_progress": in_progress_count,
        "avg_downtime": round(avg_downtime, 1),
        "top_errors": [{"error_code": e, "count": c} for e, c in top_errors],
        "top_robots": [{"robot_type": r, "count": c} for r, c in top_robots],
        "by_category": [{"category": c, "count": n} for c, n in by_category],
        "by_week": by_week,
        "by_priority": [{"priority": p, "count": n} for p, n in by_priority],
        "by_controller": [{"controller": c, "count": n} for c, n in by_controller],
        "recent": recent_list,
    }
