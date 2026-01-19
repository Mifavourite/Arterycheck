import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  riskLevel: 'low' | 'moderate' | 'high';
  lastAssessment: string;
  nextAppointment?: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const stored = localStorage.getItem('patients');
    if (stored) {
      setPatients(JSON.parse(stored));
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'all' || patient.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const getRiskBadge = (riskLevel: string) => {
    const styles = {
      low: 'bg-green-100 text-green-800 border-green-300',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300',
    };
    return styles[riskLevel as keyof typeof styles] || styles.low;
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      case 'moderate':
        return <Clock className="w-4 h-4" />;
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Patient Management
          </h1>
          <p className="text-gray-600">Manage patient records and health profiles</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none transition"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none transition bg-white appearance-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patients Found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first patient</p>
          <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Patient
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-semibold text-gray-800">{patient.age} years</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Risk Level:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getRiskBadge(
                      patient.riskLevel
                    )}`}
                  >
                    {getRiskIcon(patient.riskLevel)}
                    {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Assessment:</span>
                  <span className="font-semibold text-gray-800">{patient.lastAssessment}</span>
                </div>

                {patient.nextAppointment && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Next Appointment:</span>
                    <span className="font-semibold text-gray-800">{patient.nextAppointment}</span>
                  </div>
                )}
              </div>

              <Link
                to={`/patients/${patient.id}`}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-medium text-gray-700"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {filteredPatients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-800">{filteredPatients.length}</p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow border border-gray-200 text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredPatients.filter(p => p.riskLevel === 'low').length}
            </p>
            <p className="text-sm text-gray-600">Low Risk</p>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow border border-gray-200 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {filteredPatients.filter(p => p.riskLevel === 'moderate').length}
            </p>
            <p className="text-sm text-gray-600">Moderate Risk</p>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow border border-gray-200 text-center">
            <p className="text-2xl font-bold text-red-600">
              {filteredPatients.filter(p => p.riskLevel === 'high').length}
            </p>
            <p className="text-sm text-gray-600">High Risk</p>
          </div>
        </div>
      )}
    </div>
  );
}
