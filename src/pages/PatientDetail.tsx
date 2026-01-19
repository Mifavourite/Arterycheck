import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Heart, 
  Activity, 
  Calendar,
  TrendingUp,
  FileText,
  Edit,
  Plus
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phone?: string;
  riskLevel: 'low' | 'moderate' | 'high';
  lastAssessment: string;
  nextAppointment?: string;
  medicalHistory?: string;
  medications?: string[];
  height?: number; // in cm
  weight?: number; // in kg
  bmi?: number;
  vitalSigns?: {
    systolicBP: number;
    diastolicBP: number;
    cholesterol: number;
    hdlCholesterol: number;
    date: string;
  }[];
}

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = () => {
    const storedPatients = localStorage.getItem('patients');
    const storedAssessments = localStorage.getItem('assessments');
    
    if (storedPatients) {
      const patients = JSON.parse(storedPatients);
      const foundPatient = patients.find((p: Patient) => p.id === id);
      if (foundPatient) {
        setPatient(foundPatient);
      }
    }

    if (storedAssessments) {
      const allAssessments = JSON.parse(storedAssessments);
      // Filter assessments for this patient (if patientId is stored)
      setAssessments(allAssessments.slice(0, 5)); // Show recent 5
    }
  };

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Patient not found</p>
        <Link
          to="/patients"
          className="text-sky-600 hover:text-sky-700 font-semibold"
        >
          Back to Patients
        </Link>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Mock vital signs data for visualization
  const vitalSignsData = patient.vitalSigns || [
    { date: 'Jan', systolicBP: 120, cholesterol: 180 },
    { date: 'Feb', systolicBP: 125, cholesterol: 175 },
    { date: 'Mar', systolicBP: 130, cholesterol: 185 },
    { date: 'Apr', systolicBP: 128, cholesterol: 182 },
    { date: 'May', systolicBP: 122, cholesterol: 178 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/patients"
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{patient.name}</h1>
            <p className="text-gray-600">Patient Profile & Health Records</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
          <Edit className="w-5 h-5" />
          Edit Profile
        </button>
      </div>

      {/* Patient Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-2xl font-bold text-gray-800">{patient.age}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">BMI</p>
              {patient.bmi ? (
                <>
                  <p className="text-2xl font-bold text-gray-800">{patient.bmi}</p>
                  <p className="text-xs text-gray-500">
                    {patient.bmi < 18.5 ? 'Underweight' :
                     patient.bmi < 25 ? 'Normal' :
                     patient.bmi < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Not recorded</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Level</p>
              <p className={`text-xs font-semibold px-3 py-1 rounded-full border inline-block mt-1 ${getRiskColor(patient.riskLevel)}`}>
                {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Assessment</p>
              <p className="text-sm font-bold text-gray-800">{patient.lastAssessment}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Appointment</p>
              <p className="text-sm font-bold text-gray-800">{patient.nextAppointment || 'Not scheduled'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Health Trends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vital Signs Trend */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              Vital Signs Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={vitalSignsData}>
                <defs>
                  <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCholesterol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
                  dataKey="systolicBP" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  fill="url(#colorSystolic)"
                  name="Systolic BP (mmHg)"
                />
                <Area 
                  type="monotone" 
                  dataKey="cholesterol" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="url(#colorCholesterol)"
                  name="Cholesterol (mg/dL)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Assessment History */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Assessment History
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-semibold text-sm">
                <Plus className="w-4 h-4" />
                New Assessment
              </button>
            </div>
            {assessments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No assessments recorded</p>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{assessment.date}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        assessment.riskLevel === 'low' ? 'bg-green-100 text-green-800 border-green-300' :
                        assessment.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        'bg-red-100 text-red-800 border-red-300'
                      }`}>
                        {assessment.riskLevel}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{assessment.riskScore}%</div>
                    <div className="text-sm text-gray-600 mt-2">
                      Risk Score: {assessment.riskScore}% | 
                      Age: {assessment.data?.age || 'N/A'} | 
                      BP: {assessment.data?.systolicBP || 'N/A'}/{assessment.data?.diastolicBP || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Patient Details */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{patient.email}</p>
              </div>
              {patient.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-800">{patient.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Medical History</h2>
            {patient.medicalHistory ? (
              <p className="text-gray-700">{patient.medicalHistory}</p>
            ) : (
              <p className="text-gray-500 text-sm">No medical history recorded</p>
            )}
          </div>

          {/* Current Medications */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Current Medications</h2>
            {patient.medications && patient.medications.length > 0 ? (
              <ul className="space-y-2">
                {patient.medications.map((med, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                    {med}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No medications recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
