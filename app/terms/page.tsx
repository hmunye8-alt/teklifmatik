export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-6 text-3xl font-bold">Kullanım Şartları</h1>

        <div className="space-y-5 text-zinc-300">
          <p>
            Teklifmatik'i kullanarak aşağıdaki şartları kabul etmiş
            sayılırsınız.
          </p>

          <h2 className="text-xl font-semibold text-white">
            Hizmet Kullanımı
          </h2>

          <p>
            Kullanıcılar sistemi yalnızca yasal amaçlarla kullanabilir.
          </p>

          <h2 className="text-xl font-semibold text-white">
            Hesap Güvenliği
          </h2>

          <p>
            Kullanıcı hesabının güvenliğinden kullanıcı sorumludur.
          </p>

          <h2 className="text-xl font-semibold text-white">
            Sorumluluk Reddi
          </h2>

          <p>
            Teklifmatik üzerinden oluşturulan tekliflerin doğruluğu ve
            ticari sonuçlarından kullanıcı sorumludur.
          </p>

          <h2 className="text-xl font-semibold text-white">
            Hizmet Değişiklikleri
          </h2>

          <p>
            Teklifmatik, hizmetlerini önceden bildirmeksizin değiştirme,
            güncelleme veya sonlandırma hakkını saklı tutar.
          </p>
        </div>
      </div>
    </main>
  );
}