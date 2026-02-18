
import React, { useState, useRef, useEffect } from 'react';
import { AuditPlan, AuditStatus, Role } from '../types';
import { 
  Plus, 
  Calendar, 
  Users, 
  FileText, 
  X, 
  CheckCircle2, 
  Edit3, 
  ChevronRight, 
  Paperclip, 
  FileIcon, 
  Check, 
  ChevronDown 
} from 'lucide-react';
import { USERS } from '../mockData';

interface AuditPlanningProps {
  plans: AuditPlan[];
  setPlans: React.Dispatch<React.SetStateAction<AuditPlan[]>>;
  role: Role;
  onNotify: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

const MultiSelectDropdown = ({ 
  label, 
  options, 
  selected, 
  onChange 
}: { 
  label: string; 
  options: string[]; 
  selected: string[]; 
  onChange: (val: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 border-gray-200 border-2 rounded-xl p-3 flex items-center justify-between cursor-pointer focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all min-h-[48px]"
      >
        <div className="flex flex-wrap gap-1.5">
          {selected.length > 0 ? (
            selected.map(item => (
              <span key={item} className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                {item}
                <X 
                  size={10} 
                  className="cursor-pointer hover:text-blue-900" 
                  onClick={(e) => { e.stopPropagation(); toggleOption(item); }} 
                />
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400 font-bold">Select {label}...</span>
          )}
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map(option => (
            <div 
              key={option}
              onClick={() => toggleOption(option)}
              className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group"
            >
              <span className={`text-sm font-bold ${selected.includes(option) ? 'text-blue-600' : 'text-gray-600'}`}>{option}</span>
              {selected.includes(option) && <Check size={16} className="text-blue-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AuditPlanning: React.FC<AuditPlanningProps> = ({ plans, setPlans, role, onNotify }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    auditors: [] as string[],
    auditees: [] as string[],
    attachmentName: ''
  });

  const isLead = role === 'LEAD_AUDITOR';
  
  const ALL_AUDITORS = USERS.filter(u => u.role === 'AUDITOR' || u.role === 'LEAD_AUDITOR').map(u => u.name);
  const ALL_AUDITEES = USERS.filter(u => u.role === 'AUDITEE').map(u => u.name);

  const updateStatus = (id: string) => {
    if (!isLead) return;
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === AuditStatus.PLANNED ? AuditStatus.ACTUAL : AuditStatus.COMPLETED;
        onNotify(`Status updated to ${nextStatus} for ${p.id}`, 'success');
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleEdit = (plan: AuditPlan) => {
    setEditingId(plan.id);
    setFormData({
      startDate: plan.startDate,
      endDate: plan.endDate,
      auditors: [...plan.auditors],
      auditees: [...plan.auditees],
      attachmentName: plan.attachmentName || ''
    });
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, attachmentName: e.target.files[0].name });
    }
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.auditors.length === 0 || formData.auditees.length === 0) {
      onNotify('Please select at least one auditor and one auditee.', 'warning');
      return;
    }

    if (editingId) {
      setPlans(prev => prev.map(p => p.id === editingId ? {
        ...p,
        startDate: formData.startDate,
        endDate: formData.endDate,
        auditors: formData.auditors,
        auditees: formData.auditees,
        attachmentName: formData.attachmentName
      } : p));
      onNotify('Audit Plan updated successfully.', 'success');
    } else {
      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const newPlan: AuditPlan = {
        id: `AP_${String(plans.length + 1).padStart(6, '0')}_${timestamp}`,
        startDate: formData.startDate || now.toISOString().split('T')[0],
        endDate: formData.endDate || now.toISOString().split('T')[0],
        auditors: formData.auditors,
        auditees: formData.auditees,
        attachmentName: formData.attachmentName || 'No attachment',
        status: AuditStatus.PLANNED,
        isLocked: false,
        createdAt: now.toISOString()
      };
      setPlans(prev => [newPlan, ...prev]);
      onNotify('New Audit Plan created and scheduled.', 'success');
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ 
      startDate: '', 
      endDate: '', 
      auditors: [], 
      auditees: [], 
      attachmentName: '' 
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-gray-900">Audit Schedules</h3>
          <p className="text-base text-gray-500 font-medium">Manage and track your internal audits across departments.</p>
        </div>
        
        {isLead && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-200 text-base"
          >
            <Plus size={24} />
            Create Plan
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-base">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#3b82f6] text-white">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Plan ID</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center">Attachment</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Date Range</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Auditors / Auditees</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter border border-blue-100">{plan.id}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {plan.attachmentName ? (
                       <div className="flex flex-col items-center gap-1 group/file cursor-pointer" onClick={() => onNotify(`Downloading ${plan.attachmentName}`)}>
                         <FileIcon size={20} className="text-blue-500 group-hover/file:scale-110 transition-transform" />
                         <span className="text-[10px] font-bold text-gray-400 truncate max-w-[80px]">{plan.attachmentName}</span>
                       </div>
                    ) : (
                      <span className="text-xs text-gray-300">N/A</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 font-bold">
                      <Calendar size={18} className="text-gray-400" />
                      {plan.startDate} <ChevronRight size={14} className="text-gray-300" /> {plan.endDate}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start gap-1.5 text-xs text-blue-600 font-black uppercase">
                        <Users size={14} className="mt-0.5 flex-shrink-0" />
                        <span>Ar: {plan.auditors.join(', ')}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-gray-500 font-bold uppercase">
                        <Users size={14} className="mt-0.5 flex-shrink-0" />
                        <span>Ae: {plan.auditees.join(', ')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-xs font-black px-3.5 py-1.5 rounded-full uppercase border ${
                      plan.status === AuditStatus.PLANNED ? 'bg-gray-50 text-gray-500 border-gray-200' :
                      plan.status === AuditStatus.ACTUAL ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-green-50 text-green-600 border-green-200'
                    }`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onNotify(`Viewing audit trail for ${plan.id}`)}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                        title="Audit Trail"
                      >
                        <FileText size={22} />
                      </button>
                      {isLead && (
                        <>
                          <button 
                            onClick={() => handleEdit(plan)}
                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                            title="Edit Plan"
                          >
                            <Edit3 size={22} />
                          </button>
                          {plan.status !== AuditStatus.COMPLETED && (
                            <button 
                              onClick={() => updateStatus(plan.id)}
                              className="bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                            >
                              {plan.status === AuditStatus.PLANNED ? 'Activate' : 'Complete'}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleSavePlan}>
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-[#3b82f6] p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tight">{editingId ? 'Update Audit Plan' : 'New Audit Schedule'}</h4>
                    <p className="text-sm text-gray-500 font-medium">{editingId ? `Editing plan details for ${editingId}` : 'Set timeline and assign responsibilities.'}</p>
                  </div>
                </div>
                <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-900 bg-gray-50 p-2 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Start Date</label>
                    <input 
                      required
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 border-2 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">End Date</label>
                    <input 
                      required
                      type="date" 
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 border-2 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none font-bold text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MultiSelectDropdown 
                    label="Auditors" 
                    options={ALL_AUDITORS} 
                    selected={formData.auditors} 
                    onChange={(val) => setFormData({...formData, auditors: val})} 
                  />
                  <MultiSelectDropdown 
                    label="Auditees" 
                    options={ALL_AUDITEES} 
                    selected={formData.auditees} 
                    onChange={(val) => setFormData({...formData, auditees: val})} 
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Attachment (Scope/Checklist)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="audit-file-upload"
                    />
                    <label 
                      htmlFor="audit-file-upload"
                      className="flex items-center justify-center gap-3 w-full bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-2xl p-6 cursor-pointer group-hover:bg-blue-100/50 group-hover:border-blue-400 transition-all"
                    >
                      <Paperclip size={20} className="text-blue-500" />
                      <div className="text-left">
                        <p className="text-sm font-black text-blue-900">{formData.attachmentName || 'Click to upload audit files'}</p>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">PDF, DOCX or ZIP up to 10MB</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <button type="button" onClick={closeModal} className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all text-sm">Discard</button>
                  <button type="submit" className="flex-[1.5] px-6 py-3.5 bg-[#3b82f6] text-white rounded-2xl font-black hover:bg-blue-600 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 text-sm">
                    <CheckCircle2 size={20} />
                    {editingId ? 'Save Changes' : 'Create Schedule'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPlanning;
