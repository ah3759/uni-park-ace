import { Search, Calendar, DollarSign, PartyPopper, Briefcase, LogIn } from "lucide-react";

type Props = { onAction: (action: string) => void };

const actions = [
  { id: "status", label: "Check Status", icon: Search },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "events", label: "Events", icon: PartyPopper },
  { id: "signin", label: "Sign In", icon: LogIn },
];

const ChatQuickActions = ({ onAction }: Props) => (
  <div className="px-3 py-2 border-t border-border/50 flex gap-1.5 overflow-x-auto">
    {actions.map((a) => (
      <button
        key={a.id}
        onClick={() => onAction(a.id)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium border border-border/50 bg-muted/30 text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap"
      >
        <a.icon className="w-3 h-3" />
        {a.label}
      </button>
    ))}
  </div>
);

export default ChatQuickActions;
