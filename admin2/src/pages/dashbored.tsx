import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashbored } from "@/store/useDashbored";
import { Tooltip } from "recharts"; 
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect } from "react";

export default function Dashbored() {
  const { analytics, getDate } = useDashbored();

  useEffect(() => {
    getDate();
  }, [getDate]);

  if (!analytics) {
    return <p className="text-center py-10">Loading analytics...</p>;
  }

  const chartData = Object.entries(analytics).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: value as number,
  }));

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Dashboard Analytics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(analytics).map(([key, value]) => (
          <Card key={key} className="shadow-lg rounded-sm">
            <CardHeader>
              <CardTitle className="capitalize">{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg rounded-sm">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
