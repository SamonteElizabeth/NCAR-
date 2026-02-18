
import React, { useState } from 'react';
import { NCAR, ActionPlan, NCARStatus, Role } from '../types';
import { CheckCircle, AlertCircle, FileUp, Send, User, Calendar, ClipboardCheck, RotateCcw, ShieldCheck, XCircle, ChevronRight, X } from 'lucide-react';

interface ActionPlanModuleProps {
  ncars: NCAR[];
  actionPlans: ActionPlan[];
  setActionPlans: React.Dispatch<React.SetStateAction<ActionPlan[]>>;
  setNcars: React.Dispatch<React.SetStateAction<NCAR[]>>;
  role: Role;
  onNotify: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

const ActionPlanModule: React.FC<ActionPlanModuleProps> = ({ ncars, actionPlans, setActionPlans, setNcars, role, onNotify }) => {
  const [selectedNCAR, setSelectedNCAR] = useState<NCAR | null>(null);
  const [formData, setFormData] = useState({
    correction: '',
    rootCause: '',
    actionPlan: '',
    responsible: '',
    dueDate: ''
  });
  
  const isLead = role === 'LEAD_AUDITOR';

  const relevantNCARs = isLead 
    ? ncars.filter(n => n.status === NCARStatus.ACTION_PLAN_SUBMITTED)
    : ncars.filter(n => n.status === NCARStatus.OPEN || n.status === NCARStatus.REJECTED || n.status === NCARStatus.REOPENED);

  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNCAR) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newAP: ActionPlan = {
      id: `ACT_${String(actionPlans.length + 1).padStart(6, '0')}_${timestamp}`,
      ncarId: selectedNCAR.id,
      immediateCorrection: formData.correction,
      responsiblePerson: formData.responsible,
      rootCause: formData.rootCause,
      correctiveAction: formData.actionPlan,
      dueDate: formData.dueDate,
      submittedAt: now.toISOString()
    };

    setActionPlans(prev => {
      const filtered = prev.filter(ap => ap.ncarId !== selectedNCAR.id);
      return [...filtered, newAP];
    });

    setNcars(prev => prev.map(n => n.id === selectedNCAR.id ? { ...n, status: NCARStatus.ACTION_PLAN_SUBMITTED } : n));
    setSelectedNCAR(null);
    onNotify(`Action Plan for ${selectedNCAR.id} submitted for Lead Auditor review.`, 'success');
    setFormData({ correction: '', rootCause: '', actionPlan: '', responsible: '', dueDate: '' });
  };

  const handleValidation = (id: string, approve: boolean) => {
    if (!isLead) return;
    const nextStatus = approve ? NCARStatus.CLOSED : NCARStatus.REOPENED;
    setNcars(prev => prev.map(n => n.id === id ? { ...n, status: nextStatus } : n));
    onNotify(approve ? `Plan for ${id} Approved.` : `Plan for ${id} Rejected.`, approve ? 'success' : 'warning');
    setSelectedNCAR(null);
  };

  return (
    <div className="space-y-10 text-base">
      <div>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{isLead ? 'Action Plan Review' : 'Pending Action Plans'}</h3>
        <p className="text-lg text-gray-500 font-medium mt-1">{isLead ? 'Validate strategies submitted by process owners.' : 'Address open non-conformances with corrective strategies.'}</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#3b82f6] text-white">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">NCAR ID</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Requirement / Clause</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {relevantNCARs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-gray-400 font-bold italic text-base">No pending items for this role.</td>
                </tr>
              ) : (
                relevantNCARs.map(n => (
                  <tr key={n.id} className={`hover:bg-blue-50/30 transition-colors ${selectedNCAR?.id === n.id ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter border border-blue-100">{n.id}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-900 text-base line-clamp-1">{n.requirement}</p>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1 block">Clause {n.standardClause}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-xs font-black px-3.5 py-1.5 rounded-full uppercase border ${
                        n.status === NCARStatus.REOPENED ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => setSelectedNCAR(n)}
                        className="text-blue-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 mx-auto hover:underline"
                      >
                        {isLead ? 'Review Plan' : 'Draft Plan'} <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedNCAR && (
        <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-blue-50 overflow-hidden animate-in slide-in-from-bottom duration-300">
          <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div>
              <h4 className="text-3xl font-black text-gray-900">Analysis: {selectedNCAR.id}</h4>
              <p className="text-lg text-gray-500 font-medium mt-1">Detailed breakdown and strategy proposal.</p>
            </div>
            <button onClick={() => setSelectedNCAR(null)} className="p-3 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full transition-all"><X size={32} /></button>
          </div>
          
          <div className="p-12 space-y-12">
            <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 text-blue-600 mb-4 font-black text-sm uppercase tracking-widest">
                <AlertCircle size={22} /> Finding Context
              </div>
              <p className="text-lg text-gray-700 font-medium leading-relaxed italic">"{selectedNCAR.statement}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div>
                  <label className="text-sm font-black text-gray-900 uppercase block mb-4 tracking-widest">Immediate Correction</label>
                  <textarea 
                    readOnly={isLead}
                    required 
                    value={formData.correction}
                    onChange={(e) => setFormData({...formData, correction: e.target.value})}
                    placeholder="Steps taken to contain the issue..." 
                    className="w-full bg-gray-50 border-gray-200 border-2 rounded-2xl p-7 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 min-h-[150px] text-base font-bold leading-relaxed outline-none transition-all shadow-sm"
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm font-black text-gray-900 uppercase block mb-4 tracking-widest">Root Cause (RCA)</label>
                  <textarea 
                    readOnly={isLead}
                    required 
                    value={formData.rootCause}
                    onChange={(e) => setFormData({...formData, rootCause: e.target.value})}
                    placeholder="Analysis of why this gap occurred..." 
                    className="w-full bg-gray-50 border-gray-200 border-2 rounded-2xl p-7 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 min-h-[180px] text-base font-bold leading-relaxed outline-none transition-all shadow-sm"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="text-sm font-black text-gray-900 uppercase block mb-4 tracking-widest">Corrective Action Plan</label>
                  <textarea 
                    readOnly={isLead}
                    required 
                    value={formData.actionPlan}
                    onChange={(e) => setFormData({...formData, actionPlan: e.target.value})}
                    placeholder="Systemic prevention strategy..." 
                    className="w-full bg-gray-50 border-gray-200 border-2 rounded-2xl p-7 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 min-h-[150px] text-base font-bold leading-relaxed outline-none transition-all shadow-sm"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-black text-gray-900 uppercase block mb-4 tracking-widest">Responsible</label>
                    <input 
                      readOnly={isLead}
                      required
                      type="text" 
                      value={formData.responsible}
                      onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 border-2 rounded-2xl p-6 text-base font-bold outline-none shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-black text-gray-900 uppercase block mb-4 tracking-widest">Target Date</label>
                    <input 
                      readOnly={isLead}
                      required
                      type="date" 
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 border-2 rounded-2xl p-6 text-base font-bold outline-none shadow-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
              <button type="button" className="flex items-center gap-3 text-sm font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                <FileUp size={24} /> Attach Evidence
              </button>
              
              <div className="flex gap-6">
                {isLead ? (
                  <>
                    <button 
                      type="button" 
                      onClick={() => handleValidation(selectedNCAR.id, false)}
                      className="flex items-center gap-3 px-10 py-5 bg-white border-2 border-red-100 text-red-600 rounded-[1.5rem] font-black hover:bg-red-50 transition-all uppercase text-base"
                    >
                      <XCircle size={24} /> Reject Plan
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleValidation(selectedNCAR.id, true)}
                      className="flex items-center gap-3 px-10 py-5 bg-[#3b82f6] text-white rounded-[1.5rem] font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all uppercase text-base"
                    >
                      <ShieldCheck size={24} /> Approve Plan
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleSubmitAction}
                    className="flex items-center gap-4 px-12 py-6 bg-[#3b82f6] text-white rounded-[2rem] font-black hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all text-xl"
                  >
                    <Send size={24} /> Submit Action Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPlanModule;
