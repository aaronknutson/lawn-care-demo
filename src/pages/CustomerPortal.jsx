import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CustomerPortal() {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/portal', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Appointments', path: '/portal/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Payments', path: '/portal/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Profile', path: '/portal/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Referrals', path: '/portal/referrals', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow bg-primary-700 overflow-y-auto">
              {/* User Info */}
              <div className="flex items-center flex-shrink-0 px-4 py-6 bg-primary-800">
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-primary-200">Customer</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/portal'}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary-800 text-white'
                          : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                      }`
                    }
                  >
                    <svg
                      className="mr-3 flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Mobile menu - Simple top nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <nav className="flex justify-around">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/portal'}
                className={({ isActive }) =>
                  `flex flex-col items-center py-2 px-3 ${
                    isActive ? 'text-primary-600' : 'text-gray-600'
                  }`
                }
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="text-xs mt-1">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none pb-20 md:pb-0">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CustomerPortal;
