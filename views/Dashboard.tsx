
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { AuditPlan, NCAR } from '../types';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  ncars: NCAR[];
  auditPlans: AuditPlan[];
}

const Dashboard: React.FC<DashboardProps> = ({ ncars, auditPlans }) => {
  const COLORS = ['#2563eb', '#60a5fa', '#93c5fd', '#dbeafe'];

  const ncarByDept = [
    { name: 'Quality', count: 4 },
    { name: 'InfoSec', count: 7 },
    { name: 'Finance', count: 2 },
    { name: 'Operations', count: 5 },
  ];

  const findingTypes = [
    { name: 'Major NC', value: 3 },
    { name: 'Minor NC', value: 8 },
    { name: 'OFI', value: 5 },
  ];

  const performanceKPIs = [
    { manager: 'M. Adams', score: 92, target: 90 },
    { manager: 'L. Baker', score: 85, target: 90 },
    { manager: 'S. Clark', score: 95, target: 90 },
    { manager: 'D. Evans', score: 78, target: 90 },
  ];

  const tatTrends = [
    { month: 'Jul', tat: 4.2 },
    { month: 'Aug', tat: 3.8 },
    { month: 'Sep', tat: 4.5 },
    { month: 'Oct', tat: 3.2 },
  ];

  return (
    <div className="space-y-10 text-base">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Audits', value: auditPlans.length, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Open NCARs', value: ncars.filter(n => n.status === 'Open').length, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Avg TAT (Days)', value: '3.8', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Completion Rate', value: '88%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">NCARs by Department</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ncarByDept}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 14}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 14}} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '14px'}} />
                <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Finding Distribution</h4>
          <div className="h-80 flex flex-col md:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={findingTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {findingTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '14px'}} />
                <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '14px', fontWeight: 'bold'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Manager KPIs & TAT Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-2xl font-black text-gray-800 tracking-tight">Manager Performance (KPI)</h4>
            <span className="text-sm text-blue-600 font-black bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest border border-blue-100">Target: 90%</span>
          </div>
          <div className="space-y-8">
            {performanceKPIs.map((mgr, i) => (
              <div key={i}>
                <div className="flex justify-between text-base mb-3">
                  <span className="font-black text-gray-700 uppercase tracking-tight">{mgr.manager}</span>
                  <span className={`font-black ${mgr.score >= mgr.target ? 'text-green-600' : 'text-orange-600'}`}>
                    {mgr.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${mgr.score >= mgr.target ? 'bg-blue-600' : 'bg-orange-400'}`} 
                    style={{ width: `${mgr.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Response TAT Trend</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tatTrends}>
                <defs>
                  <linearGradient id="colorTat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 14}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 14}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '14px'}} />
                <Area type="monotone" dataKey="tat" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorTat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-6 text-sm text-gray-500 text-center font-bold italic">
            Target TAT is 5.0 working days
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
