import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  UserCheck, 
  Download, 
  CreditCard, 
  PlusCircle, 
  HeartHandshake, 
  FileCheck,
  Hospital,
  AlertCircle,
  X as CloseIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ActivePlansView({ onNavigateToPlans, onOpenAuth }) {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimForm, setClaimForm] = useState({
    hospitalName: 'Apollo Speciality Hospital, Mumbai',
    diagnosis: 'Acute Gastroenteritis',
    admissionDate: new Date().toISOString().split('T')[0],
    estimatedAmount: 45000,
  });

  useEffect(() => {
    if (user) {
      fetchMyPolicies();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyPolicies = async () => {
    try {
      const res = await fetch('/api/plans/user/my-policies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('arogya_token')}`,
        },
      });
      const data = await res.json();
      if (data.success && data.policies) {
        setPolicies(data.policies);
      }
    } catch (err) {
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setClaimModalOpen(false);
    }, 2800);
  };

  if (!user) {
    return (
      <div className="py-12 container text-center">
        <div className="glass-card max-w-md mx-auto p-8 flex-center-col">
          <ShieldCheck size={56} className="text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">My Active Health Policies</h2>
          <p className="text-muted text-sm mb-6">
            Please sign in to access your digital health cards, active policies, and claim tracking.
          </p>
          <button className="btn btn-primary w-full py-3" onClick={onOpenAuth}>
            Sign In to Arogya Kavaj
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="active-plans-view py-6">
      <div className="container">
        {/* Header */}
        <div className="flex-between mb-6 flex-wrap gap-4">
          <div>
            <div className="badge mb-1">
              <ShieldCheck size={14} /> Arogya Policyholder Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              My Active <span className="gradient-text">Policies</span>
            </h1>
            <p className="text-muted text-sm">
              Manage your coverage, download digital cashless cards, and track cashless hospitalizations.
            </p>
          </div>
          <button
            className="btn btn-outline py-2 px-4 text-sm"
            onClick={onNavigateToPlans}
          >
            <PlusCircle size={16} />
            <span>Add Additional Coverage</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted">Loading your policies...</div>
        ) : policies.length === 0 ? (
          <div className="glass-card p-8 text-center max-w-lg mx-auto">
            <ShieldCheck size={48} className="text-primary mx-auto mb-3 opacity-60" />
            <h3 className="text-xl font-bold mb-2">No Active Health Policies Yet</h3>
            <p className="text-sm text-muted mb-6">
              You haven't purchased or activated a policy yet. Browse our top-rated IRDAI approved health plans or use the AI Predictor to find your ideal fit.
            </p>
            <button className="btn btn-primary" onClick={onNavigateToPlans}>
              Explore Medical Plans
            </button>
          </div>
        ) : (
          <div className="policies-grid">
            {policies.map((policy) => {
              const startDate = new Date(policy.startDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              const expiryDate = new Date(policy.expiryDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div key={policy._id || policy.policyNumber} className="policy-card glass-card p-6">
                  {/* Top Policy Bar */}
                  <div className="flex-between mb-4 border-b border-subtle pb-4 flex-wrap gap-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted font-bold block">
                        POLICY NUMBER
                      </span>
                      <strong className="text-lg text-primary tracking-wider">
                        {policy.policyNumber}
                      </strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="active-dot pulse-glow"></span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        {policy.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Policy Body */}
                  <div className="policy-details-body mb-5">
                    <h3 className="text-xl font-bold mb-1">{policy.planTitle}</h3>
                    <p className="text-xs text-secondary mb-4">
                      Tier: <strong>{policy.tier}</strong> • Sum Insured: <strong className="text-primary">{policy.sumInsured}</strong>
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-surface p-3 rounded-lg border border-subtle mb-4">
                      <div>
                        <span className="text-muted block">Effective Date</span>
                        <strong className="text-white">{startDate}</strong>
                      </div>
                      <div>
                        <span className="text-muted block">Renewal Date</span>
                        <strong className="text-white">{expiryDate}</strong>
                      </div>
                    </div>

                    {/* Insured Member Details */}
                    {policy.insuredMembers && policy.insuredMembers.length > 0 && (
                      <div className="insured-members-list mb-3">
                        <span className="text-xs text-muted block mb-1 font-semibold">INSURED MEMBERS</span>
                        {policy.insuredMembers.map((m, idx) => (
                          <div key={idx} className="flex-between text-xs py-1">
                            <span className="font-medium text-white">{m.name}</span>
                            <span className="text-secondary">{m.relation} • {m.age} yrs</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="policy-actions-grid pt-3 border-t border-subtle flex gap-2">
                    <button
                      className="btn btn-secondary flex-1 py-2 text-xs"
                      onClick={() => alert(`Downloading Digital Health ID Card for ${policy.policyNumber}...`)}
                    >
                      <Download size={14} />
                      <span>Health Card</span>
                    </button>
                    <button
                      className="btn btn-primary flex-1 py-2 text-xs"
                      onClick={() => setClaimModalOpen(true)}
                    >
                      <Hospital size={14} />
                      <span>File Cashless Claim</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Claim Notice Modal */}
        {claimModalOpen && (
          <div className="modal-backdrop">
            <div className="modal-content glass-card p-6 max-w-md w-full animate-fade-in relative">
              <button
                className="modal-close-btn"
                onClick={() => setClaimModalOpen(false)}
              >
                <CloseIcon size={20} />
              </button>

              {claimSuccess ? (
                <div className="text-center py-6">
                  <FileCheck size={56} className="text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-1">Cashless Intimation Sent!</h3>
                  <p className="text-sm text-muted mb-4">
                    Our 24x7 cashless medical desk has notified the hospital TPA. A representative will coordinate directly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="modal-header mb-4">
                    <span className="badge mb-1">
                      <Hospital size={12} /> 24x7 Cashless Desk
                    </span>
                    <h3 className="text-xl font-bold">Initiate Cashless Claim</h3>
                    <p className="text-xs text-muted">
                      Pre-authorize cashless admission at any of our 11,200+ partner network hospitals.
                    </p>
                  </div>

                  <form onSubmit={handleClaimSubmit}>
                    <div className="form-group mb-3">
                      <label className="form-label">Network Hospital Name & City</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={claimForm.hospitalName}
                        onChange={(e) => setClaimForm({ ...claimForm, hospitalName: e.target.value })}
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="form-label">Diagnosis / Treatment Purpose</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={claimForm.diagnosis}
                        onChange={(e) => setClaimForm({ ...claimForm, diagnosis: e.target.value })}
                      />
                    </div>

                    <div className="form-grid-2col mb-4">
                      <div className="form-group">
                        <label className="form-label">Planned Admission Date</label>
                        <input
                          type="date"
                          required
                          className="form-input"
                          value={claimForm.admissionDate}
                          onChange={(e) => setClaimForm({ ...claimForm, admissionDate: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Est. Expense (₹)</label>
                        <input
                          type="number"
                          required
                          className="form-input"
                          value={claimForm.estimatedAmount}
                          onChange={(e) => setClaimForm({ ...claimForm, estimatedAmount: e.target.value })}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full py-3">
                      Send Instant Cashless Request
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
