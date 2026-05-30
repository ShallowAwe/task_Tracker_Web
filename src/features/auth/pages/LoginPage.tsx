import AuthBackground from "../components/AuthBackground";
import LoginCard from "../components/LoginCard";
import { CheckCircle2, Shield, Zap, LayoutDashboard } from "lucide-react";

function LoginPage() {
  const features = [
    {
      icon: <Zap size={24} className="text-slate-500" />,
      title: "Faster task execution",
      desc: "Track sessions and task states without losing context.",
    },
    {
      icon: <Shield size={24} className="text-slate-500" />,
      title: "Secure workspace",
      desc: "JWT-secured access with audit-safe actions.",
    },
    {
      icon: <LayoutDashboard size={24} className="text-slate-500" />,
      title: "Live dashboards",
      desc: "Real-time visibility into project health and delivery.",
    },
    {
      icon: <CheckCircle2 size={24} className="text-slate-500" />,
      title: "Reliable delivery",
      desc: "Focus on execution with clear ownership and stability.",
    },
  ];

  return (
    <div className="login-page">
      <AuthBackground />

      <div className="login-grid">
        {/* LEFT PANEL */}
        <div className="login-left-panel">
          <div className="login-left-inner">
            <div className="login-brand">
              <Shield className="text-indigo-600 w-8 h-8" />
              <span className="login-brand-name">TaskFlow</span>
            </div>

            <div className="login-features-list">
              {features.map((feature, index) => (
                <div key={index} className="login-feature-item">
                  <div className="login-feature-icon-wrap">{feature.icon}</div>
                  <div>
                    <h3 className="login-feature-title">{feature.title}</h3>
                    <p className="login-feature-desc">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right-panel">
          {/* Mobile Header */}
          <div className="login-mobile-header">
            <Shield className="text-indigo-600 w-10 h-10 mb-3" />
            <h2 className="login-mobile-title">TaskFlow</h2>
          </div>

          <div className="login-card-wrap">
            <LoginCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
