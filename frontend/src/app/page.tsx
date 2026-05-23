"use client";

import { useEffect, useState } from "react";
import { fetchStats, Stats } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import StatusBadge, { PriorityBadge } from "@/components/StatusBadge";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Wrench,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#003478", "#FF6600", "#059669", "#DC2626", "#7C3AED", "#D97706", "#0891B2", "#BE185D"];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then((data) => {
      setStats(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-lg">No se pudo conectar con el servidor.</p>
        <p className="text-slate-400 text-sm mt-2">Asegúrate de que el backend está corriendo en puerto 8002.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Vista general del estado de incidencias en planta</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Incidencias"
          value={stats.total}
          icon={<Activity className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title="Abiertas"
          value={stats.open}
          subtitle="Requieren atención"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
        />
        <StatsCard
          title="En Progreso"
          value={stats.in_progress}
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
        />
        <StatsCard
          title="Cerradas"
          value={stats.closed}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title="Tiempo Medio"
          value={`${stats.avg_downtime} min`}
          subtitle="Resolución"
          icon={<Wrench className="w-5 h-5" />}
          color="purple"
        />
        <StatsCard
          title="Errores Distintos"
          value={stats.top_errors.length}
          subtitle="Top 5 frecuentes"
          icon={<TrendingUp className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Actividad Semanal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.by_week}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#FF6600" radius={[4, 4, 0, 0]} name="Incidencias" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Por Categoría</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.by_category}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value }: any) => `${name} (${value})`}
                labelLine={true}
              >
                {stats.by_category.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Errors */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Errores Más Frecuentes</h3>
          <div className="space-y-3">
            {stats.top_errors.map((e, i) => (
              <div key={i} className="flex items-center justify-between">
                <code className="text-sm font-mono bg-red-50 text-red-700 px-2 py-1 rounded">
                  {e.error_code}
                </code>
                <span className="text-sm font-semibold text-slate-700">{e.count} veces</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Robots */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Robots con Más Fallos</h3>
          <div className="space-y-3">
            {stats.top_robots.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{r.robot_type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(r.count / stats.total) * 100 * 3}%`, backgroundColor: "#FF6600" }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{r.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Controller */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Por Controlador</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.by_controller} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="controller" tick={{ fontSize: 12 }} width={60} />
              <Tooltip />
              <Bar dataKey="count" fill="#003478" radius={[0, 4, 4, 0]} name="Incidencias" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Incidencias Recientes</h3>
            <Link
              href="/incidents"
              className="text-sm font-medium hover:underline"
              style={{ color: "#FF6600" }}
            >
              Ver todas →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Error</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Robot</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Prioridad</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Parada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recent.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(incident.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/incidents/${incident.id}`}
                      className="text-sm font-medium text-slate-800 hover:text-orange-600 transition-colors"
                    >
                      {incident.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                      {incident.error_code}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{incident.robot_type}</td>
                  <td className="px-6 py-4"><PriorityBadge priority={incident.priority} /></td>
                  <td className="px-6 py-4"><StatusBadge status={incident.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {incident.downtime_min ? `${incident.downtime_min} min` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
