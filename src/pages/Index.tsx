import { useEffect, useState } from "react";
import { BirthdayPerson, loadBirthdayData, filterByCurrentMonth } from "@/lib/birthdayParser";
import Header from "@/components/Header";
import RunningText from "@/components/RunningText";
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
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-6 flex justify-end">
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>
      
      {thisMonthPeople.length > 0 && (
        <RunningText people={thisMonthPeople} />
      )}

      <main className="container mx-auto px-4 py-12 space-y-16">
        <section>
          <RotatingCards people={thisMonthPeople} />
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Celebrate Today! 🎉
            </span>
          </h2>
          <CardGallery people={thisMonthPeople} />
        </section>
      </main>

      <footer className="mt-16 py-8 border-t border-border bg-card/30 backdrop-blur-sm">
        <p className="text-center text-muted-foreground">
          Made with ❤️ for SPIT College Community
        </p>
      </footer>
    </div>
  );
};

export default Index;