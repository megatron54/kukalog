"use client";

import { useState } from "react";
import { fetchIncidents, Incident } from "@/lib/api";
import StatusBadge, { PriorityBadge } from "@/components/StatusBadge";
import Link from "next/link";
import { Search, Zap } from "lucide-react";

const QUICK_SEARCHES = [
  "Green Goo", "KCP negro", "KSD", "KPS", "SSD", "baterías",
  "desincronismo", "watchdog", "UDMA", "ventilador", "IBS", "ServoBus",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = (q: string) => {
    setQuery(q);
    setLoading(true);
    setSearched(true);
    fetchIncidents({ search: q }).then((data) => {
      setResults(data);
      setLoading(false);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) doSearch(query.trim());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Buscar Incidencias</h1>
        <p className="text-slate-500 mt-2">Encuentra rápidamente información técnica sobre errores y soluciones</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código de error, robot, celda, descripción..."
          className="w-full pl-14 pr-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 shadow-sm"
          autoFocus
        />
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-slate-400 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Búsquedas rápidas:
        </span>
        {QUICK_SEARCHES.map((q) => (
          <button
            key={q}
            onClick={() => doSearch(q)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 rounded-full text-sm font-medium transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}

      {searched && !loading && (
        <div>
          <p className="text-sm text-slate-500 mb-4">{results.length} resultados encontrados para &quot;{query}&quot;</p>
          <div className="space-y-3">
            {results.map((incident) => (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="block bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-orange-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded">{incident.error_code}</code>
                      <PriorityBadge priority={incident.priority} />
                      <StatusBadge status={incident.status} />
                    </div>
                    <h3 className="font-semibold text-slate-800">{incident.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{incident.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{incident.robot_type}</span>
                      <span>{incident.controller}</span>
                      <span>{incident.cell}</span>
                      <span>{new Date(incident.created_at).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
