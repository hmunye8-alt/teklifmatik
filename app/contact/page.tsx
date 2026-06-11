export default function ContactPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-6 text-3xl font-bold">İletişim</h1>

        <div className="space-y-5 text-zinc-300">
          <p>
            Teklifmatik hakkında soru, öneri veya destek talepleriniz için
            bizimle iletişime geçebilirsiniz.
          </p>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">E-posta</p>
            <p className="mt-1 text-lg font-semibold text-white">
              ugurcelikci@petalmail.com
            </p>
          </div>

          <p className="text-sm text-zinc-500">
            En kısa sürede dönüş yapılacaktır.
          </p>
        </div>
      </div>
    </main>
  );
}