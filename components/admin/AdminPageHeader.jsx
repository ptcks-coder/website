/**
 * Header halaman admin yang konsisten (judul + deskripsi + slot aksi).
 * Dipakai di semua halaman kustom agar tampilan seragam.
 */
export default function AdminPageHeader({ title, description, children }) {
  return (
    <div className="ck-page-head">
      <div>
        <h1 className="ck-page-title">{title}</h1>
        {description ? <p className="ck-page-desc">{description}</p> : null}
      </div>
      {children ? <div className="ck-page-actions">{children}</div> : null}
    </div>
  );
}
