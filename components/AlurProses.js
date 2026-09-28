/**
 * Infografis alur penempatan CPMI — orisinal CKS (SVG/CSS biru-putih).
 * Bukan aset/watermark kompetitor; langkah mengikuti alur umum penempatan.
 */

function Icon({ children, label }) {
  return (
    <span className="flow-icon" aria-hidden="true" title={label}>
      <svg viewBox="0 0 40 40" width="28" height="28" focusable="false">
        {children}
      </svg>
    </span>
  );
}

const ICONS = {
  start: (
    <Icon label="Job Order">
      <rect x="8" y="10" width="24" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16h16M12 21h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="26" r="3" fill="currentColor" />
    </Icon>
  ),
  monitor: (
    <Icon label="Online">
      <rect x="6" y="8" width="28" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M14 32h12M20 26v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  ),
  docs: (
    <Icon label="Dokumen">
      <path
        d="M12 8h12l6 6v16a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M24 8v6h6M14 20h12M14 25h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  ),
  portal: (
    <Icon label="Portal">
      <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 20h24M20 8c4 4 4 20 0 24M20 8c-4 4-4 20 0 24" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </Icon>
  ),
  people: (
    <Icon label="Rekrutmen">
      <circle cx="14" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="26" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M6 30c1.5-5 5-7 8-7s6.5 2 8 7M18 30c1.5-5 5-7 8-7s6.5 2 8 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Icon>
  ),
  interview: (
    <Icon label="Interview">
      <circle cx="20" cy="13" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 32c1-7 5-10 10-10s9 3 10 10" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M28 10l4-2M28 16l5 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  ),
  medical: (
    <Icon label="Medical">
      <rect x="10" y="8" width="20" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 14v12M14 20h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </Icon>
  ),
  idcard: (
    <Icon label="ID & dokumen">
      <rect x="6" y="10" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="18" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 16h10M20 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  ),
  passport: (
    <Icon label="Paspor">
      <rect x="10" y="6" width="20" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="18" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 28h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  ),
  laptop: (
    <Icon label="FWCMS">
      <rect x="7" y="9" width="26" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M4 29h32l-3-4H7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </Icon>
  ),
  send: (
    <Icon label="Kirim">
      <path d="M6 20l28-12-8 28-8-10-12-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 26l10-14" stroke="currentColor" strokeWidth="2" />
    </Icon>
  ),
  visa: (
    <Icon label="Visa">
      <rect x="8" y="8" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="18" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 28h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  ),
  evisa: (
    <Icon label="e-Visa">
      <path d="M6 14l14-6 14 6v14l-14 6-14-6z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16 17h6c2 0 3.5 1.2 3.5 3s-1.5 3-3.5 3h-4v4h-2V17zm2 2v2h4c.9 0 1.5-.5 1.5-1s-.6-1-1.5-1h-4z" fill="currentColor" />
    </Icon>
  ),
  opp: (
    <Icon label="OPP">
      <rect x="6" y="22" width="28" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 22V14l10-6 10 6v8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="16" r="3" fill="currentColor" />
    </Icon>
  ),
  briefing: (
    <Icon label="Briefing">
      <path d="M8 28V12h16l8 6v10H8z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M14 18h8M14 23h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  ),
  plane: (
    <Icon label="Pemberangkatan">
      <path
        d="M6 22l10-2 4-10 3 1-2 9 10 3-1 3-11-1-5 6-3-1 3-7-8-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  ),
  arrive: (
    <Icon label="Kedatangan">
      <path d="M10 28h20M12 28l4-12h8l4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="20" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
    </Icon>
  ),
  company: (
    <Icon label="Perusahaan">
      <path d="M8 32V14l12-6 12 6v18" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16 32V22h8v10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M14 18h2M24 18h2M14 23h2M24 23h2" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  ),
  home: (
    <Icon label="Kepulangan">
      <path d="M8 20l12-10 12 10v12H8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 32V22h6v10" fill="none" stroke="currentColor" strokeWidth="2" />
    </Icon>
  ),
  flag: (
    <Icon label="Indonesia">
      <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 20h24" stroke="currentColor" strokeWidth="2" />
      <path d="M8 16h24" stroke="currentColor" strokeWidth="6" opacity="0.35" />
    </Icon>
  ),
  noBribe: (
    <Icon label="Tanpa suap">
      <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 14c2 4 4 6 8 6s6-2 8-6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 30L30 10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </Icon>
  ),
  antiBias: (
    <Icon label="Anti diskriminasi">
      <circle cx="14" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="26" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 28c2-4 5-5 10-5s8 1 10 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  )
};

function Arrow({ dir = "right" }) {
  const rotate = dir === "left" ? "180" : dir === "down" ? "90" : "0";
  return (
    <span className={`flow-arrow flow-arrow-${dir}`} aria-hidden="true">
      <svg viewBox="0 0 36 16" width="28" height="12" style={{ transform: `rotate(${rotate}deg)` }}>
        <path d="M2 8 H26" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <path d="M24 3 L34 8 L24 13 Z" fill="currentColor" />
      </svg>
    </span>
  );
}

function FlowNode({ icon, title, note, badge, wide, children }) {
  return (
    <article className={`flow-node${wide ? " flow-node-wide" : ""}`}>
      {icon}
      <h4>{title}</h4>
      {note ? <p>{note}</p> : null}
      {badge ? <span className={`flow-badge flow-badge-${badge.tone}`}>{badge.text}</span> : null}
      {children}
    </article>
  );
}

function BranchPair({ ok, bad, recover }) {
  return (
    <div className="flow-branch">
      <span className="flow-badge flow-badge-ok">{ok}</span>
      <span className="flow-badge flow-badge-bad">{bad}</span>
      {recover ? <span className="flow-recover">{recover}</span> : null}
    </div>
  );
}

export default function AlurProses() {
  return (
    <div className="flow-scroll" tabIndex={0} role="region" aria-label="Diagram proses penempatan CPMI CKS">
      <div className="flow-canvas">
        <header className="flow-head">
          <p className="flow-brand">PT Citra Karya Sejati / CKS</p>
          <h3>Proses Penempatan Calon Pekerja Migran Indonesia (CPMI)</h3>
        </header>

        {/* Alur atas: kiri → kanan */}
        <div className="flow-row flow-row-top">
          <FlowNode icon={ICONS.start} title="Start — Pengurusan Job Order" />
          <Arrow />
          <FlowNode icon={ICONS.monitor} title="Penerbitan SIP" note="Online" />
          <Arrow />
          <FlowNode icon={ICONS.docs} title="Pengajuan PKP" note="Online" />
          <Arrow />
          <FlowNode
            icon={ICONS.portal}
            title="Portal SISKOP2MI"
            note="Akun calon & cek lowongan (portal resmi KP2MI)"
            wide
          />
          <Arrow />
          <FlowNode icon={ICONS.people} title="Sosialisasi & Rekrutmen" />
          <Arrow />
          <FlowNode icon={ICONS.interview} title="Test & Interview">
            <BranchPair ok="Accepted" bad="Rejected" recover="Rejected → Recover / Fit kembali ke rekrutmen" />
          </FlowNode>
          <Arrow />
          <FlowNode icon={ICONS.medical} title="Medical Check Up & Psikotes">
            <BranchPair ok="Fit" bad="Unfit" recover="Unfit → Pemulihan Kesehatan" />
          </FlowNode>
          <Arrow />
          <FlowNode
            icon={ICONS.idcard}
            title="Dokumen & ID CPMI"
            note="Asuransi pra · dokumen CPMI · perjanjian penempatan · ID & verifikasi"
            wide
          />
          <Arrow />
          <FlowNode icon={ICONS.passport} title="Pembuatan Paspor" />
          <Arrow />
          <FlowNode icon={ICONS.laptop} title="FWCMS" note="Catatan Malaysia saja" badge={{ text: "MY", tone: "info" }} />
          <Arrow />
          <FlowNode icon={ICONS.send} title="Pengiriman Dokumen" />
        </div>

        <div className="flow-turn" aria-hidden="true">
          <svg viewBox="0 0 40 56" width="40" height="56">
            <path
              d="M20 4 V40 H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <path d="M12 34 L4 40 L12 46" fill="currentColor" />
          </svg>
        </div>

        {/* Alur bawah: kanan → kiri (urutan visual dari kanan) */}
        <div className="flow-row flow-row-bottom">
          <FlowNode icon={ICONS.flag} title="Indonesia" />
          <Arrow dir="left" />
          <FlowNode
            icon={ICONS.home}
            title="Kepulangan Pekerja"
            note="Kontrak selesai / cuti"
          />
          <Arrow dir="left" />
          <FlowNode
            icon={ICONS.company}
            title="User / Perusahaan"
            note="Medical · kerja · perlindungan · kepulangan"
            wide
          />
          <Arrow dir="left" />
          <FlowNode
            icon={ICONS.arrive}
            title="Kedatangan di Negara Penempatan"
            note="Penjemputan & tempat tinggal"
            wide
          />
          <Arrow dir="left" />
          <FlowNode icon={ICONS.plane} title="Pendampingan Pemberangkatan" />
          <Arrow dir="left" />
          <FlowNode icon={ICONS.briefing} title="Briefing" />
          <Arrow dir="left" />
          <FlowNode
            icon={ICONS.opp}
            title="OPP — Orientasi Pra Pemberangkatan"
            note="Asuransi BPJS TK · kontrak · OPP BP3MI · e-KTKLN / e-PMI"
            wide
          />
          <Arrow dir="left" />
          <FlowNode icon={ICONS.evisa} title="Calling / e-Visa" />
          <Arrow dir="left" />
          <FlowNode icon={ICONS.visa} title="Proses Visa" />
        </div>

        <aside className="flow-commit" aria-label="Komitmen CKS">
          <p className="flow-commit-title">Komitmen CKS</p>
          <ul>
            <li>
              {ICONS.noBribe}
              <span>Tanpa suap</span>
            </li>
            <li>
              {ICONS.antiBias}
              <span>Anti diskriminasi</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
