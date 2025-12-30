import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, Legend, Tooltip } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select"


const monthlyData = {
  Jan: [
    { week: "Week 1", visitors: 2100, members: 1800 },
    { week: "Week 2", visitors: 2200, members: 1900 },
    { week: "Week 3", visitors: 2050, members: 1750 },
    { week: "Week 4", visitors: 2150, members: 1850 },
  ],
  Feb: [
    { week: "Week 1", visitors: 2300, members: 1950 },
    { week: "Week 2", visitors: 2350, members: 2000 },
    { week: "Week 3", visitors: 2250, members: 1900 },
    { week: "Week 4", visitors: 2300, members: 1950 },
  ],
  Mar: [
    { week: "Week 1", visitors: 2200, members: 1875 },
    { week: "Week 2", visitors: 2150, members: 1825 },
    { week: "Week 3", visitors: 2225, members: 1875 },
    { week: "Week 4", visitors: 2225, members: 1900 },
  ],
  Apr: [
    { week: "Week 1", visitors: 2375, members: 2025 },
    { week: "Week 2", visitors: 2400, members: 2050 },
    { week: "Week 3", visitors: 2350, members: 2000 },
    { week: "Week 4", visitors: 2375, members: 2025 },
  ],
  May: [
    { week: "Week 1", visitors: 2550, members: 2150 },
    { week: "Week 2", visitors: 2600, members: 2200 },
    { week: "Week 3", visitors: 2525, members: 2125 },
    { week: "Week 4", visitors: 2525, members: 2150 },
  ],
  Jun: [
    { week: "Week 1", visitors: 2450, members: 2075 },
    { week: "Week 2", visitors: 2500, members: 2125 },
    { week: "Week 3", visitors: 2425, members: 2050 },
    { week: "Week 4", visitors: 2425, members: 2075 },
  ],
  Jul: [
    { week: "Week 1", visitors: 2625, members: 2225 },
    { week: "Week 2", visitors: 2675, members: 2275 },
    { week: "Week 3", visitors: 2600, members: 2200 },
    { week: "Week 4", visitors: 2600, members: 2225 },
  ],
  Aug: [
    { week: "Week 1", visitors: 2800, members: 2350 },
    { week: "Week 2", visitors: 2850, members: 2400 },
    { week: "Week 3", visitors: 2775, members: 2325 },
    { week: "Week 4", visitors: 2775, members: 2350 },
  ],
  Sep: [
    { week: "Week 1", visitors: 2700, members: 2275 },
    { week: "Week 2", visitors: 2750, members: 2325 },
    { week: "Week 3", visitors: 2675, members: 2250 },
    { week: "Week 4", visitors: 2675, members: 2275 },
  ],
  Oct: [
    { week: "Week 1", visitors: 2875, members: 2425 },
    { week: "Week 2", visitors: 2925, members: 2475 },
    { week: "Week 3", visitors: 2850, members: 2400 },
    { week: "Week 4", visitors: 2850, members: 2425 },
  ],
  Nov: [
    { week: "Week 1", visitors: 3025, members: 2550 },
    { week: "Week 2", visitors: 3075, members: 2600 },
    { week: "Week 3", visitors: 3000, members: 2525 },
    { week: "Week 4", visitors: 3000, members: 2550 },
  ],
  Dec: [
    { week: "Week 1", visitors: 2950, members: 2475 },
    { week: "Week 2", visitors: 3000, members: 2525 },
    { week: "Week 3", visitors: 2925, members: 2450 },
    { week: "Week 4", visitors: 2925, members: 2475 },
  ],
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(186, 70%, 50%)",
  },
  members: {
    label: "Members",
    color: "hsl(186, 70%, 34%)",
  },
}

function AttendanceTrendsChart() {
  const [selectedMonth, setSelectedMonth] = React.useState("Jan")
  const chartData = monthlyData[selectedMonth]

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Attendance Trends</h3>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-30">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(monthlyData).map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AreaChart
        width="100%"
        height={300}
        data={chartData}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 12 }}
        />
        <defs>
          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartConfig.visitors.color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={chartConfig.visitors.color} stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartConfig.members.color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={chartConfig.members.color} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="visitors"
          stroke={chartConfig.visitors.color}
          fillOpacity={1}
          fill="url(#colorVisitors)"
        />
        <Area
          type="monotone"
          dataKey="members"
          stroke={chartConfig.members.color}
          fillOpacity={1}
          fill="url(#colorMembers)"
        />
        <Legend />
        <Tooltip />
      </AreaChart>
    </div>
  )
}

const ChartTooltip = Tooltip

export { AttendanceTrendsChart, ChartTooltip }