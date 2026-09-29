import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Masuk Admin — CKS"
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "/admin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <div className="mb-6 flex items-center gap-3">
            <img src="/logo-cks.png" alt="CKS" className="h-12 w-12 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">CKS Admin</h1>
              <p className="text-sm text-gray-500">PT Citra Karya Sejati</p>
            </div>
          </div>
          <LoginForm next={next} />
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          Panel administrasi situs — akses terbatas untuk petugas.
        </p>
      </div>
    </div>
  );
}
