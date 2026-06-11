export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-6 text-3xl font-bold">Gizlilik Politikası</h1>

        <div className="space-y-5 text-zinc-300">
          <p>
            Teklifmatik, kullanıcıların profesyonel fiyat teklifleri
            oluşturmasını sağlayan bir web uygulamasıdır.
          </p>

          <h2 className="text-xl font-semibold text-white">
            Toplanan Bilgiler
          </h2>

          <p>
            Kullanıcı hesabı oluştururken e-posta adresi, firma sahibi adı,
            firma bilgileri, logo ve teklif bilgileri saklanabilir.
          </p>

          <h2 className="text-xl font-semibold text-white">
            Bilgilerin Kullanımı
          </h2>

          <p>
            Toplanan bilgiler, kullanıcıya ait firma bilgilerinin ve
            tekliflerin kaydedilmesi, tekrar gösterilmesi ve uygulamanın
            çalışması amacıyla kullanılır.
          </p>

          <h2 className="text-xl font-semibold text-white">
            Üçüncü Taraf Hizmetler
          </h2>

          <p>
            Uygulamada kimlik doğrulama ve veri saklama için Supabase
            kullanılmaktadır. İleride reklam gösterimi için Google AdSense
            gibi üçüncü taraf reklam servisleri kullanılabilir.
          </p>

          <h2 className="text-xl font-semibold text-white">
            Çerezler ve Reklamlar
          </h2>

          <p>
            Reklam servisleri, kullanıcı deneyimini iyileştirmek ve reklam
            performansını ölçmek için çerezler kullanabilir.
          </p>

          <h2 className="text-xl font-semibold text-white">
            İletişim
          </h2>

          <p>
            Gizlilik politikası hakkında sorularınız için site sahibiyle
            iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}