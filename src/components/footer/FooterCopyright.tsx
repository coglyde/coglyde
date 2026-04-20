export function FooterCopyright() {
  const year = new Date().getFullYear();
  return (
    <div className="border-t border-white/10 pt-6 text-center">
      <p className="text-xs text-white/50">Copyright Coglyde {year}</p>
    </div>
  );
}
