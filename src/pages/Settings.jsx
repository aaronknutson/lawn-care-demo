import { useState } from 'react';
import {
  CogIcon,
  RectangleStackIcon,
  PlusCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import ServicePackageManager from '../components/admin/ServicePackageManager';
import AddOnServiceManager from '../components/admin/AddOnServiceManager';
import CrewManagement from '../components/admin/CrewManagement';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('packages');

  const tabs = [
    { id: 'packages', name: 'Service Packages', icon: RectangleStackIcon },
    { id: 'addons', name: 'Add-On Services', icon: PlusCircleIcon },
    { id: 'crew', name: 'Crew Members', icon: UsersIcon },
    { id: 'business', name: 'Business Settings', icon: CogIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage service packages, add-ons, crew members, and business settings
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <Icon
                    className={`${
                      activeTab === tab.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    } -ml-0.5 mr-2 h-5 w-5`}
                    aria-hidden="true"
                  />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'packages' && <ServicePackageManager />}
          {activeTab === 'addons' && <AddOnServiceManager />}
          {activeTab === 'crew' && <CrewManagement />}
          {activeTab === 'business' && (
            <div className="text-center py-12">
              <CogIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">Business Settings</h3>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
