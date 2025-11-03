import spitLogo from "@/assets/spit-logo.png";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 bg-card/50 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={spitLogo} 
            alt="SPIT College Logo" 
            className="h-12 md:h-16 object-contain"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Birthday Celebrations
            </h1>
            <p className="text-sm text-muted-foreground">Sardar Patel Institute of Technology</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;