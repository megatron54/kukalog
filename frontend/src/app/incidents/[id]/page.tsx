"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchIncident, Incident } from "@/lib/api";
import StatusBadge, { PriorityBadge } from "@/components/StatusBadge";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Calendar,
  Clock,
  User,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from "lucide-react";

export default function IncidentDetailPage() {
  const params = useParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchIncident(Number(params.id)).then((data) => {
        setIncident(data);
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!incident) {
    return <p className="text-center py-20 text-slate-500">Incidencia no encontrada.</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/incidents" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600">
        <ArrowLeft className="w-4 h-4" /> Volver a incidencias
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{incident.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={incident.status} />
            <PriorityBadge priority={incident.priority} />
            <code className="text-sm font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded">{incident.error_code}</code>
            <span className="text-sm text-slate-400">#{incident.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Descripción del Problema
            </h2>
            <p className="text-slate-700 leading-relaxed">{incident.description}</p>
            {incident.symptoms && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Síntomas observados:</p>
                <p className="text-sm text-yellow-700 mt-1">{incident.symptoms}</p>
              </div>
            )}
          </section>

          {incident.solution && (
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Solución Aplicada
              </h2>
              <p className="text-slate-700 leading-relaxed">{incident.solution}</p>
              {incident.result && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Resultado: {incident.result}</span>
                </div>
              )}
            </section>
          )}

          {incident.notes && (
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-slate-500" /> Notas Adicionales
              </h2>
              <p className="text-slate-700">{incident.notes}</p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Máquina</h3>
            <div className="space-y-3">
              <InfoRow icon={<Bot className="w-4 h-4" />} label="Robot" value={incident.robot_type} />
              <InfoRow icon={<Wrench className="w-4 h-4" />} label="Controlador" value={incident.controller} />
              <InfoRow icon={null} label="Célula" value={incident.cell} />
              <InfoRow icon={null} label="Línea" value={incident.line} />
              <InfoRow icon={null} label="Categoría" value={incident.category} />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Información General</h3>
            <div className="space-y-3">
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Fecha" value={new Date(incident.created_at).toLocaleString("es-ES")} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Operario" value={incident.operator} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Ingeniero" value={incident.engineer} />
              <InfoRow icon={null} label="Turno" value={incident.shift} />
              {incident.downtime_min && (
                <InfoRow icon={<Clock className="w-4 h-4" />} label="Tiempo parada" value={`${incident.downtime_min} minutos`} />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}
