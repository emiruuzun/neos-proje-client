import { NavLink, useNavigate } from 'react-router-dom';
import { menuItem } from '../utils/MenuItem';
import { logoutUser } from '../services/auth';
import { FaUserCircle,FaSignOutAlt, FaClipboardList, FaChartBar, FaBox } from 'react-icons/fa';

function Dashboardlayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(navigate); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getIcon = (name) => {
    switch(name) {
      case 'Profile': return <FaUserCircle className="mr-2" />;
      case 'Projects': return <FaClipboardList className="mr-2" />;
      case 'Project Analysis': return <FaChartBar className="mr-2" />;
      default: return <FaBox className="mr-2" />;
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/6 bg-gray-900 text-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-indigo-400">Menü</h1>
          <ul className="space-y-4 mt-6">
            {menuItem.map((section) => (
              <li key={section.name} className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {section.name}
                </div>
                <ul className="space-y-2 mt-2">
                  {section.items.map((item) => (
                    <li key={item.slug} className="flex items-center bg-gray-800 p-1 rounded-md hover:bg-gray-700 transition-colors duration-200">
                      {getIcon(item.name)}
                      <NavLink
                        to={`/${item.slug}`}
                        className="block text-gray-200 hover:text-gray-300 transition-colors duration-200"
                        activeClassName="text-indigo-400"
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center mt-80 text-gray-200 hover:text-gray-300 transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      
      <div className="w-2/3 bg-gray-800 m-auto rounded-lg">
        <div className="p-8">{children}</div>
      </div>

    </div>
  );
}

export default Dashboardlayout;
