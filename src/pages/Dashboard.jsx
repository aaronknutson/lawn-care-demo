import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/customers/appointments?limit=10');
      if (response.success) {
        const appts = response.data.appointments;
        setAppointments(appts);

        // Calculate stats
        const upcoming = appts.filter(a => a.status === 'scheduled').length;
        const completed = appts.filter(a => a.status === 'completed').length;
        setStats({ upcoming, completed, total: appts.length });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextAppointment = appointments.find(a => a.status === 'scheduled' && new Date(a.scheduledDate) >= new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's your lawn care overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.upcoming}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Services</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Appointment Card */}
      {nextAppointment ? (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Next Appointment</h2>
                <div className="space-y-2">
                  <p className="text-primary-100 text-lg">
                    {nextAppointment.servicePackage?.name}
                  </p>
                  <p className="text-white font-semibold text-xl">
                    {new Date(nextAppointment.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-primary-100">
                    {nextAppointment.scheduledTime} • {nextAppointment.property?.address}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white">
                  <CountdownTimer targetDate={nextAppointment.scheduledDate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No upcoming appointments scheduled</p>
          <Link
            to="/booking"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Book a Service
          </Link>
        </div>
      )}

      {/* Recent Appointments */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Appointments</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">No appointments yet</div>
          ) : (
            appointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.servicePackage?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.scheduledDate).toLocaleDateString()} • {appointment.scheduledTime}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-6 py-3 bg-gray-50 text-right">
          <Link to="/portal/appointments" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all appointments →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/booking"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">Book New Service</h4>
              <p className="text-sm text-gray-500">Schedule another appointment</p>
            </div>
          </div>
        </Link>

        <Link
          to="/portal/referrals"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">Refer a Friend</h4>
              <p className="text-sm text-gray-500">Earn rewards for referrals</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        setTimeLeft('Today!');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-center">
      <p className="text-4xl font-bold">{timeLeft}</p>
      <p className="text-sm text-primary-200">until service</p>
    </div>
  );
}

export default Dashboard;
