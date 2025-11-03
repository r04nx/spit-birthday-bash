import { useEffect, useState } from "react";
import { BirthdayPerson, loadBirthdayData, filterByCurrentMonth } from "@/lib/birthdayParser";
import Header from "@/components/Header";
import CardGallery from "@/components/CardGallery";
import RotatingCards from "@/components/RotatingCards";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [allPeople, setAllPeople] = useState<BirthdayPerson[]>([]);
  const [thisMonthPeople, setThisMonthPeople] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await loadBirthdayData();
      setAllPeople(data);
      const filtered = filterByCurrentMonth(data);
      setThisMonthPeople(filtered);
      console.log('Total people loaded:', data.length);
      console.log('This month birthdays:', filtered.length);
    } catch (error) {
      console.error("Error loading birthday data:", error);
      toast.error("Failed to load birthday data. Please check the file format.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    toast.info("Refreshing birthday data...");
    await loadData();
    toast.success("Birthday data refreshed!");
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      
      <div className="absolute top-20 right-4 z-10">
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
      
      <main className="flex-1 flex overflow-hidden">
        <div className="w-full h-full flex">
          {/* Left side - Individual Birthday Card */}
          <section className="w-1/2 h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-muted/10 border-r border-border/50">
            <div className="w-full max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-8 text-center">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Celebrate Today! 🎉
                </span>
              </h2>
              <div className="w-full">
                <CardGallery people={allPeople} />
              </div>
            </div>
          </section>

          {/* Right side - This Month's Celebrations */}
          <section className="w-1/2 h-full flex flex-col p-8 overflow-hidden">
            <div className="text-center mb-6">
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {new Date().toLocaleString('en', { month: 'long', year: 'numeric' })} Birthdays 🎊
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Wishing all our birthday stars a day filled with joy and wonderful memories!
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <RotatingCards people={thisMonthPeople} />
            </div>
          </section>
        </div>
      </main>

      <footer className="py-3 border-t border-border bg-card/30 backdrop-blur-sm">
        <p className="text-center text-sm text-muted-foreground">
          Made with ❤️ for SPIT College Community
        </p>
      </footer>
    </div>
  );
};

export default Index;