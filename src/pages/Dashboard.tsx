import { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Heart,
  Calendar,
  Award,
  ClipboardList
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

interface HealthMetric {
  date: string;
  value: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAssessments: 0,
    highRiskPatients: 0,
    upcomingAppointments: 0,
  });

  useEffect(() => {
    // Load data from localStorage
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    setStats({
      totalPatients: patients.length,
      activeAssessments: assessments.length,
      highRiskPatients: patients.filter((p: any) => p.riskLevel === 'high').length,
      upcomingAppointments: appointments.filter((a: any) => 
        new Date(a.date) >= new Date()
      ).length,
    });
  }, []);

  const healthTrendData: HealthMetric[] = Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), 'MMM dd'),
    value: Math.floor(Math.random() * 30) + 70,
  }));

  const riskDistribution = [
    { name: 'Low Risk', value: 65, color: '#10b981' },
    { name: 'Moderate Risk', value: 25, color: '#f59e0b' },
    { name: 'High Risk', value: 10, color: '#ef4444' },
  ];

  const recentActivities = [
    { id: 1, type: 'assessment', message: 'New risk assessment completed', time: '2 hours ago' },
    { id: 2, type: 'patient', message: 'Patient profile updated', time: '5 hours ago' },
    { id: 3, type: 'appointment', message: 'Appointment scheduled for tomorrow', time: '1 day ago' },
  ];

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    change, 
    color 
  }: { 
    icon: any; 
    title: string; 
    value: number | string; 
    change?: string; 
    color: string;
  }) => (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome to your digital hospital command center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Patients"
          value={stats.totalPatients}
          change="+12%"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={ClipboardList}
          title="Active Assessments"
          value={stats.activeAssessments}
          change="+8%"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={AlertTriangle}
          title="High Risk Cases"
          value={stats.highRiskPatients}
          color="from-red-500 to-red-600"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          change="+5%"
          color="from-teal-500 to-teal-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trends */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            Health Trends (7 Days)
          </h2>
          <div className="w-full" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            Risk Distribution
          </h2>
          <div className="w-full" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
