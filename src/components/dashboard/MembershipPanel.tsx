import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Crown, Loader2, CheckCircle2, AlertTriangle, UserPlus } from "lucide-react";

interface Props {
  requestId: string;
  customerEmail: string;
  customerFirstName: string;
  onApplied?: () => void;
}

interface MembershipStatus {
  isMember: boolean;
  reason?: string;
  tier?: "monthly-pro" | "semester-pass";
  period?: "month" | "semester";
  periodStart?: string;
  subscriptionEnd?: string;
  valetUses?: number;
  guestUses?: number;
  guestLimit?: number;
  valetLimit?: number | null;
  guestRemaining?: number;
}

const TIER_LABEL: Record<string, string> = {
  "monthly-pro": "Monthly Pro",
  "semester-pass": "Semester Pass",
};

const MembershipPanel = ({ requestId, customerEmail, customerFirstName, onApplied }: Props) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<MembershipStatus | null>(null);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: membership }, { data: existing }] = await Promise.all([
        supabase.functions.invoke("check-membership", { body: { email: customerEmail } }),
        supabase
          .from("membership_uses")
          .select("id")
          .eq("parking_request_id", requestId)
          .maybeSingle(),
      ]);
      setStatus((membership as MembershipStatus) || { isMember: false });
      setAlreadyApplied(!!existing);
    } catch (err: any) {
      setStatus({ isMember: false, reason: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, customerEmail]);

  const apply = async (asGuestPass: boolean) => {
    if (!status?.isMember || !status.tier || !status.periodStart) return;
    setApplying(true);
    try {
      const { error } = await supabase.from("membership_uses").insert({
        parking_request_id: requestId,
        customer_email: customerEmail.toLowerCase(),
        plan_tier: status.tier,
        period_start: status.periodStart,
        is_guest_pass: asGuestPass,
      });
      if (error) throw error;
      toast({
        title: asGuestPass ? "Guest pass applied" : "Membership use recorded",
        description: `${customerFirstName}'s ${TIER_LABEL[status.tier]} ${asGuestPass ? "guest pass" : "valet"} counted.`,
      });
      setAlreadyApplied(true);
      await load();
      onApplied?.();
    } catch (err: any) {
      toast({ title: "Failed to apply", description: err.message, variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Checking membership…
      </div>
    );
  }

  if (!status?.isMember) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5" /> Membership
        </h3>
        <p className="text-xs text-muted-foreground">
          No active membership found for {customerEmail}. Use Stripe payment link below.
        </p>
      </div>
    );
  }

  const valetUnlimited = status.valetLimit === null;
  const guestExhausted = (status.guestRemaining ?? 0) <= 0;
  const guestNearlyOut = (status.guestRemaining ?? 0) <= 1;
  const periodLabel = status.period === "month" ? "this month" : "this semester";

  return (
    <div className="rounded-lg border-2 border-secondary/40 bg-secondary/5 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5" /> Active Member
        </h3>
        <Badge variant="secondary" className="text-xs gap-1">
          {TIER_LABEL[status.tier!]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-background/60 p-2">
          <div className="text-muted-foreground">Valets {periodLabel}</div>
          <div className="font-semibold text-foreground">
            {status.valetUses}
            {valetUnlimited ? " · Unlimited" : ` / ${status.valetLimit}`}
          </div>
        </div>
        <div className="rounded-md bg-background/60 p-2">
          <div className="text-muted-foreground">Guest passes left</div>
          <div className={`font-semibold ${guestExhausted ? "text-destructive" : guestNearlyOut ? "text-amber-600" : "text-foreground"}`}>
            {status.guestRemaining} / {status.guestLimit}
          </div>
        </div>
      </div>

      {alreadyApplied ? (
        <div className="flex items-center gap-2 text-xs text-secondary font-medium pt-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Membership already applied to this request
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            variant="default"
            className="text-xs gap-1"
            disabled={applying}
            onClick={() => apply(false)}
          >
            {applying ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
            Use Membership Valet
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1"
            disabled={applying || guestExhausted}
            onClick={() => apply(true)}
          >
            <UserPlus className="h-3 w-3" />
            Use Guest Pass
          </Button>
        </div>
      )}

      {guestExhausted && !alreadyApplied && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-600">
          <AlertTriangle className="w-3 h-3" />
          Guest pass limit reached for this {status.period}.
        </div>
      )}
    </div>
  );
};

export default MembershipPanel;