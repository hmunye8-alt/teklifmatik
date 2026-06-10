"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type OfferItem = {
  title: string;
  quantity: number;
  unitPrice: number;
};

type SavedOffer = {
  id?: string;
  user_id?: string;
  offerNo: string;
  today: string;
  companyLogo: string;
  companyName: string;
  companyPerson: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  clientName: string;
  service: string;
  projectDetail: string;
  items: OfferItem[];
  deliveryTime: string;
  validity: string;
  totalPrice: number;
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const [companyLogo, setCompanyLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyPerson, setCompanyPerson] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [service, setService] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectDetail, setProjectDetail] = useState("");
  const [items, setItems] = useState<OfferItem[]>([
    { title: "", quantity: 1, unitPrice: 0 },
  ]);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [validity, setValidity] = useState("7 gün");

  const [savedOffers, setSavedOffers] = useState<SavedOffer[]>([]);
  const [offerNo, setOfferNo] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const today = new Date().toLocaleDateString("tr-TR");

  const totalPrice = items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0
  );

  const generateOfferNo = (count: number) => {
    const formattedNumber = String(count + 1).padStart(4, "0");
    return `TKL-${new Date().getFullYear()}-${formattedNumber}`;
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setUser(data.session.user);
        await loadProfile(data.session.user.id);
        await loadOffersFromSupabase(data.session.user.id);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
        await loadOffersFromSupabase(session.user.id);
      } else {
        setUser(null);
        setSavedOffers([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return;

    setOwnerName(data.owner_name || "");
    setCompanyLogo(data.company_logo || "");
    setCompanyName(data.company_name || "");
    setCompanyPerson(data.company_person || "");
    setCompanyPhone(data.company_phone || "");
    setCompanyEmail(data.company_email || "");
    setCompanyWebsite(data.company_website || "");
  };

  const loadOffersFromSupabase = async (userId: string) => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    const formattedOffers: SavedOffer[] = (data || []).map((offer) => ({
      id: offer.id,
      user_id: offer.user_id,
      offerNo: offer.offer_no,
      today: offer.today,
      companyLogo: offer.company_logo,
      companyName: offer.company_name,
      companyPerson: offer.company_person,
      companyPhone: offer.company_phone,
      companyEmail: offer.company_email,
      companyWebsite: offer.company_website,
      clientName: offer.client_name,
      service: offer.service,
      projectDetail: offer.project_detail,
      items: offer.items || [],
      deliveryTime: offer.delivery_time,
      validity: offer.validity,
      totalPrice: Number(offer.total_price || 0),
    }));

    setSavedOffers(formattedOffers);
    setOfferNo(generateOfferNo(formattedOffers.length));
  };

  const saveOffer = async () => {
    if (!user) {
      alert("Lütfen giriş yapın.");
      return;
    }

    const offerPayload = {
      user_id: user.id,
      offer_no: offerNo,
      today,
      company_logo: companyLogo,
      company_name: companyName,
      company_person: companyPerson,
      company_phone: companyPhone,
      company_email: companyEmail,
      company_website: companyWebsite,
      client_name: clientName,
      service,
      project_detail: projectDetail,
      items,
      delivery_time: deliveryTime,
      validity,
      total_price: totalPrice,
    };

    if (editingIndex !== null) {
      const currentOffer = savedOffers[editingIndex];

      const replaceOld = window.confirm(
        "Eski teklifin üzerine yazılsın mı?\n\nTamam = Güncelle\nİptal = Yeni teklif olarak kaydet"
      );

      if (replaceOld && currentOffer?.id) {
        const { error } = await supabase
          .from("offers")
          .update(offerPayload)
          .eq("id", currentOffer.id);

        if (error) {
          alert(error.message);
          return;
        }

        await loadOffersFromSupabase(user.id);
        setEditingIndex(null);

        alert("Teklif güncellendi.");
        return;
      }
    }

    const { error } = await supabase.from("offers").insert(offerPayload);

    if (error) {
      alert(error.message);
      return;
    }

    await loadOffersFromSupabase(user.id);
    setEditingIndex(null);

    alert("Teklif kaydedildi.");
  };

  const loadOffer = (offer: SavedOffer, index: number) => {
    setCompanyLogo(offer.companyLogo || "");
    setCompanyName(offer.companyName);
    setCompanyPerson(offer.companyPerson);
    setCompanyPhone(offer.companyPhone);
    setCompanyEmail(offer.companyEmail);
    setCompanyWebsite(offer.companyWebsite);
    setClientName(offer.clientName);
    setService(offer.service);
    setProjectDetail(offer.projectDetail);
    setItems(offer.items);
    setDeliveryTime(offer.deliveryTime);
    setValidity(offer.validity);
    setOfferNo(offer.offerNo);
    setEditingIndex(index);
  };

  const deleteOffer = async (indexToDelete: number) => {
    const offer = savedOffers[indexToDelete];

    if (!offer?.id || !user) return;

    const confirmDelete = window.confirm("Bu teklif silinsin mi?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("offers").delete().eq("id", offer.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadOffersFromSupabase(user.id);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setCompanyLogo(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setService("");
    setClientName("");
    setProjectDetail("");
    setItems([{ title: "", quantity: 1, unitPrice: 0 }]);
    setDeliveryTime("");
    setValidity("7 gün");
    setEditingIndex(null);
    setOfferNo(generateOfferNo(savedOffers.length));
  };

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        owner_name: ownerName,
        company_name: companyName,
        company_person: companyPerson,
        company_phone: companyPhone,
        company_email: companyEmail,
        company_website: companyWebsite,
        company_logo: companyLogo,
      });
    }

    alert("Kayıt başarılı. E-postanı doğrulaman gerekebilir.");
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setUser(data.user);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const saveCompanyProfile = async () => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      owner_name: ownerName,
      company_name: companyName,
      company_person: companyPerson,
      company_phone: companyPhone,
      company_email: companyEmail,
      company_website: companyWebsite,
      company_logo: companyLogo,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Firma bilgileri kaydedildi.");
  };

  const escapeHtml = (value: string) => {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  const downloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = items
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.title || "Hizmet adı")}</td>
            <td>${item.quantity} adet</td>
            <td>${(item.quantity * item.unitPrice).toLocaleString("tr-TR")} TL</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>${offerNo}</title>
          <style>
            * { box-sizing: border-box; }

            @page {
              size: A4;
              margin: 10mm;
            }

            body {
              font-family: Arial, sans-serif;
              color: #18181b;
              margin: 0;
              padding: 0;
              font-size: 12px;
            }

            .top {
              display: flex;
              justify-content: space-between;
              gap: 30px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 14px;
              margin-bottom: 18px;
            }

            .logo {
              width: 56px;
              height: 56px;
              object-fit: contain;
              margin-bottom: 8px;
            }

            h1 {
              font-size: 22px;
              margin: 0 0 6px;
            }

            h2 {
              margin-top: 16px;
              margin-bottom: 6px;
              font-size: 14px;
            }

            p {
              line-height: 1.35;
              margin: 0;
            }

            .muted { color: #52525b; }

            .meta {
              min-width: 190px;
              background: #f4f4f5;
              padding: 12px;
              border-radius: 10px;
              line-height: 1.6;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            th, td {
              border-bottom: 1px solid #ddd;
              padding: 7px;
              text-align: left;
            }

            th { background: #f4f4f5; }

            .total {
              margin-top: 14px;
              background: #18181b;
              color: white;
              padding: 12px;
              font-size: 17px;
              font-weight: bold;
              text-align: right;
              border-radius: 10px;
            }

            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 35px;
              gap: 50px;
              page-break-inside: avoid;
            }

            .signature {
              flex: 1;
              border-top: 1px solid #999;
              padding-top: 8px;
              font-size: 12px;
              color: #52525b;
            }
          </style>
        </head>

        <body>
          <div class="top">
            <div>
              ${companyLogo ? `<img src="${companyLogo}" class="logo" />` : ""}

              <h1>${escapeHtml(companyName || "Firma Adı")}</h1>

              <p class="muted">
                ${escapeHtml(companyPerson || "Yetkili Kişi")}<br/>
                ${escapeHtml(companyPhone || "Telefon")}<br/>
                ${escapeHtml(companyEmail || "E-posta")}<br/>
                ${escapeHtml(companyWebsite || "Web Sitesi")}
              </p>
            </div>

            <div class="meta">
              <strong>Teklif No:</strong> ${escapeHtml(offerNo)}<br/>
              <strong>Tarih:</strong> ${escapeHtml(today)}<br/>
              <strong>Geçerlilik:</strong> ${escapeHtml(validity)}
            </div>
          </div>

          <h1>${escapeHtml(service || "Hizmet Teklifi")}</h1>
          <p class="muted">${escapeHtml(clientName || "Müşteri adı")} için hazırlanmıştır.</p>

          <h2>İş Kapsamı</h2>
          <p>${escapeHtml(projectDetail || "Proje detayı belirtilmedi.")}</p>

          <h2>Teslim Süresi</h2>
          <p>${escapeHtml(deliveryTime || "Belirtilmedi")}</p>

          <h2>Teklif Kalemleri</h2>

          <table>
            <thead>
              <tr>
                <th>Hizmet</th>
                <th>Adet</th>
                <th>Tutar</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div class="total">
            Toplam: ${totalPrice.toLocaleString("tr-TR")} TL
          </div>

          <h2>Ödeme Planı</h2>
          <p>%50 peşin, %50 iş tesliminde alınır.</p>

          <h2>Revize Hakkı</h2>
          <p>Bu teklife 2 revizyon hakkı dahildir.</p>

          <div class="signatures">
            <div class="signature">Firma İmza / Kaşe</div>
            <div class="signature">Müşteri Onayı</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="mb-2 text-3xl font-bold">Teklifmatik</h1>

          <p className="mb-6 text-zinc-400">
            Devam etmek için giriş yap veya kayıt ol.
          </p>

          <div className="space-y-4">
            <input
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
              placeholder="Firma sahibi adı"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />

            <input
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
              placeholder="E-posta"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
              placeholder="Şifre"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />

            <button
              onClick={signIn}
              className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              Giriş Yap
            </button>

            <button
              onClick={signUp}
              className="w-full rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-white hover:bg-zinc-800"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Teklifmatik</h1>
            <p className="mt-3 text-zinc-400">
              30 saniyede profesyonel fiyat teklifi oluştur.
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-zinc-400">Hoş geldiniz,</p>

            <p className="font-semibold">
              {ownerName || companyPerson || user.email}
            </p>

            <button
              onClick={signOut}
              className="mt-3 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Çıkış Yap
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-5 text-xl font-semibold">Teklif Bilgileri</h2>

              <div className="space-y-4">
                <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <h3 className="font-semibold">Firma Bilgileri</h3>

                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Firma Logosu</label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm"
                    />

                    {companyLogo && (
                      <img
                        src={companyLogo}
                        alt="Firma logosu"
                        className="h-16 w-16 rounded-xl bg-white object-contain p-2"
                      />
                    )}
                  </div>

                  <input
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-white"
                    placeholder="Firma Adı"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />

                  <input
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-white"
                    placeholder="Yetkili Kişi"
                    value={companyPerson}
                    onChange={(e) => setCompanyPerson(e.target.value)}
                  />

                  <input
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-white"
                    placeholder="Telefon"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                  />

                  <input
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-white"
                    placeholder="E-posta"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                  />

                  <input
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-white"
                    placeholder="Web Sitesi"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={saveCompanyProfile}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Firma Bilgilerini Kaydet
                  </button>
                </div>

                <input
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
                  placeholder="Müşteri adı"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />

                <input
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
                  placeholder="Hizmet türü"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                />

                <textarea
                  className="min-h-32 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
                  placeholder="Proje detayı"
                  value={projectDetail}
                  onChange={(e) => setProjectDetail(e.target.value)}
                />

                <div className="space-y-3">
                  <h3 className="font-semibold">Teklif Kalemleri</h3>

                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 md:grid-cols-[1fr_70px_110px_42px]"
                    >
                      <input
                        className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 outline-none focus:border-white"
                        placeholder="Hizmet"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].title = e.target.value;
                          setItems(newItems);
                        }}
                      />

                      <input
                        type="number"
                        className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center outline-none focus:border-white"
                        placeholder="Adet"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].quantity = Number(e.target.value);
                          setItems(newItems);
                        }}
                      />

                      <input
                        type="number"
                        className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-center outline-none focus:border-white"
                        placeholder="Fiyat"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].unitPrice = Number(e.target.value);
                          setItems(newItems);
                        }}
                      />

                      <button
                        type="button"
                        disabled={items.length === 1}
                        className="h-full min-h-11 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-bold text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        onClick={() => {
                          setItems(items.filter((_, i) => i !== index));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="rounded-xl bg-zinc-800 px-4 py-2 font-semibold hover:bg-zinc-700"
                    onClick={() =>
                      setItems([
                        ...items,
                        { title: "", quantity: 1, unitPrice: 0 },
                      ])
                    }
                  >
                    + Hizmet Ekle
                  </button>
                </div>

                <input
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
                  placeholder="Teslim süresi: 10 iş günü"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />

                <input
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-white"
                  placeholder="Teklif geçerlilik süresi: 7 gün"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Kaydedilen Teklifler
              </h2>

              {savedOffers.length === 0 ? (
                <p className="text-zinc-400">Henüz kayıtlı teklif yok.</p>
              ) : (
                <div className="space-y-3">
                  {savedOffers.map((offer, index) => (
                    <div
                      key={offer.id || index}
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">
                            {offer.offerNo}
                          </p>

                          <p className="text-sm text-zinc-400">
                            {offer.clientName || "Müşteri belirtilmedi"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-white">
                            {offer.totalPrice.toLocaleString("tr-TR")} TL
                          </p>

                          <p className="text-xs text-zinc-500">{offer.today}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => loadOffer(offer, index)}
                          className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-semibold hover:bg-zinc-700"
                        >
                          Aç
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteOffer(index)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-4">
            <section className="rounded-2xl bg-white p-8 text-zinc-950">
              <p className="mb-8 text-sm text-zinc-500">Fiyat Teklifi</p>

              <div className="mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                {companyLogo && (
                  <img
                    src={companyLogo}
                    alt="Firma logosu"
                    className="mb-3 h-16 w-16 rounded-xl object-contain"
                  />
                )}

                <h3 className="text-lg font-bold">
                  {companyName || "Firma Adı"}
                </h3>

                <p className="text-sm text-zinc-600">
                  {companyPerson || "Yetkili Kişi"}
                </p>

                <div className="mt-2 space-y-1 text-sm text-zinc-600">
                  <p>{companyPhone || "Telefon"}</p>
                  <p>{companyEmail || "E-posta"}</p>
                  <p>{companyWebsite || "Web Sitesi"}</p>
                </div>
              </div>

              <h2 className="mb-2 text-3xl font-bold">
                {service || "Hizmet Teklifi"}
              </h2>

              <p className="mb-4 text-zinc-600">
                {clientName || "Müşteri adı"} için hazırlanmıştır.
              </p>

              <div className="mb-8 grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 p-3">
                  <p className="text-xs text-zinc-400">Teklif No</p>
                  <p className="font-semibold text-zinc-900">{offerNo}</p>
                </div>

                <div className="rounded-xl border border-zinc-200 p-3">
                  <p className="text-xs text-zinc-400">Tarih</p>
                  <p className="font-semibold text-zinc-900">{today}</p>
                </div>

                <div className="rounded-xl border border-zinc-200 p-3">
                  <p className="text-xs text-zinc-400">Geçerlilik</p>
                  <p className="font-semibold text-zinc-900">{validity}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold">İş Kapsamı</h3>
                  <p className="leading-relaxed text-zinc-700">
                    {projectDetail ||
                      "Bu alanda projenin kapsamı ve yapılacak çalışmalar yer alacaktır."}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Teslim Süresi</h3>
                  <p className="text-zinc-700">
                    {deliveryTime || "Belirtilmedi"}
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Teklif Kalemleri</h3>

                  <div className="overflow-hidden rounded-xl border border-zinc-200">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 border-b border-zinc-200 px-4 py-3 text-sm last:border-b-0"
                      >
                        <p className="col-span-2 font-medium">
                          {item.title || "Hizmet adı"}
                        </p>

                        <p>{item.quantity} adet</p>

                        <p className="text-right">
                          {(item.quantity * item.unitPrice).toLocaleString(
                            "tr-TR"
                          )}{" "}
                          TL
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-zinc-950 p-5 text-white">
                  <p className="text-sm text-zinc-400">Toplam Tutar</p>
                  <p className="mt-1 text-3xl font-bold">
                    {totalPrice.toLocaleString("tr-TR")} TL
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Ödeme Planı</h3>
                  <p className="text-zinc-700">
                    %50 peşin, %50 iş tesliminde alınır.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Revize Hakkı</h3>
                  <p className="text-zinc-700">
                    Bu teklife 2 revizyon hakkı dahildir.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-10 text-sm text-zinc-500">
                  <div>
                    <div className="mb-2 h-px bg-zinc-300" />
                    Firma İmza / Kaşe
                  </div>

                  <div>
                    <div className="mb-2 h-px bg-zinc-300" />
                    Müşteri Onayı
                  </div>
                </div>
              </div>
            </section>

            <div className="rounded-2xl bg-white p-4">
              <button
                onClick={resetForm}
                className="w-full rounded-xl border border-zinc-300 px-5 py-3 font-semibold text-zinc-800 hover:bg-zinc-100"
              >
                Yeni Teklif
              </button>

              <button
                onClick={saveOffer}
                className="mt-3 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                {editingIndex !== null ? "Teklifi Güncelle" : "Teklifi Kaydet"}
              </button>

              <button
                onClick={downloadPDF}
                className="mt-3 w-full rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white hover:bg-zinc-800"
              >
                PDF İndir
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}