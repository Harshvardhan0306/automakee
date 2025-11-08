
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AnalyticsData } from "@/hooks/useAdminAnalytics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AnalyticsChartProps {
  data: AnalyticsData[];
  isLoading?: boolean;
}

const AnalyticsChart = ({ data, isLoading = false }: AnalyticsChartProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="md:col-span-2 border-border/40">
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>
          Website traffic and engagement metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <div className="text-sm font-medium">{formatDate(label)}</div>
                          {payload.map((entry, index) => (
                            <div key={`item-${index}`} className="flex items-center gap-2 text-xs">
                              <div 
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span>{entry.name}: {entry.value}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="pageViews" 
                  name="Page Views"
                  stroke="#2563eb" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="uniqueVisitors" 
                  name="Unique Visitors"
                  stroke="#9333ea" 
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  name="Conversions"
                  stroke="#16a34a" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
