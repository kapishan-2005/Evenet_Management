import { Users, CalendarDays, Clock, DollarSign } from 'lucide-react';
import { CheckCircle, UserPlus, Shield, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import TopBar from '../components/layout/TopBar';
import StatCard from '../components/ui/StatCard';
import ActivityItem from '../components/ui/ActivityItem';

const stats = [
  { icon: Users,        value: '14,208',   label: 'Total Users',             trend: '+12%', trendUp: true  },
  { icon: CalendarDays, value: '842',       label: 'Active Events',           trend: '+6%',  trendUp: true  },
  { icon: Clock,        value: '47',        label: 'Pending Approvals',       trend: '+22',  trendUp: false },
  { icon: DollarSign,   value: 'LKR 4.2M', label: 'Total Engagement Value',  trend: '+8.3%',trendUp: true  },
];

const chartData = [
  { month: 'JAN', approved: 30, rejected: 10 },
  { month: 'FEB', approved: 45, rejected: 15 },
  { month: 'MAR', approved: 38, rejected: 8  },
  { month: 'APR', approved: 60, rejected: 20 },
  { month: 'MAY', approved: 52, rejected: 12 },
  { month: 'JUN', approved: 70, rejected: 18 },
];

const categories = [
  { label: 'Music & Nightlife', percent: 42, color: 'bg-[#FFE500]'  },
  { label: 'Careers & Tech',    percent: 28, color: 'bg-yellow-600' },
  { label: 'Exhibitions',       percent: 30, color: 'bg-yellow-800' },
];

const districts = [
  { name: 'COLOMBO', percent: 52 },
  { name: 'KANDY',   percent: 34 },
  { name: 'GALLE',   percent: 41 },
  { name: 'JAFFNA',  percent: 29 },
];

const activities = [
  { icon: CalendarDays, iconBg: 'bg-blue-600',   title: 'New event submitted', subtitle: 'Breakout Festival - Pending Review',  time: '2 MINS AGO'   },
  { icon: UserPlus,     iconBg: 'bg-green-600',  title: 'User joined',         subtitle: 'New registration: Oliver Tew',        time: '16 MINS AGO'  },
  { icon: CheckCircle,  iconBg: 'bg-[#FFE500]',  title: 'Event approved',      subtitle: 'Jazz Night at Vihara Lake',           time: '1 HOUR AGO'   },
  { icon: Shield,       iconBg: 'bg-purple-600', title: 'Profile Updated',     subtitle: 'Admin updated user permissions',      time: '3 HOURS AGO'  },
  { icon: AlertTriangle,iconBg: 'bg-red-600',    title: 'High traffic alert',  subtitle: 'Manager accessed from Region IP',     time: '5 HOURS AGO'  },
];

export default function Reports() {
  return (
    <div>
      <TopBar subtitle="Internal Dashboard" title="System Analytics & Reports" />

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        {/* Bar Chart */}
        <div className="col-span-2 bg-[#141414] border border-[#222] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Event Submission Trends</h3>
            <div className="flex gap-2">
              <button className="text-xs bg-[#FFE500] text-black px-3 py-1 rounded-md font-medium">Monthly</button>
              <button className="text-xs text-gray-400 px-3 py-1 rounded-md hover:text-white">Quarterly</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={4}>
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#FFE500' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#666' }} />
              <Bar dataKey="approved" name="Approved Events"     fill="#FFE500" radius={[4,4,0,0]} />
              <Bar dataKey="rejected" name="Rejected Submissions" fill="#333"   radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Top Categories</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="w-28 h-28 rounded-full border-8 border-[#FFE500] flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">842</p>
                <p className="text-[10px] text-gray-500">LISTINGS</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {categories.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${c.color}`}></div>
                <span className="text-gray-400 text-xs flex-1">{c.label}</span>
                <span className="text-white text-xs font-medium">{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">

        {/* District Activity */}
        <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">District-wise Activity</h3>
          <div className="space-y-4">
            {districts.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{d.name}</span>
                  <span className="text-[#FFE500] font-medium">{d.percent}%</span>
                </div>
                <div className="w-full bg-[#222] rounded-full h-1.5">
                  <div
                    className="bg-[#FFE500] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Recent Activity Log</h3>
            <button className="text-[#FFE500] text-xs hover:underline">VIEW ALL</button>
          </div>
          <div className="space-y-4">
            {activities.map((a, i) => <ActivityItem key={i} {...a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}