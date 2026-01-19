import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users, AlertTriangle } from 'lucide-react';

export default function Analytics() {
  const [patients, setPatients] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    const storedPatients = localStorage.getItem('patients');
    const storedAssessments = localStorage.getItem('assessments');
    
    if (storedPatients) setPatients(JSON.parse(storedPatients));
    if (storedAssessments) setAssessments(JSON.parse(storedAssessments));
  }, []);

  // Age distribution
  const ageDistribution = [
    { range: '18-30', count: patients.filter(p => p.age >= 18 && p.age <= 30).length },
    { range: '31-45', count: patients.filter(p => p.age >= 31 && p.age <= 45).length },
    { range: '46-60', count: patients.filter(p => p.age >= 46 && p.age <= 60).length },
    { range: '61-75', count: patients.filter(p => p.age >= 61 && p.age <= 75).length },
    { range: '76+', count: patients.filter(p => p.age >= 76).length },
  ];

  // Risk level distribution
  const riskDistribution = [
    { name: 'Low Risk', value: patients.filter(p => p.riskLevel === 'low').length, color: '#10b981' },
    { name: 'Moderate Risk', value: patients.filter(p => p.riskLevel === 'moderate').length, color: '#f59e0b' },
    { name: 'High Risk', value: patients.filter(p => p.riskLevel === 'high').length, color: '#ef4444' },
  ];

  // Monthly assessment trends
  const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    return {
      month: monthName,
      assessments: Math.floor(Math.random() * 20) + 5,
      highRisk: Math.floor(Math.random() * 5),
    };
  });

  // Average risk scores by age group
  const riskByAge = [
    { age: '18-30', avgRisk: 15, low: 12, high: 18 },
    { age: '31-45', avgRisk: 28, low: 22, high: 34 },
    { age: '46-60', avgRisk: 42, low: 35, high: 49 },
    { age: '61-75', avgRisk: 58, low: 50, high: 66 },
    { age: '76+', avgRisk: 72, low: 65, high: 79 },
  ];

  // Calculate BMI distribution from assessments
  const calculateBMI = (height: number, weight: number): number => {
    if (!height || !weight || height <= 0 || weight <= 0) return 0;
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const bmiDistribution = assessments.reduce((acc, assessment) => {
    if (assessment.data?.height && assessment.data?.weight) {
      const bmi = calculateBMI(assessment.data.height, assessment.data.weight);
      if (bmi < 18.5) acc.underweight++;
      else if (bmi < 25) acc.normal++;
      else if (bmi < 30) acc.overweight++;
      else acc.obese++;
    }
    return acc;
  }, { underweight: 0, normal: 0, overweight: 0, obese: 0 });

  const bmiChartData = [
    { name: 'Underweight', value: bmiDistribution.underweight, color: '#3b82f6' },
    { name: 'Normal', value: bmiDistribution.normal, color: '#10b981' },
    { name: 'Overweight', value: bmiDistribution.overweight, color: '#f59e0b' },
    { name: 'Obese', value: bmiDistribution.obese, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-600">Comprehensive data visualization and health analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{patients.length}</h3>
          <p className="text-gray-600 text-sm">Total Patients</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{assessments.length}</h3>
          <p className="text-gray-600 text-sm">Total Assessments</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {patients.filter(p => p.riskLevel === 'high').length}
          </h3>
          <p className="text-gray-600 text-sm">High Risk Cases</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {assessments.length > 0 
              ? Math.round(assessments.reduce((sum, a) => sum + a.riskScore, 0) / assessments.length)
              : 0}%
          </h3>
          <p className="text-gray-600 text-sm">Average Risk Score</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Patient Age Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Risk Level Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
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

      {/* BMI Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">BMI Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bmiChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {bmiChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">BMI Categories</h2>
          <div className="space-y-4">
            {bmiChartData.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-semibold text-gray-800">{category.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-800">{category.value}</span>
                  <span className="text-sm text-gray-500">patients</span>
                </div>
              </div>
            ))}
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <p className="text-sm text-gray-700">
                <strong>BMI Guidelines:</strong> Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Assessment Trends (6 Months)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyTrends}>
            <defs>
              <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="assessments" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              fill="url(#colorAssessments)"
              name="Total Assessments"
            />
            <Area 
              type="monotone" 
              dataKey="highRisk" 
              stroke="#ef4444" 
              strokeWidth={2}
              fill="url(#colorHighRisk)"
              name="High Risk Cases"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Risk by Age Group */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Average Risk Score by Age Group</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={riskByAge}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="age" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}
            />
            <Legend />
            <Bar dataKey="avgRisk" fill="#0ea5e9" name="Average Risk" radius={[8, 8, 0, 0]} />
            <Bar dataKey="low" fill="#10b981" name="Low Range" radius={[8, 8, 0, 0]} />
            <Bar dataKey="high" fill="#ef4444" name="High Range" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
