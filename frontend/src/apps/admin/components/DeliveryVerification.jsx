import React, { useState } from 'react'
import {
  CheckCircle,
  Clock3,
  Download,
  ExternalLink,
  MapPin,
  Phone,
  Bike,
  UserRound,
  X,
  XCircle,
  ArrowLeft,
  IdCard,
  Mail,
  Calendar,
  CreditCard,
  FileText,
  Shield,
  Briefcase,
  Car,
  User,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react'

// PURE DUMMY DATA FOR UI ONLY
const DUMMY_APPROVALS = [
  {
    id: 'del-1',
    name: 'Rahul Sharma',
    mobile: '+91 9876543210',
    email: 'rahul.sharma@example.com',
    dob: '1995-08-15',
    city: 'Mumbai',
    permanentAddress: '102, Sunshine Apartments, Andheri West, Mumbai, Maharashtra 400053',
    experience: '2',
    nearestStation: 'Andheri West',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'MH-12-AB-1234',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '123456789012',
    drivingLicenseNumber: 'DL-1420110012345',
    bankName: 'HDFC Bank',
    accountHolderName: 'Rahul Sharma',
    accountNumber: '50100234567890',
    ifscCode: 'HDFC0001234',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    documents: {
      photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80',
      idProof: 'https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?w=400&q=80',
      license: 'https://images.unsplash.com/photo-1579562413550-93a8d11db845?w=400&q=80',
    }
  },
  {
    id: 'del-2',
    name: 'Amit Kumar',
    mobile: '+91 8765432109',
    email: 'amit.kumar@example.com',
    dob: '1998-11-20',
    city: 'Mumbai',
    permanentAddress: 'Row House 4, Bandra East, Mumbai, Maharashtra 400051',
    experience: '1',
    nearestStation: 'Bandra East',
    vehicleType: 'Electric Scooter',
    vehicleNumber: 'MH-02-XY-9876',
    panNumber: 'XYZAQ9876M',
    aadhaarNumber: '987654321098',
    drivingLicenseNumber: 'DL-0420150098765',
    bankName: 'ICICI Bank',
    accountHolderName: 'Amit Kumar',
    accountNumber: '00012456789',
    ifscCode: 'ICIC0000001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    documents: {
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      idProof: 'https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?w=400&q=80',
      license: 'https://images.unsplash.com/photo-1579562413550-93a8d11db845?w=400&q=80',
    }
  }
]

const surfaceShellCls = 'rounded-[22px] border border-[rgba(249,115,22,0.18)] bg-white shadow-[0_4px_24px_rgba(249,115,22,0.03)]'

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const maskAadhaar = (value) => {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `XXXX-XXXX-${value.slice(-4)}`;
};

const maskAccount = (value) => {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `${"X".repeat(value.length - 4)}${value.slice(-4)}`;
};

// COMPONENT PRIMITIVES
function Section({ title, icon, children, compact = false }) {
  return (
    <div className="bg-white rounded-[20px] border border-[rgba(249,115,22,0.25)] shadow-[0_4px_16px_rgba(249,115,22,0.03)] overflow-hidden h-full">
      <div className="px-5 py-3 border-b border-[rgba(249,115,22,0.15)] flex items-center gap-1 bg-[linear-gradient(180deg,#fffaf4,#fff7f0)]">
        {icon}
        <h3 className="text-[14px] font-extrabold text-[var(--theme-text-strong)]">{title}</h3>
      </div>
      <div
        className={`${compact ? 'p-3' : 'p-5'} grid grid-cols-1 sm:grid-cols-2 ${compact ? "gap-y-4 gap-x-4" : "gap-y-5 gap-x-6"
          }`}
      >
        {children}
      </div>
    </div>
  );
}

function MiniCard({ icon, label, value }) {
  return (
    <div className="rounded-[16px] border border-[rgba(249,115,22,0.2)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-3.5 py-3 min-w-[110px] shadow-[0_4px_12px_rgba(249,115,22,0.04)] transition-transform hover:-translate-y-0.5">
      <p className="text-[10px] text-[var(--theme-muted)] flex items-center gap-1 font-bold uppercase tracking-[0.15em]">
        <span className="text-[#f97316] opacity-80">{icon}</span>
        {label}
      </p>
      <p className="text-[14px] font-medium text-[var(--theme-text-strong)] mt-1.5">{value || "-"}</p>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
        {icon ? <span className="text-slate-400">{icon}</span> : null}
        {label}
      </p>
      <p className="text-[14px] font-medium text-[var(--theme-text)] break-words leading-snug">{value || "-"}</p>
    </div>
  );
}

function QueueItem({ approval, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${isSelected
        ? 'border-[var(--theme-accent)] bg-[linear-gradient(180deg,#fffcf9,#fff7f0)] shadow-[0_8px_20px_rgba(249,115,22,0.08)]'
        : 'border-[rgba(249,115,22,0.15)] bg-white hover:bg-[#fffdfa] hover:border-[rgba(249,115,22,0.3)]'
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold text-[var(--theme-text-strong)]">{approval.name}</p>
          <p className="mt-1 text-[11px] text-[var(--theme-accent)] uppercase font-bold tracking-widest">
            {approval.vehicleType}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isSelected
            ? 'bg-[#fff6ef] border-[rgba(249,115,22,0.2)] text-[var(--theme-accent)]'
            : 'bg-white border-slate-200 text-slate-500'
            }`}
        >
          Wait
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={13} className="text-[var(--theme-accent)] opacity-70" />
          {approval.city}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={13} className="text-[var(--theme-accent)] opacity-70" />
          {formatDate(approval.createdAt)}
        </span>
      </div>
    </button>
  )
}

function ImageCard({ label, imageUrl, alt, onOpen }) {
  return (
    <div className="rounded-[16px] border border-[rgba(249,115,22,0.25)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] p-2 shadow-[0_4px_16px_rgba(249,115,22,0.03)]">
      <div className="flex items-center justify-between px-1">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#f97316]">
            {label}
          </p>
        </div>
        <a
          href={imageUrl}
          download="document_file.jpg"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-[rgba(249,115,22,0.15)] bg-[var(--theme-accent-soft)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--theme-accent)] transition hover:bg-white"
        >
          <Download size={10} />
          Save
        </a>
      </div>

      <button
        type="button"
        onClick={() => onOpen({ label, imageUrl, fileName: 'document_file.jpg', alt })}
        className="group mt-1 block w-full overflow-hidden rounded-[12px] bg-[#fffcf9] border border-[rgba(249,115,22,0.12)] hover:border-[#f97316]/40 transition"
      >
        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-[12px]">
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover p-1 transition duration-300 group-hover:scale-[1.03]"
          />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-bold text-[var(--theme-text-strong)] shadow-[0_12px_24px_rgba(249,115,22,0.15)] opacity-0 transition duration-300 group-hover:opacity-100">
            <ExternalLink size={12} />
            View
          </span>
        </div>
      </button>
    </div>
  )
}

// MAIN COMPONENT
function DeliveryVerification({ onBack }) {
  const [selectedId, setSelectedId] = useState(DUMMY_APPROVALS[0]?.id || '')
  const [previewImage, setPreviewImage] = useState(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  const selectedApproval = DUMMY_APPROVALS.find((item) => item.id === selectedId) || null

  return (
    <>
      <section className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)] items-start">
        {/* Left Side Queue */}
        <div className={`${surfaceShellCls} p-0 sticky top-20`}>
          <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-5 border-b border-[rgba(249,115,22,0.12)] bg-[#fffaf4] rounded-t-[22px]">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onBack}
                className="h-8 w-8 rounded-lg border border-[rgba(249,115,22,0.15)] bg-white text-[var(--theme-muted)] flex items-center justify-center transition-all hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]"
              >
                <ArrowLeft size={16} />
              </button>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-strong)]">
                Queue
              </p>
            </div>
            <span className="rounded-full border border-[rgba(249,115,22,0.2)] bg-white px-2.5 py-1 text-[10px] font-bold text-[var(--theme-accent)]">
              {DUMMY_APPROVALS.length} wait
            </span>
          </div>

          <div className="px-4 pb-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {DUMMY_APPROVALS.length ? (
                DUMMY_APPROVALS.map((approval) => (
                  <QueueItem
                    key={approval.id}
                    approval={approval}
                    isSelected={selectedApproval?.id === approval.id}
                    onSelect={() => setSelectedId(approval.id)}
                  />
                ))
              ) : (
                <div className="rounded-[16px] border border-[rgba(249,115,22,0.15)] bg-slate-50 p-5 text-center">
                  <p className="text-[14px] font-semibold text-slate-600">Queue clear</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="flex flex-col flex-1 min-w-0 h-full">
          {selectedApproval ? (
            <div className="rounded-[28px] bg-[#ffffff] border border-[rgba(249,115,22,0.18)] shadow-[0_12px_40px_rgba(249,115,22,0.06)] overflow-hidden pb-4">
              {/* Profile Header Banner */}
              <div className="h-28 bg-[linear-gradient(135deg,#1e293b,#0f172a)] relative z-0"></div>

              <div className="px-3 md:px-4 -mt-12 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 bg-white rounded-2xl p-4 shadow-[0_4px_24px_rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.15)]">
                  {/* Photo and Titles */}
                  <div className="flex items-center gap-5">
                    <div className="relative group shrink-0">
                      <img
                        src={selectedApproval.documents.photo}
                        alt="Profile"
                        className="w-[110px] h-[110px] rounded-[22px] object-cover border-[4px] border-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] bg-slate-50"
                      />
                      <a
                        href={selectedApproval.documents.photo}
                        download={`${selectedApproval.name}_profile.jpg`}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[var(--theme-accent)] text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform active:scale-95"
                        title="Download Profile"
                      >
                        <Download size={14} strokeWidth={3} />
                      </a>
                    </div>
                    <div className="pt-2">
                      <h1 className="text-[20px] md:text-[22px] font-black text-[var(--theme-text-strong)] tracking-tight leading-tight">{selectedApproval.name}</h1>
                      <p className="text-[13px] font-bold text-slate-500 mt-0.5">{selectedApproval.email}</p>
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 border rounded-lg text-[9px] font-black uppercase tracking-[0.2em] bg-red-50 text-red-600 border-red-100">
                        <BadgeCheck size={12} strokeWidth={3} />
                        Under Review
                      </div>
                    </div>
                  </div>

                  {/* Actions / Mini Stats */}
                  <div className="flex flex-col items-end gap-4 w-full lg:w-auto mt-2 lg:mt-0">
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setIsRejectModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-[14px] border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-extrabold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm"
                      >
                        <XCircle size={15} />
                        Reject
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-[14px] bg-[linear-gradient(135deg,#f97316,#ea580c)] px-6 py-2.5 text-[13px] font-extrabold text-white shadow-[0_8px_16px_rgba(234,88,12,0.25)] hover:brightness-110 transition"
                      >
                        <CheckCircle size={15} />
                        Approve Profile
                      </button>
                    </div>

                    <div className="flex gap-2.5 w-full overflow-x-auto pb-1 custom-scrollbar">
                      <MiniCard icon={<Briefcase size={14} />} label="Applied" value={formatDate(selectedApproval.createdAt)} />
                      <MiniCard icon={<MapPin size={14} />} label="Area" value={selectedApproval.city} />
                      <MiniCard icon={<IdCard size={14} />} label="Exp" value={`${selectedApproval.experience} Yrs`} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="xl:col-span-2 grid grid-cols-1 gap-6">
                    <Section title="Personal Details" icon={<User size={16} className="text-[#f97316]" />}>
                      <InfoItem icon={<Phone size={14} />} label="Mobile Number" value={selectedApproval.mobile} />
                      <InfoItem icon={<Calendar size={14} />} label="Date of Birth" value={formatDate(selectedApproval.dob)} />
                      <div className="sm:col-span-2">
                        <InfoItem icon={<MapPin size={14} />} label="Permanent Address" value={selectedApproval.permanentAddress} />
                      </div>
                    </Section>

                    <Section title="Bank Information" icon={<CreditCard size={16} className="text-[#f97316]" />}>
                      <InfoItem label="Bank Name" value={selectedApproval.bankName} />
                      <InfoItem label="Account Holder" value={selectedApproval.accountHolderName} />
                      <InfoItem label="Account Number" value={maskAccount(selectedApproval.accountNumber)} />
                      <InfoItem label="IFSC Code" value={selectedApproval.ifscCode} />
                    </Section>

                    <Section title="Vehicle & Licensing" icon={<Car size={16} className="text-[#f97316]" />} compact>
                      <InfoItem label="Vehicle Type" value={selectedApproval.vehicleType} />
                      <InfoItem label="Vehicle Number" value={selectedApproval.vehicleNumber} />
                      <InfoItem label="Aadhaar" value={maskAadhaar(selectedApproval.aadhaarNumber)} />
                      <InfoItem label="Driving Licence" value={selectedApproval.drivingLicenseNumber} />
                    </Section>
                  </div>

                  {/* Right Column */}
                  <div className="grid grid-cols-1 gap-6 h-fit">
                    <Section title="Required Proofs" icon={<FileText size={16} className="text-[#f97316]" />} compact>
                      <div className="col-span-1 sm:col-span-2 space-y-3 px-1">
                        <ImageCard label="ID Proof" imageUrl={selectedApproval.documents.idProof} alt="Rider ID proof" onOpen={setPreviewImage} />
                        <ImageCard label="Current License" imageUrl={selectedApproval.documents.license} alt="Driving License" onOpen={setPreviewImage} />
                      </div>
                    </Section>

                    <div className="rounded-[20px] border border-[rgba(249,115,22,0.25)] bg-[linear-gradient(135deg,#ffffff,#fffcf9)] p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[rgba(249,115,22,0.15)] shadow-sm flex items-center justify-center shrink-0">
                          <Shield size={18} className="text-[#f97316]" />
                        </div>
                        <div>
                          <h3 className="text-[14px] font-extrabold text-slate-800">Verification Integrity</h3>
                          <p className="text-[12px] text-slate-600 mt-1.5 leading-relaxed font-bold">
                            Cross-check name spellings with uploaded documents carefully before approval.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${surfaceShellCls} flex flex-1 items-center justify-center p-6 text-center h-full min-h-[420px]`}>
              <p className="text-slate-500 font-bold">Queue is clear</p>
            </div>
          )}
        </div>
      </section>

      {/* Image Preview Modal (UI Only) */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-[28px] border border-[rgba(249,115,22,0.3)] bg-white p-4 shadow-[0_24px_60px_rgba(249,115,22,0.1)] sm:p-5">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-[#f97316] hover:bg-[#fff9f4] hover:border-[#f97316]/30"
            >
              <X size={18} />
            </button>
            <div className="mb-4 pr-14">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                {previewImage.label}
              </p>
              <p className="mt-1.5 truncate text-lg font-black text-slate-900">
                {previewImage.fileName}
              </p>
            </div>
            <div className="overflow-hidden rounded-[20px] bg-slate-100 flex justify-center py-4 border border-[rgba(249,115,22,0.1)]">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.alt}
                className="max-h-[70vh] max-w-full object-contain drop-shadow-md rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal (UI Only) */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-red-200 bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-600">
                  Reject rider profile
                </p>
                <h3 className="mt-2.5 text-2xl font-black text-slate-900">
                  Reason for rejection
                </h3>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6">
              <label className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-600">
                Rejection Note
              </label>
              <textarea
                rows={5}
                placeholder="Briefly describe what needs to be fixed..."
                className="mt-2.5 w-full rounded-[16px] border border-slate-200 bg-[#fafcfd] px-5 py-4 text-sm font-medium leading-relaxed outline-none transition focus:border-red-300 focus:bg-white shadow-inner"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-[14px] font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="rounded-[14px] bg-red-600 px-6 py-3 text-[14px] font-extrabold text-white shadow-md transition hover:bg-red-700"
              >
                Mark as Rejected
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeliveryVerification
