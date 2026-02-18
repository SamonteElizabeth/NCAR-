
import React, { useState } from 'react';
import { NCAR, NCARStatus, Role } from '../types';
import { AlertTriangle, Clock, MapPin, User, FileText, Plus, Search, Filter, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface NCARModuleProps {
  ncars: NCAR[];
  setNcars: React.Dispatch<React.SetStateAction<NCAR[]>>;
  role: Role;
  onNotify: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

const NCARModule: React.FC<NCARModuleProps> = ({ ncars, setNcars, role, onNotify }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Major' as 'Major' | 'Minor' | 'OFI',
    area: '',
    clause: '',
    statement: '',
    evidence: '',
    auditee: 'Bob Johnson'
  });

  const canCreate = role === 'LEAD_AUDITOR' || role === 'AUDITOR';

  const getDaysRemaining = (deadline: string) => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const handleRaiseNCAR = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    const newNCAR: NCAR = {
      id: `NCAR_${String(ncars.length + 1).padStart(6, '0')}_${timestamp}`,
      auditPlanId: 'AP_UNKNOWN',
      statement: formData.statement,
      requirement: formData.clause,
      evidence: formData.evidence,
      findingType: formData.type,
      standardClause: formData.clause.split(' ')[0] || '8.1',
      area: formData.area,
      auditor: 'Current User',
      auditee: formData.auditee,
      createdAt: now.toISOString(),
      status: NCARStatus.OPEN,
      deadline: deadline.toISOString()
    };

    setNcars(prev => [newNCAR, ...prev]);
    setShowForm(false);
    onNotify('NCAR successfully raised and assigned.', 'success');
    setFormData({ type: 'Major', area: '', clause: '', statement: '', evidence: '', auditee: 'Bob Johnson' });
  };

  return (
    <div className="space-y-8 text-base">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Non-Conformance Reports</h3>
          <p className="text-lg text-gray-500 font-medium">Log findings, track deadlines, and monitor non-compliance.</p>
        </div>
        
        {canCreate && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-200 text-base"
          >
            <Plus size={24} />
            Raise NCAR
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by NCAR ID, Clause, or Area..." 
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-base font-medium"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-3 px-7 py-4 bg-gray-50 rounded-2xl text-base font-black text-gray-600 hover:bg-gray-100 transition-colors">
            <Filter size={20} />
            Filters
          </button>
          <select className="bg-gray-50 border-none rounded-2xl px-7 py-4 text-base font-black text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none">
            <option>All Status</option>
            <option>Open</option>
            <option>Submitted</option>
            <option>Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#3b82f6] text-white">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">NCAR ID</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Type</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Requirement</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Area / Clause</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Assigned Auditee</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center">Deadline</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ncars.map((ncar) => {
                const daysLeft = getDaysRemaining(ncar.deadline);
                return (
                  <tr key={ncar.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group" onClick={() => onNotify(`Viewing details for ${ncar.id}`)}>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter border border-blue-100">{ncar.id}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-xs font-black px-3 py-1 rounded-full uppercase border ${
                        ncar.findingType === 'Major' ? 'bg-red-50 text-red-600 border-red-100' :
                        ncar.findingType === 'Minor' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {ncar.findingType}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-900 text-base line-clamp-1">{ncar.requirement}</p>
                      <p className="text-sm text-gray-400 font-medium italic mt-1 truncate max-w-[250px]">"{ncar.statement}"</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-base font-bold text-gray-700">{ncar.area}</div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Clause {ncar.standardClause}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-sm font-bold text-gray-600">
                        <User size={16} className="text-gray-400" />
                        {ncar.auditee}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-center">
                        <div className="text-sm font-black text-gray-900">{new Date(ncar.deadline).toLocaleDateString()}</div>
                        {ncar.status === NCARStatus.OPEN && (
                          <div className={`text-[10px] font-black uppercase mt-1.5 ${daysLeft <= 1 ? 'text-red-500' : 'text-blue-500'}`}>
                            {daysLeft} days left
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`text-xs font-black px-4 py-1.5 rounded-full uppercase border ${
                          ncar.status === NCARStatus.OPEN ? 'text-blue-600 bg-blue-50 border-blue-100' : 
                          ncar.status === NCARStatus.CLOSED ? 'text-green-600 bg-green-50 border-green-100' : 'text-orange-600 bg-orange-50 border-orange-100'
                        }`}>
                          {ncar.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-[3.5rem] w-full max-w-7xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in slide-in-from-bottom duration-500">
            <form onSubmit={handleRaiseNCAR} className="flex flex-col h-full">
              <div className="p-14 pb-8 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-10">
                  <div className="bg-red-50 p-7 rounded-[2.5rem] text-red-600 shadow-sm">
                    <AlertTriangle size={56} />
                  </div>
                  <div>
                    <h4 className="text-5xl font-black text-gray-900 tracking-tighter">Log Finding</h4>
                    <p className="text-gray-500 text-xl font-medium mt-1">Define non-compliance and objective evidence.</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 p-5 rounded-full transition-all">
                  <X size={40} className="text-gray-500" />
                </button>
              </div>
              
              <div className="p-14 pt-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-4 space-y-12">
                    <section className="space-y-8">
                      <h5 className="text-base font-black text-blue-600 uppercase tracking-[0.3em] mb-6 border-b pb-4 inline-block">Severity Classification</h5>
                      <div className="grid grid-cols-1 gap-4">
                        {(['Major', 'Minor', 'OFI'] as const).map(type => (
                          <button 
                            key={type} 
                            type="button"
                            onClick={() => setFormData({...formData, type})}
                            className={`py-6 px-8 rounded-[2rem] text-base font-black border transition-all text-left flex items-center justify-between ${
                              formData.type === type 
                              ? 'border-[#3b82f6] bg-blue-50 text-blue-600 ring-8 ring-blue-50' 
                              : 'border-gray-100 bg-white text-gray-400 hover:border-blue-200 shadow-sm'
                            }`}
                          >
                            {type} NC
                            {formData.type === type && <CheckCircle2 size={24} />}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-8">
                      <h5 className="text-base font-black text-blue-600 uppercase tracking-[0.3em] mb-6 border-b pb-4 inline-block">Ownership & Area</h5>
                      <div className="space-y-8">
                        <div>
                          <label className="text-base font-black text-gray-900 uppercase block mb-4 tracking-widest">Process Owner</label>
                          <select 
                            value={formData.auditee}
                            onChange={(e) => setFormData({...formData, auditee: e.target.value})}
                            className="w-full bg-gray-50 border-gray-200 border-2 rounded-[1.5rem] p-6 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-lg"
                          >
                            <option>Bob Johnson (Finance)</option>
                            <option>Charlie Davis (Operations)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-base font-black text-gray-900 uppercase block mb-4 tracking-widest">Finding Area</label>
                          <input 
                            required
                            type="text" 
                            value={formData.area}
                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                            placeholder="e.g. Server Infrastructure" 
                            className="w-full bg-gray-50 border-gray-200 border-2 rounded-[1.5rem] p-6 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-lg" 
                          />
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="lg:col-span-8 space-y-12">
                    <section className="space-y-10">
                      <h5 className="text-base font-black text-blue-600 uppercase tracking-[0.3em] mb-6 border-b pb-4 inline-block">Requirement & Evidence</h5>
                      <div className="space-y-10">
                        <div>
                          <label className="text-base font-black text-gray-900 uppercase block mb-4 tracking-widest">Requirement (Standard / Clause)</label>
                          <input 
                            required
                            type="text" 
                            value={formData.clause}
                            onChange={(e) => setFormData({...formData, clause: e.target.value})}
                            placeholder="e.g. ISO 27001 Clause 8.1" 
                            className="w-full bg-gray-50 border-gray-200 border-2 rounded-[1.5rem] p-8 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-black text-gray-900 text-2xl" 
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div>
                            <label className="text-base font-black text-gray-900 uppercase block mb-4 tracking-widest">Statement of Non-Conformance</label>
                            <textarea 
                              required
                              rows={10} 
                              value={formData.statement}
                              onChange={(e) => setFormData({...formData, statement: e.target.value})}
                              placeholder="Describe the gap clearly..." 
                              className="w-full bg-gray-50 border-gray-200 border-2 rounded-[2rem] p-8 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none resize-none text-lg font-bold leading-relaxed shadow-sm"
                            ></textarea>
                          </div>
                          <div>
                            <label className="text-base font-black text-gray-900 uppercase block mb-4 tracking-widest">Observed Objective Evidence</label>
                            <textarea 
                              required
                              rows={10} 
                              value={formData.evidence}
                              onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                              placeholder="Document physical artifacts or interview notes..." 
                              className="w-full bg-gray-50 border-gray-200 border-2 rounded-[2rem] p-8 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none resize-none text-lg font-bold leading-relaxed shadow-sm"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="p-14 pt-8 flex gap-8 border-t border-gray-50 bg-gray-50/50">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-12 py-8 bg-white border-2 border-gray-200 rounded-[2.5rem] font-black text-gray-500 hover:bg-gray-50 transition-all text-2xl">Discard Finding</button>
                <button type="submit" className="flex-[2] px-12 py-8 bg-[#3b82f6] text-white rounded-[2.5rem] font-black hover:bg-blue-600 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-6 text-2xl">
                  <CheckCircle2 size={40} />
                  Raise NCAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NCARModule;
