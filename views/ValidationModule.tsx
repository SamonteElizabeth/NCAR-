
import React, { useState } from 'react';
import { NCAR, ActionPlan, NCARStatus, Role } from '../types';
import { ShieldCheck, XCircle, CheckCircle2, FileText, User, ChevronRight, ArrowUpRight } from 'lucide-react';

interface ValidationModuleProps {
  ncars: NCAR[];
  actionPlans: ActionPlan[];
  setNcars: React.Dispatch<React.SetStateAction<NCAR[]>>;
  role: Role;
  onNotify: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

const ValidationModule: React.FC<ValidationModuleProps> = ({ ncars, actionPlans, setNcars, role, onNotify }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isLead = role === 'LEAD_AUDITOR';

  const pendingValidation = ncars.filter(n => n.status === NCARStatus.ACTION_PLAN_SUBMITTED);

  const handleValidation = (id: string, approve: boolean) => {
    if (!isLead) return;
    const nextStatus = approve ? NCARStatus.CLOSED : NCARStatus.REOPENED;
    setNcars(prev => prev.map(n => n.id === id ? { ...n, status: nextStatus } : n));
    onNotify(approve ? `NCAR ${id} Verified & Closed.` : `NCAR ${id} Reopened for Correction.`, approve ? 'success' : 'warning');
    setSelectedId(null);
  };

  const getActionPlan = (ncarId: string) => {
    return actionPlans.find(ap => ap.ncarId === ncarId);
  };

  return (
    <div className="space-y-10 text-base">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-4xl font-black text-gray-900 tracking-tight">Validation Queue</h3>
          <p className="text-lg text-gray-500 font-medium mt-1">Review implementation evidence and close verified findings.</p>
        </div>
        <div className="bg-blue-50 px-8 py-4 rounded-2xl border border-blue-100 flex items-center gap-4">
          <div className="w-4 h-4 bg-[#3b82f6] rounded-full animate-pulse"></div>
          <span className="text-base font-black text-blue-700 uppercase tracking-widest">{pendingValidation.length} To Validate</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#3b82f6] text-white">
                <th className="px-8 py-7 text-xs font-black uppercase tracking-widest">ID</th>
                <th className="px-8 py-7 text-xs font-black uppercase tracking-widest">Implementation Details</th>
                <th className="px-8 py-7 text-xs font-black uppercase tracking-widest">Owner</th>
                <th className="px-8 py-7 text-xs font-black uppercase tracking-widest text-center">Review</th>
                <th className="px-8 py-7 text-xs font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingValidation.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center">
                      <CheckCircle2 size={64} className="text-green-500 mb-5" />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-lg">Queue is empty</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingValidation.map(n => {
                  const ap = getActionPlan(n.id);
                  return (
                    <tr key={n.id} className="hover:bg-blue-50/20 transition-all">
                      <td className="px-8 py-8 align-top">
                        <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded uppercase border border-blue-100 tracking-wider">{n.id}</span>
                      </td>
                      <td className="px-8 py-8">
                        <p className="font-bold text-gray-900 text-base leading-snug mb-3">{n.requirement}</p>
                        {ap ? (
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Corrective Strategy</p>
                            <p className="text-sm text-gray-600 line-clamp-2 font-medium italic">"{ap.correctiveAction}"</p>
                          </div>
                        ) : <span className="text-xs text-red-400 font-black uppercase">Plan Missing</span>}
                      </td>
                      <td className="px-8 py-8 align-top">
                        <div className="flex items-center gap-3 text-sm font-black text-gray-700">
                          <User size={18} className="text-gray-400" />
                          {n.auditee}
                        </div>
                        <div className="text-xs font-bold text-gray-400 mt-1.5 uppercase tracking-tighter">{n.area}</div>
                      </td>
                      <td className="px-8 py-8 text-center align-top">
                        <button 
                          onClick={() => setSelectedId(selectedId === n.id ? null : n.id)}
                          className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-1.5 mx-auto"
                        >
                          {selectedId === n.id ? 'Collapse' : 'Inspect'} <ChevronRight size={18} className={selectedId === n.id ? 'rotate-90' : ''} />
                        </button>
                      </td>
                      <td className="px-8 py-8 text-center align-top">
                        {isLead && (
                          <div className="flex items-center justify-center gap-4">
                            <button 
                              onClick={() => handleValidation(n.id, false)}
                              className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                              title="Reject Implementation"
                            >
                              <XCircle size={28} />
                            </button>
                            <button 
                              onClick={() => handleValidation(n.id, true)}
                              className="p-3 text-green-600 hover:bg-green-50 rounded-2xl transition-all border border-transparent hover:border-green-100"
                              title="Approve & Close"
                            >
                              <ShieldCheck size={28} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedId && (
        <div className="bg-white rounded-[3rem] border-4 border-blue-100 p-12 animate-in slide-in-from-right duration-500 shadow-2xl">
          {(() => {
            const n = ncars.find(nc => nc.id === selectedId);
            const ap = getActionPlan(selectedId);
            if (!n || !ap) return null;
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-[#3b82f6] p-3 rounded-2xl text-white shadow-lg shadow-blue-200"><FileText size={28} /></div>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tight">Full Evidence Review</h4>
                  </div>
                  <div>
                    <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Finding Statement</h6>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-base text-gray-600 italic font-medium leading-relaxed">
                      "{n.statement}"
                    </div>
                  </div>
                  <div>
                    <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Root Cause Analysis</h6>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-base text-gray-700 font-bold leading-relaxed shadow-sm">
                      {ap.rootCause}
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                   <div>
                    <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Implementation Summary</h6>
                    <div className="bg-blue-50 p-7 rounded-3xl border border-blue-100 text-base text-blue-900 font-black leading-relaxed shadow-sm">
                      {ap.correctiveAction}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Submitted By</h6>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-black text-gray-800 uppercase tracking-tight">{ap.responsiblePerson}</div>
                    </div>
                    <div>
                      <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Date Verified</h6>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-black text-gray-800 uppercase tracking-tight">{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="pt-6">
                    <button className="w-full py-6 border-2 border-dashed border-blue-200 rounded-2xl text-blue-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-50 transition-all shadow-sm">
                      <ArrowUpRight size={18} /> Download Implementation Artifacts (ZIP)
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ValidationModule;
