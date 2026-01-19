import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Calculator, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AssessmentData {
  age: number;
  systolicBP: number;
  diastolicBP: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol?: number;
  smoking: boolean;
  diabetes: boolean;
  familyHistory: boolean;
  exercise: 'none' | 'light' | 'moderate' | 'intense';
}

interface AssessmentResult {
  id: string;
  date: string;
  data: AssessmentData;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

export default function Assessments() {
  const [formData, setFormData] = useState<AssessmentData>({
    age: 0,
    systolicBP: 0,
    diastolicBP: 0,
    totalCholesterol: 0,
    hdlCholesterol: 0,
    smoking: false,
    diabetes: false,
    familyHistory: false,
    exercise: 'none',
  });
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem('assessments');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const calculateASCVD = (data: AssessmentData): number => {
    // Simplified ASCVD-like calculation
    let score = 0;
    
    // Age factor
    if (data.age >= 65) score += 8;
    else if (data.age >= 55) score += 6;
    else if (data.age >= 45) score += 4;
    else if (data.age >= 35) score += 2;
    
    // Blood Pressure
    if (data.systolicBP >= 160) score += 7;
    else if (data.systolicBP >= 140) score += 5;
    else if (data.systolicBP >= 130) score += 3;
    else if (data.systolicBP >= 120) score += 1;
    
    // Cholesterol
    const ratio = data.totalCholesterol / (data.hdlCholesterol || 1);
    if (ratio >= 6) score += 6;
    else if (ratio >= 5) score += 4;
    else if (ratio >= 4) score += 2;
    
    // Risk factors
    if (data.smoking) score += 4;
    if (data.diabetes) score += 5;
    if (data.familyHistory) score += 2;
    
    // Exercise (negative factor)
    if (data.exercise === 'intense') score -= 2;
    else if (data.exercise === 'moderate') score -= 1;
    
    return Math.max(0, Math.min(100, score));
  };

  const getRiskLevel = (score: number): 'low' | 'moderate' | 'high' => {
    if (score < 20) return 'low';
    if (score < 50) return 'moderate';
    return 'high';
  };

  const getRecommendations = (data: AssessmentData, riskLevel: string): string[] => {
    const recommendations: string[] = [];
    
    if (data.systolicBP >= 130) {
      recommendations.push('Consider lifestyle changes to lower blood pressure (reduce sodium, increase exercise)');
    }
    if (data.totalCholesterol > 200) {
      recommendations.push('Adopt a heart-healthy diet (Mediterranean diet, reduce saturated fats)');
    }
    if (data.smoking) {
      recommendations.push('Quit smoking immediately - seek support programs');
    }
    if (data.diabetes) {
      recommendations.push('Maintain strict blood glucose control');
    }
    if (data.exercise === 'none' || data.exercise === 'light') {
      recommendations.push('Increase physical activity to 30-45 minutes daily');
    }
    if (riskLevel === 'high') {
      recommendations.push('Consult with a cardiologist for comprehensive evaluation');
      recommendations.push('Consider medication therapy (statins, antihypertensives)');
    } else if (riskLevel === 'moderate') {
      recommendations.push('Monitor risk factors every 6 months');
      recommendations.push('Maintain healthy lifestyle habits');
    } else {
      recommendations.push('Continue current healthy lifestyle');
      recommendations.push('Annual cardiovascular risk reassessment recommended');
    }
    
    return recommendations;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const riskScore = calculateASCVD(formData);
    const riskLevel = getRiskLevel(riskScore);
    const recommendations = getRecommendations(formData, riskLevel);
    
    const newResult: AssessmentResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      data: formData,
      riskScore,
      riskLevel,
      recommendations,
    };
    
    setResult(newResult);
    setShowForm(false);
    
    // Save to history
    const updatedHistory = [newResult, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('assessments', JSON.stringify(updatedHistory));
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'from-green-500 to-green-600';
      case 'moderate':
        return 'from-yellow-500 to-yellow-600';
      case 'high':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="w-8 h-8" />;
      case 'moderate':
        return <Clock className="w-8 h-8" />;
      case 'high':
        return <AlertTriangle className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Cardiovascular Risk Assessment
        </h1>
        <p className="text-gray-600">Advanced ASCVD risk calculator with personalized recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Form */}
        {showForm && (
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">New Assessment</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Age (years)</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="100"
                      value={formData.age || ''}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      required
                      min="80"
                      max="250"
                      value={formData.systolicBP || ''}
                      onChange={(e) => setFormData({ ...formData, systolicBP: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      required
                      min="50"
                      max="150"
                      value={formData.diastolicBP || ''}
                      onChange={(e) => setFormData({ ...formData, diastolicBP: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Total Cholesterol (mg/dL)</label>
                    <input
                      type="number"
                      required
                      min="100"
                      max="500"
                      value={formData.totalCholesterol || ''}
                      onChange={(e) => setFormData({ ...formData, totalCholesterol: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">HDL Cholesterol (mg/dL)</label>
                    <input
                      type="number"
                      required
                      min="20"
                      max="100"
                      value={formData.hdlCholesterol || ''}
                      onChange={(e) => setFormData({ ...formData, hdlCholesterol: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Exercise Level</label>
                    <select
                      value={formData.exercise}
                      onChange={(e) => setFormData({ ...formData, exercise: e.target.value as any })}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition bg-white"
                    >
                      <option value="none">None</option>
                      <option value="light">Light (1-2 days/week)</option>
                      <option value="moderate">Moderate (3-4 days/week)</option>
                      <option value="intense">Intense (5+ days/week)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.smoking}
                      onChange={(e) => setFormData({ ...formData, smoking: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-gray-700 font-semibold">Current smoker</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.diabetes}
                      onChange={(e) => setFormData({ ...formData, diabetes: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-gray-700 font-semibold">Type 2 Diabetes</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.familyHistory}
                      onChange={(e) => setFormData({ ...formData, familyHistory: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-gray-700 font-semibold">Family history of cardiovascular disease</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Calculate Risk Assessment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !showForm && (
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${getRiskColor(result.riskLevel)} rounded-full mb-4 shadow-lg text-white`}>
                  {getRiskIcon(result.riskLevel)}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)} Risk
                </h2>
                <div className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {result.riskScore}%
                </div>
                <p className="text-gray-600">10-year cardiovascular risk score</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-600" />
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setShowForm(true);
                  setResult(null);
                }}
                className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
              >
                New Assessment
              </button>
            </div>
          </div>
        )}

        {/* Assessment History */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-purple-600" />
              Recent Assessments
            </h3>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No assessments yet</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => {
                      setResult(assessment);
                      setShowForm(false);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{assessment.date}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        assessment.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        assessment.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {assessment.riskLevel}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{assessment.riskScore}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
