import { useState } from 'react';
import {
  BookOpen,
  Heart,
  Activity,
  UtensilsCrossed,
  Pill,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Video,
  FileText,
} from 'lucide-react';

interface EducationModule {
  id: string;
  title: string;
  icon: any;
  category: string;
  content: string;
  points: string[];
  duration: string;
}

export default function Education() {
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);

  const modules: EducationModule[] = [
    {
      id: '1',
      title: 'Understanding Atherosclerosis',
      icon: Heart,
      category: 'Cardiovascular Health',
      duration: '10 min read',
      content: 'Atherosclerosis is a condition where plaque builds up in your arteries, leading to reduced blood flow and increased risk of heart attack and stroke. This silent condition develops over decades, often starting in childhood.',
      points: [
        'Atherosclerosis begins with endothelial injury caused by high cholesterol, smoking, or high blood pressure',
        'LDL cholesterol becomes oxidized and accumulates under the artery lining',
        'Immune cells (macrophages) transform into foam cells, forming fatty streaks',
        'Fibrous caps develop over time, and if they rupture, blood clots can form',
        'This process can lead to heart attacks, strokes, or peripheral vascular disease',
      ],
    },
    {
      id: '2',
      title: 'Heart-Healthy Diet',
      icon: UtensilsCrossed,
      category: 'Nutrition',
      duration: '15 min read',
      content: 'A Mediterranean-style diet rich in fruits, vegetables, whole grains, fish, and healthy fats can significantly reduce cardiovascular risk. Studies show this dietary pattern can reverse plaque buildup in arteries.',
      points: [
        'Prioritize omega-3 rich fish (salmon, mackerel) at least twice weekly',
        'Use olive oil as primary cooking fat instead of butter or trans fats',
        'Include 5+ servings of fruits and vegetables daily',
        'Choose whole grains over refined carbohydrates',
        'Limit red meat, processed foods, and added sugars',
        'Nuts and seeds provide healthy fats and antioxidants',
      ],
    },
    {
      id: '3',
      title: 'Exercise and Cardiovascular Health',
      icon: Activity,
      category: 'Physical Activity',
      duration: '12 min read',
      content: 'Regular physical activity strengthens your heart, improves circulation, lowers blood pressure, and helps maintain healthy cholesterol levels. The American Heart Association recommends 150 minutes of moderate exercise weekly.',
      points: [
        'Aim for 30-45 minutes of moderate exercise daily (brisk walking, cycling)',
        'Strength training 2-3 times per week improves heart health',
        'High-intensity interval training (HIIT) can be especially effective',
        'Consistency matters more than intensity - start with what you can do',
        'Exercise helps with weight management and stress reduction',
        'Even 10-minute activity bursts throughout the day provide benefits',
      ],
    },
    {
      id: '4',
      title: 'Medications for Heart Health',
      icon: Pill,
      category: 'Treatment',
      duration: '18 min read',
      content: 'Various medications can help manage cardiovascular risk factors and stabilize existing plaque. Understanding how these medications work helps ensure proper adherence and optimal outcomes.',
      points: [
        'Statins reduce LDL cholesterol and stabilize plaque to prevent rupture',
        'PCSK9 inhibitors can lower LDL to unprecedented levels (<30 mg/dL)',
        'Antiplatelets (Aspirin, Clopidogrel) prevent dangerous blood clots',
        'ACE inhibitors protect arteries and reduce inflammation',
        'Beta-blockers help manage blood pressure and heart rate',
        'Always take medications as prescribed and discuss any concerns with your doctor',
      ],
    },
    {
      id: '5',
      title: 'Reversing Atherosclerosis',
      icon: TrendingUp,
      category: 'Prevention',
      duration: '20 min read',
      content: 'Emerging research shows that atherosclerosis can be reversed through aggressive lifestyle changes and medical therapy. Pioneering studies by Dr. Dean Ornish and Dr. Caldwell Esselstyn demonstrate plaque regression with comprehensive programs.',
      points: [
        'Strict plant-based diets have reversed coronary plaque in clinical studies',
        'Combining diet, exercise, stress management, and social support yields best results',
        'PCSK9 inhibitors can achieve very low LDL levels, promoting plaque regression',
        'Intensive lifestyle changes can show results in as little as 1 year',
        'Regular monitoring (via imaging studies) can track progress',
        'Early intervention provides the greatest potential for reversal',
      ],
    },
    {
      id: '6',
      title: 'Risk Factors and Prevention',
      icon: AlertTriangle,
      category: 'Awareness',
      duration: '15 min read',
      content: 'Understanding and managing risk factors is crucial for preventing atherosclerosis. Many risk factors are modifiable through lifestyle changes, while others require medical management.',
      points: [
        'Modifiable risk factors: diet, exercise, smoking, stress, blood pressure, diabetes control',
        'Non-modifiable risk factors: age, genetics, family history',
        'Smoking cessation provides immediate cardiovascular benefits',
        'Blood pressure control (<130/80) is critical for artery health',
        'Diabetes management reduces risk of vascular complications',
        'Stress reduction through mindfulness, meditation, or counseling helps',
        'Regular health screenings detect problems before symptoms appear',
      ],
    },
  ];

  const categories = ['All', 'Cardiovascular Health', 'Nutrition', 'Physical Activity', 'Treatment', 'Prevention', 'Awareness'];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredModules = selectedCategory === 'All' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory);

  if (selectedModule) {
    const Icon = selectedModule.icon;
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedModule(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          Back to Education
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-purple-600">{selectedModule.category}</span>
              <h1 className="text-4xl font-bold text-gray-800">{selectedModule.title}</h1>
              <p className="text-gray-500">{selectedModule.duration}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{selectedModule.content}</p>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Key Points
              </h2>
              <ul className="space-y-3">
                {selectedModule.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-6 h-6 bg-gradient-to-br from-sky-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Health Education Center
        </h1>
        <p className="text-gray-600">Comprehensive resources for cardiovascular health and atherosclerosis management</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Education Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.id}
              onClick={() => setSelectedModule(module)}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  {module.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition">
                {module.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{module.content}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {module.duration}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sky-600 group-hover:translate-x-1 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
          <Video className="w-12 h-12 text-sky-600 mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{modules.length}</h3>
          <p className="text-gray-600">Education Modules</p>
        </div>
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
          <FileText className="w-12 h-12 text-teal-600 mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{categories.length - 1}</h3>
          <p className="text-gray-600">Categories</p>
        </div>
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
          <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-800 mb-1">100%</h3>
          <p className="text-gray-600">Evidence-Based</p>
        </div>
      </div>
    </div>
  );
}
