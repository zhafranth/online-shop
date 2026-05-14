const USPS = [
  { icon: "🚚", title: "Free Ongkir", sub: "Min. belanja Rp 200.000" },
  { icon: "↩", title: "Retur 14 Hari", sub: "Tanpa pertanyaan" },
  { icon: "🔒", title: "Pembayaran Aman", sub: "SSL Encrypted" },
  { icon: "⭐", title: "Kualitas Terjamin", sub: "Garansi kepuasan" },
];

export function UspStrip() {
  return (
    <div className="bg-cream py-12 border-t border-site-border">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {USPS.map(({ icon, title, sub }) => (
            <div key={title}>
              <div className="text-2xl mb-2 grayscale opacity-80">{icon}</div>
              <div className="font-serif text-base text-site-text mb-1">{title}</div>
              <div className="text-xs text-site-gray">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
