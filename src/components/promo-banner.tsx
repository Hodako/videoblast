export default function PromoBanner({ text }) {
  if(!text) {
    return null;
  }
  return (
    <div className="bg-gradient-to-r from-[#2ed573] to-[#1dd1a1] px-5 py-2.5 text-center text-sm font-bold text-white">
      {text}
    </div>
  );
}
