import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type PortalType = "executor" | "ops" | null;
type TourTarget =
  | "welcome"
  | "how-card"
  | "executor-card"
  | "ops-card"
  | "email-field"
  | "password-field"
  | "login-button"
  | "back-button";

type TourStep = {
  target: TourTarget;
  portal: PortalType;
  title: string;
  body: string;
};

const TOUR_STORAGE_KEY = "veasyble_login_tooltip_tour_seen";

const tourSteps: TourStep[] = [
  {
    target: "welcome",
    portal: null,
    title: "Welcome to Veasyble Demo",
    body: "This toolkit lets you explore both sides of the product: the executor mobile app and the Veasyble operations dashboard.",
  },
  {
    target: "how-card",
    portal: null,
    title: "How This Demo Works",
    body: "Read the feature guide first. It explains what each screen does, then use the tour to walk through the login choices step by step.",
  },
  {
    target: "executor-card",
    portal: null,
    title: "Execution Team Portal",
    body: "This side shows the field executor journey: learn rules in Academy, browse jobs, commit to tasks, execute at store, submit proof, and review history.",
  },
  {
    target: "ops-card",
    portal: null,
    title: "Veasyble Ops Portal",
    body: "This side shows internal operations: monitor phase metrics, campaign fill, submissions, escalations, and executor network quality.",
  },
  {
    target: "email-field",
    portal: "executor",
    title: "Demo Login",
    body: "The default demo email is pre-filled. Use it to enter quickly, or type another email to simulate a different account.",
  },
  {
    target: "password-field",
    portal: "executor",
    title: "Password Field",
    body: "For the default demo account, the password can stay empty. For another email, enter any password to continue.",
  },
  {
    target: "login-button",
    portal: "executor",
    title: "Executor Feature Flow",
    body: "After login, follow Academy if needed, then use Home for committed tasks, Browse Tasks for available work, Task Detail for requirements, execution screens for PoP, and Profile for history.",
  },
  {
    target: "login-button",
    portal: "ops",
    title: "Ops Feature Flow",
    body: "Ops users land on Dashboard, then use Campaign Monitor for fill health, Submissions for proof review, Escalations for issues, and Executor Network for quality risk.",
  },
  {
    target: "back-button",
    portal: "executor",
    title: "Switch Portal",
    body: "Use Back to return to portal selection if you want to compare the executor mobile flow with the Ops dashboard flow.",
  },
];

const executorFeatures = [
  {
    title: "Academy",
    body: "New executors learn Veasyble rules and must pass quizzes before accessing live task work.",
  },
  {
    title: "My Tasks",
    body: "Shows accepted tasks the executor has committed to complete. These are active responsibilities, not optional jobs.",
  },
  {
    title: "Browse Tasks",
    body: "Shows available jobs with filters for time, location, and brand. Executors review pay, store, date, and availability before accepting.",
  },
  {
    title: "Task Detail",
    body: "Explains campaign brief, store information, print station, contact points, pay, and execution requirements before starting.",
  },
  {
    title: "Execution and PoP",
    body: "Guides pickup, pre-check, on-site checklist, photo proof, and final submission for Ops review.",
  },
  {
    title: "Profile History",
    body: "Tracks completed, rejected, cancelled, and declined tasks, including pay, rating, and restore options for hidden tasks.",
  },
];

const opsFeatures = [
  {
    title: "Dashboard",
    body: "Summarizes Onboard, Dispatch, Execution, and Quality metrics so Ops can spot operational risk quickly.",
  },
  {
    title: "Campaign Monitor",
    body: "Shows campaign fill rate, assigned slots, urgent campaigns, and execution readiness.",
  },
  {
    title: "Submissions",
    body: "Lets Ops inspect submitted proof, checklist evidence, materials pickup status, and request revision when needed.",
  },
  {
    title: "Escalation Queue",
    body: "Central place for operational issues such as late check-ins, store refusal, PoP problems, and quality disputes.",
  },
  {
    title: "Executor Network",
    body: "Reviews executor rating, status, quality risk, and performance trends across the field network.",
  },
];

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [portal, setPortal] = useState<PortalType>(null);
  const [email, setEmail] = useState("demo@veasyble.com");
  const [password, setPassword] = useState("");
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const currentStep = tourSteps[tourStep];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(TOUR_STORAGE_KEY)) {
      setTourOpen(true);
    }
  }, []);

  useEffect(() => {
    if (tourOpen) {
      setPortal(currentStep.portal);
    }
  }, [currentStep.portal, tourOpen]);

  function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (email !== "demo@veasyble.com" && !password.trim()) return;

    // Mock login logic
    if (portal === "executor") {
      import("@/lib/academy-data").then(({ completeAcademyForDemo }) => {
        if (email === "demo@veasyble.com") {
          completeAcademyForDemo();
        }
        login("John Doe");
        navigate({ to: "/executor/home" });
      });
    } else {
      login("Linda Tran");
      navigate({ to: "/ops/dashboard" });
    }
  }

  function openTour() {
    setTourStep(0);
    setTourOpen(true);
  }

  function closeTour() {
    setTourOpen(false);
    setTourStep(0);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOUR_STORAGE_KEY, "true");
    }
  }

  function goToNextStep() {
    if (tourStep >= tourSteps.length - 1) {
      closeTour();
      return;
    }
    setTourStep((step) => step + 1);
  }

  const portalCardClass =
    "w-full flex items-center gap-3 bg-white border border-gray-200 rounded-[5px] px-4 py-4 hover:border-[#F97316] hover:shadow-sm transition-all";

  const targetClass = (target: TourTarget) =>
    tourOpen && currentStep.target === target
      ? "relative z-40 ring-2 ring-[#F97316] ring-offset-4 ring-offset-[#F7F8FA] shadow-lg"
      : "";

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-6 py-10 relative">
      <button
        type="button"
        onClick={openTour}
        className="absolute top-4 right-4 z-50 rounded-[5px] border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#1A3557] shadow-sm hover:border-[#F97316] hover:text-[#F97316] transition-colors"
      >
        How to use
      </button>

      <div className="w-full max-w-sm">
        <div className={`text-center mb-5 rounded-[5px] ${targetClass("welcome")}`}>
          <p className="text-3xl font-bold text-[#1A3557]">Veasyble</p>
        </div>

        {!portal && (
          <div
            className={`mb-5 max-h-[50vh] overflow-y-auto rounded-[5px] border border-orange-100 bg-white p-4 shadow-sm ${targetClass("how-card")}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-900">How to use this toolkit</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Start with one portal, follow the feature flow, then switch portal to see how the
                  same field work is monitored by Ops.
                </p>
              </div>
              <button
                type="button"
                onClick={openTour}
                className="shrink-0 rounded-[5px] bg-[#F97316] px-3 py-2 text-[11px] font-semibold text-white"
              >
                Start tour
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <FeatureGroup title="Execution Team features" items={executorFeatures} />
              <FeatureGroup title="Veasyble Ops features" items={opsFeatures} />
            </div>
          </div>
        )}

        {!portal ? (
          <div className="space-y-3">
            <p className="text-xs text-center text-gray-400 font-medium mb-4 uppercase tracking-wide">
              Select Portal
            </p>
            <button
              onClick={() => setPortal("executor")}
              className={`${portalCardClass} ${targetClass("executor-card")}`}
            >
              <span className="text-2xl"></span>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Execution Team</p>
                <p className="text-[10px] text-gray-400">Mobile App</p>
              </div>
            </button>
            <button
              onClick={() => setPortal("ops")}
              className={`${portalCardClass} ${targetClass("ops-card")}`}
            >
              <span className="text-2xl"></span>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Veasyble Ops</p>
                <p className="text-[10px] text-gray-400">Desktop Dashboard</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[5px] p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="rounded-[5px] bg-orange-50 border border-orange-100 px-3 py-2 text-xs text-orange-800">
              {portal === "executor"
                ? "Execution Team flow: Academy, My Tasks, Browse Tasks, Task Detail, execution steps, PoP submission, and Profile history."
                : "Ops flow: Dashboard, Campaign Monitor, Submissions, Escalations, and Executor Network."}
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className={`rounded-[5px] ${targetClass("email-field")}`}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none focus:border-[#F97316]"
                />
              </div>
              <div className={`rounded-[5px] ${targetClass("password-field")}`}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none focus:border-[#F97316]"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPortal(null)}
                  className={`px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-[5px] hover:bg-gray-200 transition-colors ${targetClass("back-button")}`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex-1 bg-[#F97316] text-white text-sm font-semibold py-2.5 rounded-[5px] hover:bg-[#ea580c] transition-colors shadow-sm ${targetClass("login-button")}`}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {tourOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/30 px-4 pb-6">
          <div className="w-full max-w-sm rounded-[5px] bg-white border border-gray-100 shadow-xl p-4 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#F97316]">
                  Step {tourStep + 1} of {tourSteps.length}
                </p>
                <h2 className="mt-1 text-base font-bold text-gray-900">{currentStep.title}</h2>
              </div>
              <button
                type="button"
                onClick={closeTour}
                className="text-xs font-semibold text-gray-400 hover:text-gray-700"
              >
                Skip
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{currentStep.body}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setTourStep((step) => Math.max(0, step - 1))}
                disabled={tourStep === 0}
                className="px-4 py-2 text-xs font-semibold text-gray-600 disabled:opacity-30"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className="rounded-[5px] bg-[#1A3557] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#132845] transition-colors"
              >
                {tourStep === tourSteps.length - 1 ? "Start exploring" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureGroup({
  title,
  items,
}: {
  title: string;
  items: { title: string; body: string }[];
}) {
  return (
    <section>
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#1A3557]">{title}</p>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-[5px] bg-gray-50 px-3 py-2">
            <p className="text-xs font-bold text-gray-900">{item.title}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
