interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  abierta: "bg-red-100 text-red-800 border-red-200",
  en_progreso: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cerrada: "bg-green-100 text-green-800 border-green-200",
};

const statusLabels: Record<string, string> = {
  abierta: "Abierta",
  en_progreso: "En Progreso",
  cerrada: "Cerrada",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    crítica: "bg-red-600 text-white",
    alta: "bg-orange-500 text-white",
    media: "bg-yellow-400 text-yellow-900",
    baja: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        styles[priority] || "bg-gray-100 text-gray-800"
      }`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
