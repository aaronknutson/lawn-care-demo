import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { getOverviewStats, getRevenueAnalytics, getTodaysAppointments, getCustomerMetrics } from '../services/dashboardService';
import GoogleMapsFeatureNote from '../components/admin/GoogleMapsFeatureNote';
import WeatherWidget from '../components/admin/WeatherWidget';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [customerMetrics, setCustomerMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, revenueRes, appointmentsRes, metricsRes] = await Promise.all([
        getOverviewStats(),
        getRevenueAnalytics(),
        getTodaysAppointments(),
        getCustomerMetrics(),
      ]);

      setStats(statsRes.data || {});
      setRevenueData(revenueRes.data || {});
      setTodaysAppointments(appointmentsRes.data || []);
      setCustomerMetrics(metricsRes.data || {});
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
        >
          Try again
        </button>
      </div>
    );
  }

  // Format revenue by service for pie chart
  const revenueByServiceData = revenueData?.revenueByService?.map((item, index) => ({
    name: item.name,
    value: item.revenue,
    color: COLORS[index % COLORS.length],
  })) || [];

  // Format monthly trend for line chart
  const monthlyTrendData = revenueData?.monthlyTrend?.map((item) => ({
    month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    revenue: item.revenue,
    count: item.count,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Google Maps Feature Note */}
      <GoogleMapsFeatureNote />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Revenue</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    ${stats?.todayRevenue?.toFixed(2) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    ${stats?.monthlyRevenue?.toFixed(2) || '0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.totalCustomers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Appointments</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats?.todaysAppointments || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Widgets */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Weather Widget */}
        <WeatherWidget zipCode="78701" />

        {/* MRR Card */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Monthly Recurring Revenue</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  ${revenueData?.mrr?.toFixed(0) || '0'}
                </p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-white/60" />
            </div>
          </div>
        </div>

        {/* Retention Rate Card */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Customer Retention</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {customerMetrics?.retentionRate?.toFixed(0) || '0'}%
                </p>
              </div>
              <UsersIcon className="h-12 w-12 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Growth - Moved from above */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Revenue Growth</p>
                <p className="mt-1 text-3xl font-bold text-white flex items-center">
                  {revenueData?.growth > 0 ? '+' : ''}{revenueData?.growth?.toFixed(1) || '0'}%
                  {revenueData?.growth > 0 ? (
                    <ArrowTrendingUpIcon className="ml-2 h-6 w-6" />
                  ) : (
                    <ArrowTrendingDownIcon className="ml-2 h-6 w-6" />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Retention Rate</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {customerMetrics?.retentionRate || 0}%
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-12 w-12 text-white/60" />
            </div>
          </div>
        </div>

        {/* Churn Rate */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Churn Rate</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {customerMetrics?.churnRate || 0}%
                </p>
              </div>
              <ArrowTrendingDownIcon className="h-12 w-12 text-white/60" />
            </div>
          </div>
        </div>

        {/* Avg Lifetime Value */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Avg Lifetime Value</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  ${customerMetrics?.avgLifetimeValue?.toFixed(0) || '0'}
                </p>
              </div>
              <UsersIcon className="h-12 w-12 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Revenue Trend Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'revenue') return `$${value.toFixed(2)}`;
                  return value;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Service Pie Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Service (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByServiceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByServiceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Today's Appointments</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {todaysAppointments.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments today</h3>
              <p className="mt-1 text-sm text-gray-500">All clear for today!</p>
            </div>
          ) : (
            todaysAppointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">
                        {appointment.scheduledTime || 'TBD'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {appointment.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {appointment.customer?.firstName} {appointment.customer?.lastName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {appointment.servicePackage?.name} - {appointment.property?.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${appointment.totalPrice}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {todaysAppointments.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link
              to="/admin/appointments"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all appointments →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
