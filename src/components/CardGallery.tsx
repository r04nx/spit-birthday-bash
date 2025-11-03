import { useState, useEffect } from "react";
import { BirthdayPerson } from "@/lib/birthdayParser";
import BirthdayCard from "./BirthdayCard";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardGalleryProps {
  people: BirthdayPerson[];
}

const CardGallery = ({ people }: CardGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % people.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + people.length) % people.length);
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (people.length === 0) return;
    
    const interval = setInterval(() => {
      nextCard();
    }, 5000);

    return () => clearInterval(interval);
  }, [people.length]);

  if (people.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-muted-foreground">No birthdays this month! 🎉</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="relative">
        <div className="mb-4 animate-fade-in">
          <BirthdayCard person={people[currentIndex]} />
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={prevCard}
            variant="outline"
            size="sm"
            className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)] transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {people.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-6 shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                      : "bg-muted hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
              {people.length > 5 && (
                <span className="text-xs text-muted-foreground px-1">...</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {currentIndex + 1} / {people.length}
            </p>
          </div>

          <Button
            onClick={nextCard}
            variant="outline"
            size="sm"
            className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)] transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardGallery;