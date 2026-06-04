"""Generate example data for KukaLog demonstration."""
import random
from datetime import datetime, timedelta
from database import SessionLocal, Incident, init_db

OPERATORS = [
    "Operator A", "Operator B", "Operator C", "Operator D",
    "Operator E", "Operator F", "Operator G", "Operator H"
]

ENGINEERS = [
    "Engineer 1", "Engineer 2", "Engineer 3",
    "Engineer 4", "Engineer 5", "Engineer 6"
]

SHIFTS = ["morning", "afternoon", "night"]

LINES = ["Line A1", "Line A2", "Line B1", "Line B2", "Line C1", "Line C2"]

# Example incidents for demonstration purposes
DEMO_INCIDENTS = [
    {
        "robot": "A1-R01",
        "controller": "KRC2",
        "cell": "Cell-A1-01",
        "line": "Line A1",
        "error_code": "KCP_BLACK",
        "category": "display",
        "title": "KCP Black Screen - Screensaver Active",
        "description": "Robot A1-R01 KCP display is completely black. Robot continues automatic cycle but cannot be operated manually. Screensaver is active.",
        "symptoms": "KCP without image, robot continues automatic cycle, does not respond to key presses.",
        "solution": "Power cycle the electrical cabinet. Disable screensaver in system configuration to prevent recurrence.",
        "downtime": 15,
        "priority": "high",
    },
    {
        "robot": "B2-R03",
        "controller": "KRC2",
        "cell": "Cell-B2-03",
        "line": "Line B2",
        "error_code": "KCP_BLACK",
        "category": "hardware",
        "title": "KCP Black Screen - PC Failure due to Connector Corrosion",
        "description": "Robot B2-R03 with black KCP screen. Corrosion detected on internal connectors of the cabinet PC, causing intermittent short circuit.",
        "symptoms": "KCP without image, visible green corrosion on internal cabinet connectors.",
        "solution": "Thorough cleaning of affected connectors. Replace PC if issue persists. Verify connector state.",
        "downtime": 45,
        "priority": "high",
    },
    {
        "robot": "C1-R02",
        "controller": "KRC2",
        "cell": "Cell-C1-02",
        "line": "Line C1",
        "error_code": "PC_NOK",
        "category": "hardware",
        "title": "PC NOK - KCP Frozen then Black, Emergency Stop",
        "description": "Robot C1-R02 shows failure sequence: KCP freezes, goes black, then triggers emergency stop. Capacitors visibly swollen.",
        "symptoms": "Sequence: frozen image, black screen, emergency stop. Swollen electrolytic capacitors on motherboard.",
        "solution": "Replace PC keeping original SSD. Check capacitor state before installing new PC.",
        "downtime": 90,
        "priority": "critical",
    },
    {
        "robot": "A2-R04",
        "controller": "KRC2",
        "cell": "Cell-A2-04",
        "line": "Line A2",
        "error_code": "ESC_CI_NOK",
        "category": "safety",
        "title": "Unknown Operation Mode - ESC-CI Card Failure",
        "description": "Robot A2-R04 shows '?' in operation mode. Key switch on KCP does not recognize correct position. Defective ESC-CI card prevents mode reading.",
        "symptoms": "'?' symbol in operation mode indicator, unable to select T1/T2/AUT/EXT.",
        "solution": "Replace ESC-CI card. Verify key switch operation after replacement. Reset safety chain.",
        "downtime": 60,
        "priority": "high",
    },
    {
        "robot": "B1-R01",
        "controller": "KRC2",
        "cell": "Cell-B1-01",
        "line": "Line B1",
        "error_code": "SERVOBUS_RED",
        "category": "communication",
        "title": "ServoBus Red - PC Fan Failure, Overheating",
        "description": "Robot B1-R01 shows intermittent ServoBus red. PC fan not working correctly causing overheating and communication bus drops.",
        "symptoms": "Intermittent ServoBus red, PC hot to touch, fan not spinning or spinning very slowly.",
        "solution": "Replace PC fan. Verify temperatures after replacement.",
        "downtime": 30,
        "priority": "high",
    },
    {
        "robot": "C2-R03",
        "controller": "KRC2",
        "cell": "Cell-C2-03",
        "line": "Line C2",
        "error_code": "KSD_NOK",
        "category": "drive",
        "title": "Bus Drop - KSD Axes 1 and 4 NOK",
        "description": "Robot C2-R03 shows ServoBus drop with loss of drives on axes 1 and 4. KSD modules do not respond correctly to diagnostics.",
        "symptoms": "ServoBus red, axes 1 and 4 without tension, drive error in controller LOG.",
        "solution": "Replace KSD for Axis 1 and Axis 4. Calibrate axes after replacement. Synchronize robot.",
        "downtime": 180,
        "priority": "critical",
    },
    {
        "robot": "A1-R03",
        "controller": "KRC2",
        "cell": "Cell-A1-03",
        "line": "Line A1",
        "error_code": "INTERBUS_FAIL",
        "category": "communication",
        "title": "Interbus Communication Loss - Fiber Optic Damage",
        "description": "Robot A1-R03 loses Interbus communication intermittently. Fiber optic cable shows physical damage near cabinet entry point.",
        "symptoms": "Intermittent Interbus failures, signal loss on specific bus segments.",
        "solution": "Replace damaged fiber optic cable. Verify signal levels on all Interbus segments after repair.",
        "downtime": 45,
        "priority": "high",
    },
    {
        "robot": "B2-R01",
        "controller": "KRC2",
        "cell": "Cell-B2-01",
        "line": "Line B2",
        "error_code": "MOTOR_TEMP",
        "category": "mechanical",
        "title": "Motor Overtemperature - Axis 2 Gearbox Wear",
        "description": "Robot B2-R01 triggers overtemperature alarm on axis 2 motor during high-load operations. Gearbox showing signs of excessive wear.",
        "symptoms": "Frequent overtemperature warnings on axis 2, increased motor current draw, audible noise from gearbox.",
        "solution": "Schedule gearbox replacement. Reduce cycle speed on affected axis as temporary measure. Monitor temperature trend.",
        "downtime": 240,
        "priority": "critical",
    },
]


def seed_database():
    """Populate the database with example incidents."""
    init_db()
    db = SessionLocal()

    try:
        # Generate 50 incidents based on templates
        base_date = datetime(2026, 1, 1)
        
        for i in range(50):
            template = random.choice(DEMO_INCIDENTS)
            incident_date = base_date + timedelta(days=random.randint(0, 150), hours=random.randint(0, 23))
            
            incident = Incident(
                robot=template["robot"],
                controller=template["controller"],
                cell=template["cell"],
                line=template["line"],
                error_code=template["error_code"],
                category=template["category"],
                title=template["title"],
                description=template["description"],
                symptoms=template["symptoms"],
                solution=template["solution"],
                downtime=template["downtime"] + random.randint(-5, 15),
                priority=template["priority"],
                operator=random.choice(OPERATORS),
                engineer=random.choice(ENGINEERS),
                shift=random.choice(SHIFTS),
                created_at=incident_date,
                resolved_at=incident_date + timedelta(minutes=template["downtime"] + random.randint(0, 30)),
            )
            db.add(incident)
        
        db.commit()
        print(f"Seeded 50 demo incidents successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
