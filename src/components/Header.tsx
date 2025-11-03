import spitLogo from "@/assets/spit-logo.png";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-card/50 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={spitLogo} 
            alt="SPIT College Logo" 
            className="h-12 lg:h-14 object-contain"
          />
          <div>
            <h1 className="text-xl lg:text-2xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Birthday Celebrations
            </h1>
            <p className="text-xs lg:text-sm font-semibold text-foreground">Sardar Patel Institute of Technology</p>
            <p className="text-xs text-muted-foreground">Autonomous Institute affiliated to Mumbai University</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;