import React, { useState } from "react";

export default function ArteryCheck() {
  const [age, setAge] = useState<number | string>("");
  const [bp, setBp] = useState<number | string>("");
  const [cholesterol, setCholesterol] = useState<number | string>("");
  const [smoking, setSmoking] = useState<string>("no");
  const [diabetes, setDiabetes] = useState<string>("no");
  const [risk, setRisk] = useState<string | null>(null);

  const calculateRisk = () => {
    let score = 0;

    if (Number(age) > 45) score += 1;
    if (Number(bp) > 130) score += 1;
    if (Number(cholesterol) > 200) score += 1;
    if (smoking === "yes") score += 1;
    if (diabetes === "yes") score += 1;

    if (score <= 1)
      setRisk("🟢 Low Risk – Keep up healthy habits!");
    else if (score <= 3)
      setRisk("🟡 Moderate Risk – Improve diet and exercise.");
    else setRisk("🔴 High Risk – Consult a doctor for evaluation.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-teal-50 px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mb-4 shadow-lg animate-pulse">
          <span className="text-4xl">🫀</span>
        </div>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
          ArteryCheck
        </h1>
        <p className="text-gray-600 text-lg mt-2 max-w-lg mx-auto">
          Estimate your cardiovascular health risk using simple health data.
          <br />
          <span className="text-sm italic text-gray-400">
            (Educational use only)
          </span>
        </p>
      </div>

      {/* Dashboard Card */}
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-sky-100">
        {/* Metrics Section */}
        <div className="grid gap-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Blood Pressure (Systolic)
            </label>
            <input
              type="number"
              value={bp}
              onChange={(e) => setBp(e.target.value)}
              placeholder="e.g., 120 mmHg"
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Cholesterol Level
            </label>
            <input
              type="number"
              value={cholesterol}
              onChange={(e) => setCholesterol(e.target.value)}
              placeholder="e.g., 180 mg/dL"
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Do you smoke?
            </label>
            <select
              value={smoking}
              onChange={(e) => setSmoking(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition bg-white"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Do you have diabetes?
            </label>
            <select
              value={diabetes}
              onChange={(e) => setDiabetes(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition bg-white"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={calculateRisk}
          className="mt-8 w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-sky-600 hover:to-teal-600 transition-all"
        >
          Calculate My Risk
        </button>

        {/* Result */}
        {risk && (
          <div className="mt-6 p-5 text-center font-medium text-gray-800 bg-gradient-to-br from-teal-50 to-blue-50 border border-sky-200 rounded-2xl shadow-inner ring-1 ring-sky-100">
            {risk}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-gray-500 text-sm text-center">
        © 2025 <span className="font-semibold text-sky-600">ArteryCheck</span> — Built by{" "}
        <span className="font-semibold text-teal-600">Lordsfavour Anukam</span> to
        promote cardiovascular awareness.
      </footer>
    </div>
  );
}
