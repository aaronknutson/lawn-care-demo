import { useState, useEffect } from 'react';
import api from '../services/api';

function ReferralSection() {
  const [referralData, setReferralData] = useState({ code: '', shareUrl: '' });
  const [stats, setStats] = useState({ totalReferrals: 0, totalEarned: 0, pendingRewards: 0, referrals: [] });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        api.get('/referrals/code'),
        api.get('/referrals/stats'),
      ]);

      if (codeRes.success) setReferralData(codeRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Referral Program</h1>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-xl p-8 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Referral Code</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-primary-100 text-sm mb-2">Share this code with friends:</p>
              <p className="text-4xl font-bold text-white tracking-wider">{referralData.code}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-4 px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>
        <p className="text-primary-100 mt-4 text-sm">
          Refer a friend and both get $25 off your next service!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Referrals</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReferrals}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Earned</p>
          <p className="text-3xl font-bold text-green-600 mt-2">${stats.totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Pending Rewards</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">${stats.pendingRewards.toFixed(2)}</p>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Referral History</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.referrals.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">No referrals yet</div>
          ) : (
            stats.referrals.map((ref) => (
              <div key={ref.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{ref.name}</p>
                  <p className="text-sm text-gray-500">{new Date(ref.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">${ref.reward.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 capitalize">{ref.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReferralSection;
