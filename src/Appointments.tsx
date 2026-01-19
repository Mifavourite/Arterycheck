import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, User, Phone, Mail, AlertCircle } from 'lucide-react';
import { format, addDays, isBefore, isAfter, startOfDay } from 'date-fns';

interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'assessment' | 'urgent';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Appointment, 'id'>>({
    patientName: '',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '09:00',
    type: 'consultation',
    status: 'scheduled',
    notes: '',
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  };

  const saveAppointments = (newAppointments: Appointment[]) => {
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    setAppointments(newAppointments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      ...formData,
      id: Date.now().toString(),
    };
    const updated = [newAppointment, ...appointments];
    saveAppointments(updated);
    setShowForm(false);
    setFormData({
      patientName: '',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '09:00',
      type: 'consultation',
      status: 'scheduled',
      notes: '',
    });
  };

  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled')
    .filter(a => {
      const appointmentDateTime = new Date(`${a.date}T${a.time}`);
      return isAfter(appointmentDateTime, new Date());
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  const todayAppointments = upcomingAppointments.filter(a => {
    const appointmentDate = startOfDay(new Date(a.date));
    const today = startOfDay(new Date());
    return appointmentDate.getTime() === today.getTime();
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'follow-up':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'assessment':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Appointment Management
          </h1>
          <p className="text-gray-600">Schedule and manage patient appointments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      {/* Appointment Form */}
      {showForm && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule New Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Patient Name</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date</label>
                <input
                  type="date"
                  required
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Time</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Appointment Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition bg-white"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="assessment">Assessment</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-sky-400 focus:outline-none transition"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Schedule Appointment
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-800">Today's Appointments</h2>
            <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-semibold">
              {todayAppointments.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl p-4 shadow border border-amber-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">{appointment.patientName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(appointment.type)}`}>
                    {appointment.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {appointment.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-sky-600" />
          Upcoming Appointments
        </h2>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No upcoming appointments scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-200"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{appointment.patientName}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(appointment.date), 'MMMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition font-semibold text-sm">
                    Complete
                  </button>
                  <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition font-semibold text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
