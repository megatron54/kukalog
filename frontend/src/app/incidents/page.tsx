"use client";

import { useEffect, useState } from "react";
import { fetchIncidents, Incident } from "@/lib/api";
import StatusBadge, { PriorityBadge } from "@/components/StatusBadge";
import Link from "next/link";
import { Search, Filter, X } from "lucide-react";

const CATEGORIES = ["pantalla", "hardware", "seguridades", "comunicación", "accionamiento", "desincronismo", "ventilación", "alimentación", "software", "eléctrica"];
const CONTROLLERS = ["KRC2"];
const STATUSES = ["abierta", "en_progreso", "cerrada"];
const PRIORITIES = ["crítica", "alta", "media", "baja"];
const LINES = ["Línea 4E", "Línea 5B", "Línea 5C", "Línea 6G", "Línea 6W", "Línea 6X", "Línea 6Y", "Línea 7F3", "Línea 7K", "Línea 7L", "Línea 7X", "Línea 8A", "Línea 8J", "Línea 8N", "Línea 8XY", "Línea 9A", "Línea 9XY"];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const loadIncidents = () => {
    setLoading(true);
    const params: Record<string, string> = { ...filters };
    if (search) params.search = search;
    fetchIncidents(params).then((data) => {
      setIncidents(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadIncidents();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadIncidents();
  };

  const setFilter = (key: string, value: string) => {
    if (value) {
      setFilters((prev) => ({ ...prev, [key]: value }));
    } else {
      setFilters((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearch("");
  };

  const activeFilterCount = Object.keys(filters).length + (search ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Incidencias</h1>
          <p className="text-slate-500 mt-1">{incidents.length} registros encontrados</p>
        </div>
        <Link
          href="/incidents/new"
          className="text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:opacity-90"
          style={{ backgroundColor: "#FF6600" }}
        >
          + Nueva Incidencia
        </Link>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por error, robot, descripción, celda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              showFilters
                ? "bg-slate-900 text-white border-slate-900"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="text-white text-xs w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: "#FF6600" }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Limpiar
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <select
              value={filters.status || ""}
              onChange={(e) => setFilter("status", e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Estado</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filters.priority || ""}
              onChange={(e) => setFilter("priority", e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Prioridad</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={filters.category || ""}
              onChange={(e) => setFilter("category", e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Categoría</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.controller || ""}
              onChange={(e) => setFilter("controller", e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Controlador</option>
              {CONTROLLERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.line || ""}
              onChange={(e) => setFilter("line", e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Línea</option>
              {LINES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Error</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Robot</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Celda</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Prioridad</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Parada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(incident.created_at).toLocaleDateString("es-ES", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/incidents/${incident.id}`}
                        className="text-sm font-medium text-slate-800 hover:text-orange-600 transition-colors"
                      >
                        {incident.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded">
                        {incident.error_code}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{incident.robot_type}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{incident.cell}</td>
                    <td className="px-4 py-3"><PriorityBadge priority={incident.priority} /></td>
                    <td className="px-4 py-3"><StatusBadge status={incident.status} /></td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {incident.downtime_min ? `${incident.downtime_min} min` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
