import GridPattern from "./GridPattern";

export default function AuthBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gray-100">
      {/* Single centered pulsing hue */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1200px] h-[1200px] bg-[radial-gradient(circle,rgba(239,246,255,1)_0%,rgba(255,255,255,0)_60%)] animate-[pulse_10s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
      </div>

      {/* Grid pattern overlay */}
      <GridPattern />
    </div>
  );
}