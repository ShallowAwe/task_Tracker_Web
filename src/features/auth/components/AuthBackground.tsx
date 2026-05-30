import GridPattern from "./GridPattern";

export default function AuthBackground() {
  return (
    <div className="auth-bg">
      {/* Single centered pulsing hue */}
      <div className="auth-bg-glow-wrap">
        <div className="auth-bg-glow" />
      </div>

      {/* Grid pattern overlay */}
      <GridPattern />
    </div>
  );
}