import { Clock, Zap, Gift, Timer } from "lucide-react";

const TimeGuarantee = () => {
  return (
    <section className="py-24 hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-secondary/30 mb-8">
            <Timer className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground/80">Time Guarantee</span>
          </div>

          {/* Main Message */}
          <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            Your Car in
            <span className="text-gradient"> 5 Minutes</span>
            <br />or It's Free
          </h2>
          <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-12">
            We're so confident in our speed that we guarantee your vehicle will be ready within 5 minutes of your request—or your next valet is on us.
          </p>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-8 border border-secondary/40 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 accent-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <Clock className="w-8 h-8 text-accent-foreground" />
              </div>
              <p className="font-display text-4xl font-bold text-primary-foreground mb-2">3.2</p>
              <p className="text-primary-foreground/85">Minutes Average Retrieval</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-8 border border-secondary/40 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 accent-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <Zap className="w-8 h-8 text-accent-foreground" />
              </div>
              <p className="font-display text-4xl font-bold text-primary-foreground mb-2">98.7%</p>
              <p className="text-primary-foreground/85">On-Time Delivery Rate</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-8 border border-secondary/40 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 accent-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <Gift className="w-8 h-8 text-accent-foreground" />
              </div>
              <p className="font-display text-4xl font-bold text-primary-foreground mb-2">$0</p>
              <p className="text-primary-foreground/85">Cost When We're Late</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-16 bg-primary-foreground/10 backdrop-blur-md rounded-3xl p-8 border border-secondary/40 shadow-lg text-left">
            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-6 text-center">
              How Our Guarantee Works
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Request", desc: "Tap 'Get My Car' in the app" },
                { step: "02", title: "Timer Starts", desc: "5-minute countdown begins" },
                { step: "03", title: "Track Live", desc: "Watch your car approach" },
                { step: "04", title: "Late = Free", desc: "Miss deadline? Free next valet" },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <span className="font-display text-4xl font-bold text-secondary">{item.step}</span>
                  <h4 className="font-display font-semibold text-primary-foreground mt-2">{item.title}</h4>
                  <p className="text-sm text-primary-foreground/85 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeGuarantee;
