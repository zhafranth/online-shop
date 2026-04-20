const USPS = [
  { icon: "🚚", title: "Free Ongkir", sub: "Min. belanja Rp 200.000" },
  { icon: "↩", title: "Retur 14 Hari", sub: "Tanpa pertanyaan" },
  { icon: "🔒", title: "Pembayaran Aman", sub: "SSL Encrypted" },
  { icon: "⭐", title: "Kualitas Terjamin", sub: "Garansi kepuasan" },
];

export function UspStrip() {
  return (
    <div className="bg-navy py-10">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {USPS.map(({ icon, title, sub }) => (
            <div key={title}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-serif text-base text-white mb-1">{title}</div>
              <div className="text-xs text-white/50">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
