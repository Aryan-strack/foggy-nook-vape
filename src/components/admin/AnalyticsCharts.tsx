"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const GOLD = "#D4AF37";
const PIE_COLORS = ["#D4AF37", "#F5D76E", "#9E9E9E", "#6B7280", "#4B5563", "#374151"];

export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
        <XAxis dataKey="date" stroke="#9E9E9E" fontSize={12} />
        <YAxis stroke="#9E9E9E" fontSize={12} />
        <Tooltip contentStyle={{ background: "#111111", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, color: "#fff" }} />
        <Line type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} dot={{ r: 3, fill: GOLD }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OrderStatusChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "#111111", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, color: "#fff" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopProductsChart({ data }: { data: { name: string; sold: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
        <XAxis type="number" stroke="#9E9E9E" fontSize={12} />
        <YAxis type="category" dataKey="name" stroke="#9E9E9E" fontSize={12} width={120} />
        <Tooltip contentStyle={{ background: "#111111", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, color: "#fff" }} />
        <Bar dataKey="sold" fill={GOLD} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
