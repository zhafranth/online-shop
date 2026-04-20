export function Ticker() {
  const text = "✦ FREE ONGKIR MIN. Rp200.000     ✦ NEW ARRIVALS EVERY WEEK     ✦ SIZE S – 4XL     ✦ RETUR 14 HARI     ✦ GARANSI KUALITAS     ";
  return (
    <div className="bg-gold text-white py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-ticker text-xs font-medium tracking-[0.12em] pr-20">
        {text}{text}
      </div>
    </div>
  );
}
