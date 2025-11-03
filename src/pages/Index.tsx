import { useEffect, useState } from "react";
import { BirthdayPerson, loadBirthdayData, filterByCurrentMonth } from "@/lib/birthdayParser";
import Header from "@/components/Header";
import RunningText from "@/components/RunningText";
import CardGallery from "@/components/CardGallery";
import RotatingCards from "@/components/RotatingCards";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [allPeople, setAllPeople] = useState<BirthdayPerson[]>([]);
  const [thisMonthPeople, setThisMonthPeople] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadBirthdayData();
        setAllPeople(data);
        const filtered = filterByCurrentMonth(data);
        setThisMonthPeople(filtered);
      } catch (error) {
        console.error("Error loading birthday data:", error);
      } finally {
        setLoading(false);
      }
    };

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
      
      {thisMonthPeople.length > 0 && (
        <RunningText people={thisMonthPeople} />
      )}

      <main className="container mx-auto px-4 py-12 space-y-16">
        <section>
          <RotatingCards people={thisMonthPeople} />
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
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