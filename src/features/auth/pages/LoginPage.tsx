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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-transparent">
      <AuthBackground />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-center pl-32 pr-12 xl:pl-48">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-10">
              <Shield className="text-indigo-600 w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-slate-900">TaskFlow</span>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="group flex gap-6">
                  <div className="text-slate-400 mt-1 transition-colors duration-300 group-hover:text-indigo-500">{feature.icon}</div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center px-6 py-12 lg:pl-24 lg:items-start">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <Shield className="text-indigo-600 w-10 h-10 mb-3" />
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">TaskFlow</h2>
          </div>

          <div className="w-full max-w-md lg:ml-8">
            <LoginCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
