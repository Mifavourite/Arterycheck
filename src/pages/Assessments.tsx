import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Calculator, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';

interface AssessmentData {
  age: number;
  systolicBP: number;
  diastolicBP: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol?: number;
  triglycerides?: number;
  height: number; // in cm
  weight: number; // in kg
  restingHeartRate?: number; // bpm
  bloodGlucose?: number; // mg/dL
  waistCircumference?: number; // cm
  oxygenSaturation?: number; // SpO2 %
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
    height: 0,
    weight: 0,
    restingHeartRate: 0,
    bloodGlucose: 0,
    waistCircumference: 0,
    oxygenSaturation: 0,
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

  const calculateBMI = (height: number, weight: number): number => {
    if (height <= 0 || weight <= 0) return 0;
    // BMI = weight (kg) / height (m)²
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
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
    
    // BMI factor
    const bmi = calculateBMI(data.height, data.weight);
    if (bmi >= 30) score += 4; // Obese
    else if (bmi >= 25) score += 2; // Overweight
    
    // Resting Heart Rate (elevated HR is a risk factor)
    if (data.restingHeartRate && data.restingHeartRate > 100) score += 2;
    else if (data.restingHeartRate && data.restingHeartRate > 80) score += 1;
    
    // Blood Glucose (diabetes indicator)
    if (data.bloodGlucose && data.bloodGlucose >= 126) score += 3; // Diabetic range
    else if (data.bloodGlucose && data.bloodGlucose >= 100) score += 1; // Pre-diabetic
    
    // Waist Circumference (central obesity indicator)
    if (data.waistCircumference) {
      const isMale = true; // Could be added to form
      const threshold = isMale ? 102 : 88; // cm
      if (data.waistCircumference > threshold) score += 2;
    }
    
    // Triglycerides
    if (data.triglycerides && data.triglycerides >= 200) score += 2;
    else if (data.triglycerides && data.triglycerides >= 150) score += 1;
    
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
    const bmi = calculateBMI(data.height, data.weight);
    const bmiCategory = getBMICategory(bmi);
    
    // BMI recommendations
    if (bmi >= 30) {
      recommendations.push('Weight management is critical - aim for 5-10% weight loss to reduce cardiovascular risk');
    } else if (bmi >= 25) {
      recommendations.push('Consider weight loss through diet and exercise to achieve BMI < 25');
    } else if (bmi < 18.5) {
      recommendations.push('Maintain healthy weight through balanced nutrition');
    }
    
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
    
    // Resting Heart Rate recommendations
    if (data.restingHeartRate && data.restingHeartRate > 100) {
      recommendations.push('Elevated resting heart rate detected - consult with healthcare provider');
    } else if (data.restingHeartRate && data.restingHeartRate > 80) {
      recommendations.push('Consider cardiovascular fitness training to lower resting heart rate');
    }
    
    // Blood Glucose recommendations
    if (data.bloodGlucose && data.bloodGlucose >= 126) {
      recommendations.push('Blood glucose in diabetic range - immediate medical consultation needed');
    } else if (data.bloodGlucose && data.bloodGlucose >= 100) {
      recommendations.push('Pre-diabetic range detected - focus on diet and exercise to prevent progression');
    }
    
    // Waist Circumference recommendations
    if (data.waistCircumference && data.waistCircumference > 102) {
      recommendations.push('Elevated waist circumference indicates central obesity - prioritize weight loss');
    }
    
    // Triglycerides recommendations
    if (data.triglycerides && data.triglycerides >= 200) {
      recommendations.push('High triglycerides detected - reduce refined carbs and sugars, increase omega-3 intake');
    } else if (data.triglycerides && data.triglycerides >= 150) {
      recommendations.push('Borderline high triglycerides - monitor diet and consider lifestyle changes');
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
                    <label className="block text-gray-700 font-semibold mb-2">Height (cm)</label>
                    <input
                      type="number"
                      required
                      min="100"
                      max="250"
                      step="0.1"
                      value={formData.height || ''}
                      onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                      placeholder="e.g., 175"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter height in centimeters</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      required
                      min="30"
                      max="300"
                      step="0.1"
                      value={formData.weight || ''}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                      placeholder="e.g., 75"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter weight in kilograms</p>
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

                {/* Additional Vital Signs Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-600" />
                    Additional Vital Signs (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Resting Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        min="40"
                        max="120"
                        value={formData.restingHeartRate || ''}
                        onChange={(e) => setFormData({ ...formData, restingHeartRate: parseInt(e.target.value) || 0 })}
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                        placeholder="e.g., 72"
                      />
                      <p className="text-xs text-gray-500 mt-1">Normal: 60-100 bpm</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Blood Glucose (mg/dL)
                      </label>
                      <input
                        type="number"
                        min="70"
                        max="300"
                        value={formData.bloodGlucose || ''}
                        onChange={(e) => setFormData({ ...formData, bloodGlucose: parseInt(e.target.value) || 0 })}
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                        placeholder="e.g., 95"
                      />
                      <p className="text-xs text-gray-500 mt-1">Normal: &lt;100 mg/dL (fasting)</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Waist Circumference (cm)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="200"
                        step="0.1"
                        value={formData.waistCircumference || ''}
                        onChange={(e) => setFormData({ ...formData, waistCircumference: parseFloat(e.target.value) || 0 })}
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                        placeholder="e.g., 85"
                      />
                      <p className="text-xs text-gray-500 mt-1">Healthy: &lt;102 cm (men), &lt;88 cm (women)</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Triglycerides (mg/dL)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="500"
                        value={formData.triglycerides || ''}
                        onChange={(e) => setFormData({ ...formData, triglycerides: parseInt(e.target.value) || 0 })}
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                        placeholder="e.g., 150"
                      />
                      <p className="text-xs text-gray-500 mt-1">Normal: &lt;150 mg/dL</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Oxygen Saturation (SpO2 %)
                      </label>
                      <input
                        type="number"
                        min="85"
                        max="100"
                        value={formData.oxygenSaturation || ''}
                        onChange={(e) => setFormData({ ...formData, oxygenSaturation: parseInt(e.target.value) || 0 })}
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                        placeholder="e.g., 98"
                      />
                      <p className="text-xs text-gray-500 mt-1">Normal: 95-100%</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        LDL Cholesterol (mg/dL)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="300"
                        value={formData.ldlCholesterol || ''}
                        onChange={(e) => setFormData({ ...formData, ldlCholesterol: parseInt(e.target.value) || 0 })}
                        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                        placeholder="e.g., 120"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optimal: &lt;100 mg/dL</p>
                    </div>
                  </div>
                </div>

                {/* BMI Display */}
                {formData.height > 0 && formData.weight > 0 && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Body Mass Index (BMI)</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {calculateBMI(formData.height, formData.weight)}
                        </p>
                        <p className={`text-sm font-semibold mt-1 ${getBMICategory(calculateBMI(formData.height, formData.weight)).color}`}>
                          {getBMICategory(calculateBMI(formData.height, formData.weight)).category}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>Normal: 18.5 - 24.9</p>
                        <p>Overweight: 25 - 29.9</p>
                        <p>Obese: ≥ 30</p>
                      </div>
                    </div>
                  </div>
                )}

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

              {/* BMI Display in Results */}
              {result.data.height > 0 && result.data.weight > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Body Mass Index (BMI)</p>
                      <div className="flex items-baseline gap-3">
                        <p className="text-3xl font-bold text-gray-800">
                          {calculateBMI(result.data.height, result.data.weight)}
                        </p>
                        <p className={`text-lg font-semibold ${getBMICategory(calculateBMI(result.data.height, result.data.weight)).color}`}>
                          {getBMICategory(calculateBMI(result.data.height, result.data.weight)).category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>Height: {result.data.height} cm</p>
                      <p>Weight: {result.data.weight} kg</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Vital Signs Summary */}
              {(result.data.restingHeartRate || result.data.bloodGlucose || result.data.waistCircumference || 
                result.data.triglycerides || result.data.oxygenSaturation || result.data.ldlCholesterol) && (
                <div className="mb-6 p-6 bg-gradient-to-br from-sky-50 to-teal-50 rounded-xl border border-sky-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-600" />
                    Vital Signs Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {result.data.restingHeartRate > 0 && (
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Resting HR</p>
                        <p className="text-xl font-bold text-gray-800">
                          {result.data.restingHeartRate} <span className="text-sm text-gray-500">bpm</span>
                        </p>
                        <p className={`text-xs mt-1 ${
                          result.data.restingHeartRate > 100 ? 'text-red-600' :
                          result.data.restingHeartRate > 80 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {result.data.restingHeartRate > 100 ? 'Elevated' :
                           result.data.restingHeartRate > 80 ? 'Slightly High' : 'Normal'}
                        </p>
                      </div>
                    )}
                    {result.data.bloodGlucose > 0 && (
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Blood Glucose</p>
                        <p className="text-xl font-bold text-gray-800">
                          {result.data.bloodGlucose} <span className="text-sm text-gray-500">mg/dL</span>
                        </p>
                        <p className={`text-xs mt-1 ${
                          result.data.bloodGlucose >= 126 ? 'text-red-600' :
                          result.data.bloodGlucose >= 100 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {result.data.bloodGlucose >= 126 ? 'Diabetic' :
                           result.data.bloodGlucose >= 100 ? 'Pre-diabetic' : 'Normal'}
                        </p>
                      </div>
                    )}
                    {result.data.waistCircumference > 0 && (
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Waist Circ.</p>
                        <p className="text-xl font-bold text-gray-800">
                          {result.data.waistCircumference} <span className="text-sm text-gray-500">cm</span>
                        </p>
                        <p className={`text-xs mt-1 ${
                          result.data.waistCircumference > 102 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {result.data.waistCircumference > 102 ? 'Elevated' : 'Normal'}
                        </p>
                      </div>
                    )}
                    {result.data.triglycerides > 0 && (
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Triglycerides</p>
                        <p className="text-xl font-bold text-gray-800">
                          {result.data.triglycerides} <span className="text-sm text-gray-500">mg/dL</span>
                        </p>
                        <p className={`text-xs mt-1 ${
                          result.data.triglycerides >= 200 ? 'text-red-600' :
                          result.data.triglycerides >= 150 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {result.data.triglycerides >= 200 ? 'High' :
                           result.data.triglycerides >= 150 ? 'Borderline' : 'Normal'}
                        </p>
                      </div>
                    )}
                    {result.data.oxygenSaturation > 0 && (
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">SpO2</p>
                        <p className="text-xl font-bold text-gray-800">
                          {result.data.oxygenSaturation} <span className="text-sm text-gray-500">%</span>
                        </p>
                        <p className={`text-xs mt-1 ${
                          result.data.oxygenSaturation < 95 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {result.data.oxygenSaturation < 95 ? 'Low' : 'Normal'}
                        </p>
                      </div>
                    )}
                    {result.data.ldlCholesterol > 0 && (
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">LDL Cholesterol</p>
                        <p className="text-xl font-bold text-gray-800">
                          {result.data.ldlCholesterol} <span className="text-sm text-gray-500">mg/dL</span>
                        </p>
                        <p className={`text-xs mt-1 ${
                          result.data.ldlCholesterol >= 160 ? 'text-red-600' :
                          result.data.ldlCholesterol >= 130 ? 'text-yellow-600' :
                          result.data.ldlCholesterol >= 100 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {result.data.ldlCholesterol >= 160 ? 'High' :
                           result.data.ldlCholesterol >= 130 ? 'Borderline High' :
                           result.data.ldlCholesterol >= 100 ? 'Near Optimal' : 'Optimal'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
