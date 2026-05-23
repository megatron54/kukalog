interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "blue" | "orange" | "green" | "red" | "purple" | "yellow";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  orange: "bg-orange-50 text-orange-700 border border-orange-200",
  green: "bg-green-50 text-green-700 border border-green-200",
  red: "bg-red-50 text-red-700 border border-red-200",
  purple: "bg-purple-50 text-purple-700 border border-purple-200",
  yellow: "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

const iconColorMap = {
  blue: "bg-blue-100 text-blue-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
  yellow: "bg-yellow-100 text-yellow-600",
};

export default function StatsCard({ title, value, subtitle, icon, color = "blue" }: StatsCardProps) {
  return (
    <div className={`rounded-xl p-5 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${iconColorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
