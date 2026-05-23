from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class IncidentBase(BaseModel):
    operator: str
    engineer: str
    shift: str
    robot_type: str
    controller: str
    cell: str
    line: str
    error_code: str
    category: str
    priority: str
    status: str
    title: str
    description: str
    symptoms: Optional[str] = None
    solution: Optional[str] = None
    steps: Optional[str] = None
    downtime_min: Optional[int] = None
    result: Optional[str] = None
    notes: Optional[str] = None
    images: Optional[str] = None


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(IncidentBase):
    pass


class IncidentResponse(IncidentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total: int
    open: int
    closed: int
    in_progress: int
    avg_downtime: float
    top_errors: List[dict]
    top_robots: List[dict]
    by_category: List[dict]
    by_week: List[dict]
    by_priority: List[dict]
    by_controller: List[dict]
    recent: List[dict]
