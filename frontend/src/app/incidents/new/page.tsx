"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIncident } from "@/lib/api";
import { CheckCircle2 } from "lucide-react";

const ROBOTS = [
  "6Y 110R1", "6Y 50R4", "8XY 110R3", "8J LH 50R1", "5B LH 95R1",
  "7K LH 95R1", "6X 270R4", "8XY 170R1", "9XY 240R2", "7F3 LH 40R2",
  "7X RH 120R4", "4E 15R2", "8A 90R4", "7XR 160R1", "9A RH 270R1"
];
const CONTROLLERS = ["KRC2"];
const CATEGORIES = ["pantalla", "hardware", "seguridades", "comunicación", "accionamiento", "desincronismo", "ventilación", "alimentación", "software", "eléctrica"];
const PRIORITIES = ["crítica", "alta", "media", "baja"];
const LINES = ["Línea 4E", "Línea 5B", "Línea 5C", "Línea 6G", "Línea 6W", "Línea 6X", "Línea 6Y", "Línea 7F3", "Línea 7K", "Línea 7L", "Línea 7X", "Línea 8A", "Línea 8J", "Línea 8N", "Línea 8XY", "Línea 9A", "Línea 9XY"];
const SHIFTS = ["mañana", "tarde", "noche"];

export default function NewIncidentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    operator: "",
    engineer: "",
    shift: "mañana",
    robot_type: ROBOTS[0],
    controller: CONTROLLERS[1],
    cell: "",
    line: LINES[0],
    error_code: "",
    category: CATEGORIES[0],
    priority: "media",
    status: "abierta",
    title: "",
    description: "",
    symptoms: "",
    solution: "",
    steps: "",
    downtime_min: 0,
    result: "",
    notes: "",
    images: "",
  });

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await createIncident({
      ...form,
      downtime_min: form.downtime_min || null,
      symptoms: form.symptoms || null,
      solution: form.solution || null,
      steps: form.steps || null,
      result: form.result || null,
      notes: form.notes || null,
      images: null,
    } as any);
    setSaved(true);
    setTimeout(() => router.push("/incidents"), 1500);
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Incidencia registrada</h2>
        <p className="text-slate-500 mt-2">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Nueva Incidencia</h1>
      <p className="text-slate-500 mb-8">Registra una nueva incidencia técnica en el sistema</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Información General">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Operario" value={form.operator} onChange={(v) => update("operator", v)} placeholder="Nombre del operario" required />
            <Input label="Ingeniero Responsable" value={form.engineer} onChange={(v) => update("engineer", v)} placeholder="Nombre del ingeniero" required />
            <Select label="Turno" value={form.shift} options={SHIFTS} onChange={(v) => update("shift", v)} />
          </div>
        </Section>

        <Section title="Máquina">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Tipo de Robot" value={form.robot_type} options={ROBOTS} onChange={(v) => update("robot_type", v)} />
            <Select label="Controlador" value={form.controller} options={CONTROLLERS} onChange={(v) => update("controller", v)} />
            <Input label="Célula" value={form.cell} onChange={(v) => update("cell", v)} placeholder="Ej: Celda-A01" required />
            <Select label="Línea de Producción" value={form.line} options={LINES} onChange={(v) => update("line", v)} />
          </div>
        </Section>

        <Section title="Incidencia">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Código de Error" value={form.error_code} onChange={(v) => update("error_code", v)} placeholder="Ej: KSS00404" required />
            <Select label="Categoría" value={form.category} options={CATEGORIES} onChange={(v) => update("category", v)} />
            <Select label="Prioridad" value={form.priority} options={PRIORITIES} onChange={(v) => update("priority", v)} />
            <Select label="Estado" value={form.status} options={["abierta", "en_progreso", "cerrada"]} onChange={(v) => update("status", v)} />
          </div>
          <Input label="Título" value={form.title} onChange={(v) => update("title", v)} placeholder="Descripción breve del problema" required className="mt-4" />
          <TextArea label="Descripción Detallada" value={form.description} onChange={(v) => update("description", v)} placeholder="Describe el problema con detalle..." required className="mt-4" />
          <TextArea label="Síntomas Observados" value={form.symptoms} onChange={(v) => update("symptoms", v)} placeholder="Qué se observa..." className="mt-4" />
        </Section>

        <Section title="Solución">
          <TextArea label="Solución Aplicada" value={form.solution} onChange={(v) => update("solution", v)} placeholder="Pasos realizados para resolver..." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tiempo de Parada (minutos)</label>
              <input
                type="number"
                min={0}
                value={form.downtime_min}
                onChange={(e) => update("downtime_min", parseInt(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
              />
            </div>
            <Select label="Resultado" value={form.result} options={["", "resuelto", "parcial", "pendiente"]} onChange={(v) => update("result", v)} />
          </div>
        </Section>

        <Section title="Notas">
          <TextArea label="Comentarios Adicionales" value={form.notes} onChange={(v) => update("notes", v)} placeholder="Recomendaciones, observaciones..." />
        </Section>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 transition-colors hover:opacity-90"
            style={{ backgroundColor: "#FF6600" }}
          >
            {saving ? "Guardando..." : "Registrar Incidencia"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, required, className }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, required, className }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-y"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
      >
        {options.map((o) => <option key={o} value={o}>{o || "— Seleccionar —"}</option>)}
      </select>
    </div>
  );
}
