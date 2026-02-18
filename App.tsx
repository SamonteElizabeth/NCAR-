
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  AlertCircle, 
  CheckSquare, 
  ShieldCheck, 
  Bell, 
  UserCircle,
  Menu,
  X,
  Plus,
  Search,
  ChevronRight,
  Filter,
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase,
  Search as SearchIcon,
  BarChart3,
  Check
} from 'lucide-react';
import { 
  Role, 
  AuditPlan, 
  NCAR, 
  ActionPlan, 
  AuditStatus, 
  NCARStatus,
  Notification
} from './types';
import { INITIAL_AUDIT_PLANS, INITIAL_NCARS, INITIAL_ACTION_PLANS, USERS } from './mockData';
import Dashboard from './views/Dashboard';
import AuditPlanning from './views/AuditPlanning';
import NCARModule from './views/NCARModule';
import ActionPlanModule from './views/ActionPlanModule';
import ValidationModule from './views/ValidationModule';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('LEAD_AUDITOR');
  const [auditPlans, setAuditPlans] = useState<AuditPlan[]>(INITIAL_AUDIT_PLANS);
  const [ncars, setNcars] = useState<NCAR[]>(INITIAL_NCARS);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(INITIAL_ACTION_PLANS);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'New Audit Plan Assigned: Q3 Financial', type: 'info', timestamp: '2 mins ago' },
    { id: '2', message: 'NCAR Deadline Approaching: NC-2023-001', type: 'warning', timestamp: '1 hour ago' }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Helper to add toast notifications
  const notify = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const navItems = [
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard, roles: ['LEAD_AUDITOR', 'AUDITOR', 'AUDITEE'] },
    { id: 'planning', label: 'Audit Planning', icon: ClipboardList, roles: ['LEAD_AUDITOR', 'AUDITOR', 'AUDITEE'] },
    { id: 'ncar', label: 'NCAR Module', icon: AlertCircle, roles: ['LEAD_AUDITOR', 'AUDITOR', 'AUDITEE'] },
    { id: 'actions', label: 'Action Plans', icon: CheckSquare, roles: ['LEAD_AUDITOR', 'AUDITOR', 'AUDITEE'] },
    { id: 'validation', label: 'Validation & Closure', icon: ShieldCheck, roles: ['LEAD_AUDITOR', 'AUDITOR', 'AUDITEE'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard ncars={ncars} auditPlans={auditPlans} />;
      case 'planning': return (
        <AuditPlanning 
          plans={auditPlans} 
          setPlans={setAuditPlans} 
          role={currentRole} 
          onNotify={notify}
        />
      );
      case 'ncar': return (
        <NCARModule 
          ncars={ncars} 
          setNcars={setNcars} 
          role={currentRole} 
          onNotify={notify} 
        />
      );
      case 'actions': return (
        <ActionPlanModule 
          ncars={ncars} 
          actionPlans={actionPlans} 
          setActionPlans={setActionPlans} 
          setNcars={setNcars}
          role={currentRole} 
          onNotify={notify}
        />
      );
      case 'validation': return (
        <ValidationModule 
          ncars={ncars} 
          actionPlans={actionPlans} 
          setNcars={setNcars}
          role={currentRole} 
          onNotify={notify}
        />
      );
      default: return <Dashboard ncars={ncars} auditPlans={auditPlans} />;
    }
  };

  // Recreated Logo Component based on the uploaded image
  const Logo = ({ collapsed }: { collapsed: boolean }) => (
    <div className={`flex flex-col items-center transition-all duration-300 ${collapsed ? 'gap-0' : 'gap-2'}`}>
      <div className="relative group">
        {/* The Outer Glass / Swirl Effect - Adjusted to match the specific blue theme */}
        <div className={`absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-500 ${collapsed ? 'scale-75' : ''}`}></div>
        
        {/* Main Magnifying Glass Icon Recreated with CSS/Lucide */}
        <div className={`relative bg-white rounded-full flex items-center justify-center border-4 border-blue-400 shadow-lg ${collapsed ? 'w-12 h-12' : 'w-20 h-20'}`}>
          <div className="relative flex flex-col items-center justify-center">
            <BarChart3 className={`${collapsed ? 'w-5 h-5' : 'w-8 h-8'} text-blue-300 absolute -translate-y-1`} />
            <Check className={`${collapsed ? 'w-6 h-6' : 'w-12 h-12'} text-blue-500 absolute translate-y-1 font-black`} strokeWidth={4} />
          </div>
          {/* Magnifying Glass Handle */}
          <div className={`absolute -bottom-1 -right-1 bg-blue-500 rounded-full border-2 border-white transform rotate-45 ${collapsed ? 'w-4 h-6' : 'w-6 h-10'}`}></div>
        </div>
      </div>
      
      {!collapsed && (
        <span className="font-black text-2xl text-white tracking-tighter drop-shadow-md">
          NCAR<span className="text-blue-100">Tool</span>
        </span>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-base">
      {/* Sidebar - Updated to specific user blue #3b82f6 */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-[#3b82f6] transition-all duration-300 flex flex-col h-full z-30 shadow-2xl`}>
        <div className="p-8 pb-6 flex flex-col items-center border-b border-white/10 relative">
          <div className="w-full flex justify-end lg:flex hidden absolute top-4 right-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-md transition-colors">
               <Menu size={20} className="text-blue-50" />
             </button>
          </div>
          
          <Logo collapsed={!isSidebarOpen} />
        </div>

        <nav className="flex-1 p-4 mt-6 space-y-2 overflow-y-auto custom-scrollbar">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeModule === item.id 
                  ? 'bg-white text-[#3b82f6] shadow-lg border border-white/20' 
                  : 'text-white hover:bg-white/10'
              } ${!isSidebarOpen && 'justify-center'}`}
            >
              <item.icon size={24} className={activeModule === item.id ? 'text-[#3b82f6]' : 'text-blue-50'} />
              {isSidebarOpen && <span className="font-bold text-base">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/5">
          <div className={`flex items-center gap-4 ${!isSidebarOpen && 'justify-center'}`}>
            <UserCircle size={32} className="text-blue-50" />
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-base font-black text-white truncate">Demo User</p>
                <p className="text-xs font-black text-blue-100 uppercase truncate tracking-widest">{currentRole.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <div className="mt-6 space-y-3">
              <label className="text-[10px] font-black text-blue-50 uppercase tracking-[0.2em] block">Switch Role Access</label>
              <select 
                value={currentRole} 
                onChange={(e) => setCurrentRole(e.target.value as Role)}
                className="w-full text-sm bg-white/10 border-none text-white rounded-xl p-3.5 focus:ring-2 focus:ring-white font-bold appearance-none cursor-pointer shadow-lg hover:bg-white/20 transition-all"
              >
                <option value="LEAD_AUDITOR" className="text-gray-900">Lead Auditor</option>
                <option value="AUDITOR" className="text-gray-900">Auditor</option>
                <option value="AUDITEE" className="text-gray-900">Auditee</option>
              </select>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-20 sticky top-0">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{activeModule.replace('-', ' ')}</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell size={24} />
                <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#3b82f6] rounded-full border-2 border-white"></span>
              </button>
              {/* Notifications Dropdown */}
              <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                  <span className="font-black text-xs uppercase tracking-widest text-gray-400">Notifications</span>
                  <span className="text-xs bg-[#3b82f6] text-white px-2.5 py-1 rounded-full font-bold">New</span>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.map(n => (
                    <div key={n.id} className="p-5 hover:bg-blue-50/30 border-b border-gray-50 transition-colors">
                      <div className="flex items-start gap-5">
                        <div className={`mt-2 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          n.type === 'success' ? 'bg-green-500' : 
                          n.type === 'warning' ? 'bg-orange-500' : 'bg-[#3b82f6]'
                        }`} />
                        <div>
                          <p className="text-base text-gray-800 font-bold leading-tight mb-1.5">{n.message}</p>
                          <span className="text-xs text-gray-400 uppercase font-black tracking-widest">{n.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 text-center bg-gray-50/50 rounded-b-2xl border-t border-gray-50">
                  <button className="text-sm font-black text-[#3b82f6] hover:text-blue-800 uppercase tracking-widest">Mark All as Read</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <section className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-gray-50/50">
          {renderModule()}
        </section>
      </main>
    </div>
  );
};

export default App;
