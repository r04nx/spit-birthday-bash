import { useState } from "react";
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

  if (people.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-muted-foreground">No birthdays this month! 🎉</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="mb-6 animate-fade-in">
          <BirthdayCard person={people[currentIndex]} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={prevCard}
            variant="outline"
            size="lg"
            className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)] transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="flex gap-2">
            {people.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8 shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                    : "bg-muted hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>

          <Button
            onClick={nextCard}
            variant="outline"
            size="lg"
            className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)] transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <p className="text-center mt-4 text-muted-foreground">
          {currentIndex + 1} of {people.length}
        </p>
      </div>
    </div>
  );
};

export default CardGallery;