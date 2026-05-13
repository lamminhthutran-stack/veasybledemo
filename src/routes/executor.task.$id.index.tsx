import { ArrowLeft, MapPin, Clock, DollarSign, Package, Phone, MessageCircle } from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { tasks } from "@/lib/mock-data";
import { declineTask } from "@/lib/task-state";
import { useState } from "react";


export const Route = createFileRoute("/executor/task/$id/")({
  component: TaskDetail,
});

const contactPoints = [
  {
    label: "Brand Contact",
    name: "Nguyễn Thị Lan",
    role: "Trade Marketing Manager, Pepsi Vietnam",
    phone: "0901 234 567",
    zalo: "https://zalo.me/0901234567",
  },
  {
    label: "Retailer Contact",
    name: "Trần Văn Hùng",
    role: "Store Manager, FamilyMart Nguyễn Trãi",
    phone: "0912 345 678",
    zalo: "https://zalo.me/0912345678",
  },
];

function TaskDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const t = tasks.find((x) => x.id === id) ?? tasks[0];
  const [accepted, setAccepted] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  const confirmDecline = () => {
    declineTask(t.id);
    setShowDeclineConfirm(false);
    nav({ to: "/executor/home" });
  };

  if (accepted) {
    return (
      <div className="min-h-screen p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-2">Task Accepted ✓</h1>
        <p className="text-sm text-muted-foreground mb-4">Pick up materials before heading to the store.</p>
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Print Station</div>
          <div className="font-semibold">{t.printStation}</div>
          <div className="text-sm text-muted-foreground">{t.printAddress}</div>
          <div className="mt-3 h-32 rounded-lg bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" /> Map preview
          </div>
        </div>
        <div className="mt-auto space-y-2">
          <Link
            to="/executor/task/$id/pre-execute"
            params={{ id: t.id }}
            className="block text-center bg-orange text-orange-foreground font-semibold rounded-md py-3"
          >
            Start Day-of Flow
          </Link>
          <button
            onClick={() => nav({ to: "/executor/home" })}
            className="w-full border border-border rounded-md py-3 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy text-navy-foreground px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/executor/home"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="font-semibold truncate">{t.campaign}</div>
      </header>

      <div className="p-4 space-y-3 flex-1">
        <InfoRow icon={<MapPin className="w-4 h-4" />} title={t.store} sub={t.district} />
        <InfoRow icon={<Clock className="w-4 h-4" />} title={t.date} sub={t.time} />
        <InfoRow icon={<DollarSign className="w-4 h-4" />} title={t.pay} sub="Paid on approval" />
        <InfoRow icon={<Package className="w-4 h-4" />} title="Materials Pickup" sub={`${t.printStation} — ${t.printAddress}`} />

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-1">Campaign Brief</h3>
          <p className="text-sm text-muted-foreground">{t.brief}</p>
        </div>

        <section className="space-y-2">
          <h3 className="font-semibold text-sm">Contact Points</h3>
          {contactPoints.map((contact) => (
            <ContactCard key={contact.label} contact={contact} />
          ))}
        </section>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-2">SOP Preview</h3>
          <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li>Check in via GPS at the store location</li>
            <li>Take a selfie with the store signage</li>
            <li>Set up display per planogram</li>
            <li>Submit final photos as Proof of Placement</li>
          </ol>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex gap-2">
        <button
          onClick={() => setShowDeclineConfirm(true)}
          className="flex-1 border border-border text-muted-foreground rounded-md py-3 text-sm font-medium"
        >
          Decline
        </button>
        <button
          onClick={() => setAccepted(true)}
          className="flex-[2] bg-orange text-orange-foreground rounded-md py-3 text-sm font-semibold"
        >
          Accept Task
        </button>
      </div>

      {showDeclineConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4">
          <div className="w-full max-w-[360px] rounded-xl bg-background p-4 shadow-xl">
            <h2 className="font-semibold text-base">Ẩn task này?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Task sẽ được chuyển vào mục Đã từ chối.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowDeclineConfirm(false)}
                className="rounded-md border border-border py-3 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDecline}
                className="rounded-md bg-orange py-3 text-sm font-semibold text-orange-foreground"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-navy">{icon}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function ContactCard({ contact }: { contact: { label: string; name: string; role: string; phone: string; zalo: string } }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{contact.label}</div>
      <div className="mt-1 font-semibold text-sm">{contact.name}</div>
      <div className="text-xs text-muted-foreground">{contact.role}</div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <a href={`tel:${contact.phone.replaceAll(" ", "")}`} className="flex items-center gap-1.5 text-xs font-medium text-navy">
          <Phone className="w-3.5 h-3.5" />
          {contact.phone}
        </a>
        <a
          href={contact.zalo}
          className="inline-flex items-center gap-1.5 rounded-md bg-orange px-3 py-1.5 text-xs font-semibold text-orange-foreground"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Zalo
        </a>
      </div>
    </div>
  );
}
