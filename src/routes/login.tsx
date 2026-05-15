import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type PortalType = "executor" | "ops" | null;
type TourTarget = "logo" | "executor-card" | "ops-card" | "email" | "password" | "new-account" | "login" | "back";

type TourStep = {
  title: string;
  body: string;
  target: TourTarget | null;
  portal?: PortalType;
};

const TOUR_STORAGE_KEY = "veasyble_login_tour_done";
const ACADEMY_STORAGE_KEY = "veasyble_academy_progress";

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Veasyble Demo",
    body: "This toolkit lets you explore both the executor app and the operations dashboard.",
    target: "logo",
    portal: null,
  },
  {
    title: "Execution Team",
    body: "Choose this to test the executor mobile flow: complete Academy, browse tasks, accept work, execute in-store tasks, and submit Proof of Placement.",
    target: "executor-card",
    portal: null,
  },
  {
    title: "Veasyble Ops",
    body: "Choose this to test the operations flow: monitor campaigns, review submissions, manage escalations, and track executor quality.",
    target: "ops-card",
    portal: null,
  },
  {
    title: "Email",
    body: "Use the pre-filled demo email to enter quickly, or type another email to simulate a different user.",
    target: "email",
    portal: "executor",
  },
  {
    title: "Password",
    body: "For the demo account, password can stay empty. For other emails, enter any password.",
    target: "password",
    portal: "executor",
  },
  {
    title: "New account",
    body: "Turn this on to simulate a new executor who has not completed Academy yet. They will be sent to Academy first.",
    target: "new-account",
    portal: "executor",
  },
  {
    title: "Login",
    body: "Log in to enter the selected portal. Your demo progress is saved in this browser.",
    target: "login",
    portal: "executor",
  },
  {
    title: "Back",
    body: "Return to portal selection if you want to switch between Execution Team and Veasyble Ops.",
    target: "back",
    portal: "executor",
  },
  {
    title: "Academy",
    body: "New executors must complete Academy and pass quizzes before accessing live tasks.",
    target: null,
  },
  {
    title: "My Tasks",
    body: "These are tasks you already accepted and are committed to complete.",
    target: null,
  },
  {
    title: "Browse Tasks",
    body: "Find available work. Use filters for time, location, and brand.",
    target: null,
  },
  {
    title: "Task Detail",
    body: "Review campaign brief, store details, pay, print station, contact points, and execution requirements before starting.",
    target: null,
  },
  {
    title: "Decline",
    body: "Hide tasks you do not want. Declined tasks move to Profile and can be restored if they have not expired.",
    target: null,
  },
  {
    title: "Start Task",
    body: "Begin the execution flow: pickup materials, pre-check, on-site checklist, and PoP submission.",
    target: null,
  },
  {
    title: "Profile History",
    body: "Completed, rejected, cancelled, and declined tasks are tracked here.",
    target: null,
  },
  {
    title: "Dashboard",
    body: "Track network health across onboarding, dispatch, execution, and quality phases.",
    target: null,
  },
  {
    title: "Threshold Settings",
    body: "Ops Lead can adjust alert thresholds. Dashboard colors update based on these settings.",
    target: null,
  },
  {
    title: "Campaign Monitor",
    body: "See campaign fill rate, urgency, and execution readiness.",
    target: null,
  },
  {
    title: "Submissions",
    body: "Review submitted task proof and request revision if needed.",
    target: null,
  },
  {
    title: "Escalation Queue",
    body: "Track operational issues that need attention.",
    target: null,
  },
  {
    title: "Executor Network",
    body: "Monitor executor status, rating, quality risk, and performance.",
    target: null,
  },
];

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [portal, setPortal] = useState<PortalType>(null);
  const [email, setEmail] = useState("demo@veasyble.com");
  const [password, setPassword] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const activeStep = tourSteps[tourIndex];

  useEffect(() => {
    if (!localStorage.getItem(TOUR_STORAGE_KEY)) {
      setIsTourOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isTourOpen && activeStep?.portal !== undefined) {
      setPortal(activeStep.portal);
    }
  }, [activeStep, isTourOpen]);

  function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (email !== "demo@veasyble.com" && !password.trim()) return;

    if (portal === "executor") {
      import("@/lib/academy-data").then(({ completeAcademyForDemo }) => {
        if (isNewAccount) {
          localStorage.removeItem(ACADEMY_STORAGE_KEY);
          login("John Doe");
          navigate({ to: "/executor/academy" });
          return;
        }

        completeAcademyForDemo();
        login("John Doe");
        navigate({ to: "/executor/home" });
      });
    } else {
      login("Linda Tran");
      navigate({ to: "/ops/dashboard" });
    }
  }

  function openTour() {
    setTourIndex(0);
    setIsTourOpen(true);
  }

  function closeTour() {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setIsTourOpen(false);
  }

  function nextTourStep() {
    if (tourIndex >= tourSteps.length - 1) {
      closeTour();
      return;
    }
    setTourIndex((current) => current + 1);
  }

  const highlightClass = (target: TourTarget) =>
    isTourOpen && activeStep?.target === target
      ? "relative z-30 ring-4 ring-[#F97316]/35 shadow-lg shadow-orange-100"
      : "";

  const portalCardClass =
    "w-full flex items-center gap-3 bg-white border border-gray-200 rounded-[5px] px-4 py-4 hover:border-[#F97316] hover:shadow-sm transition-all";

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-6 relative">
      {isTourOpen && <div className="fixed inset-0 bg-slate-900/25 z-20" />}

      <button
        type="button"
        onClick={openTour}
        className="absolute right-4 top-4 z-40 rounded-[5px] border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#1A3557] shadow-sm hover:border-[#F97316]"
      >
        How to use
      </button>

      <div className="w-full max-w-sm">
        <div className={`text-center mb-8 rounded-[5px] ${highlightClass("logo")}`}>
          <p className="text-3xl font-bold text-[#1A3557]">Veasyble</p>
        </div>

        {!portal ? (
          <div className="space-y-3">
            <p className="text-xs text-center text-gray-400 font-medium mb-4 uppercase tracking-wide">
              Select Portal
            </p>
            <button
              onClick={() => setPortal("executor")}
              className={`${portalCardClass} ${highlightClass("executor-card")}`}
            >
              <span className="text-2xl"></span>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Execution Team</p>
                <p className="text-[10px] text-gray-400">Mobile App</p>
              </div>
            </button>
            <button
              onClick={() => setPortal("ops")}
              className={`${portalCardClass} ${highlightClass("ops-card")}`}
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
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className={highlightClass("email")}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none focus:border-[#F97316]"
                />
              </div>
              <div className={highlightClass("password")}>
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
              {portal === "executor" && (
                <label
                  className={`flex items-start gap-2 rounded-[5px] border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600 ${highlightClass("new-account")}`}
                >
                  <input
                    type="checkbox"
                    checked={isNewAccount}
                    onChange={(e) => setIsNewAccount(e.target.checked)}
                    className="mt-0.5 accent-[#F97316]"
                  />
                  <span>New account (hasn't completed Academy)</span>
                </label>
              )}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPortal(null)}
                  className={`px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-[5px] hover:bg-gray-200 transition-colors ${highlightClass("back")}`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex-1 bg-[#F97316] text-white text-sm font-semibold py-2.5 rounded-[5px] hover:bg-[#ea580c] transition-colors shadow-sm ${highlightClass("login")}`}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {isTourOpen && activeStep && (
        <div className="fixed left-4 right-4 bottom-6 z-50 mx-auto max-w-sm rounded-[5px] bg-white p-4 shadow-xl border border-gray-100">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#F97316]">
                Step {tourIndex + 1} of {tourSteps.length}
              </p>
              <h2 className="mt-1 text-base font-bold text-gray-900">{activeStep.title}</h2>
            </div>
            <button type="button" onClick={closeTour} className="text-xs font-semibold text-gray-400">
              Skip tour
            </button>
          </div>
          <p className="text-sm leading-5 text-gray-600">{activeStep.body}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setTourIndex((current) => Math.max(0, current - 1))}
              disabled={tourIndex === 0}
              className="rounded-[5px] px-3 py-2 text-xs font-semibold text-gray-500 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextTourStep}
              className="rounded-[5px] bg-[#F97316] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#ea580c]"
            >
              {tourIndex === tourSteps.length - 1 ? "Start exploring" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
