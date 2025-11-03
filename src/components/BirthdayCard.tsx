import { BirthdayPerson } from "@/lib/birthdayParser";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import confetti from "canvas-confetti";
import { Cake, Sparkles } from "lucide-react";
import { useEffect } from "react";

interface BirthdayCardProps {
  person: BirthdayPerson;
}

const BirthdayCard = ({ person }: BirthdayCardProps) => {
  // Trigger confetti when the person changes
  useEffect(() => {
    const duration = 1500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 180, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 30 * (timeLeft / duration);
      
      // Confetti from the left side of the image
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70)
      });
    }, 50);

    return () => clearInterval(interval);
  }, [person]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const defaultImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(person.name);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 border-2 border-primary/20 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.3)] hover:shadow-[0_20px_60px_-10px_hsl(var(--primary)/0.4)] transition-all duration-300 max-w-4xl w-full mx-auto">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-tr-full blur-2xl" />
      
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Image on the left - Larger and rectangular */}
          <div className="relative w-full lg:w-1/2">
            <div className="absolute -inset-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur-lg opacity-75 animate-pulse" />
            <div className="relative overflow-hidden rounded-xl border-4 border-card shadow-2xl ring-4 ring-primary/20 aspect-[3/4] w-full group">
              <img
                src={person.image || defaultImage}
                alt={person.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-medium text-sm">Click to celebrate!</span>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 bg-secondary rounded-full p-3 shadow-xl animate-float">
              <Cake className="w-6 h-6 text-secondary-foreground" />
            </div>
          </div>

          {/* Details on the right */}
          <div className="flex-1 w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-3">
                {person.name}
              </h3>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-base font-semibold text-primary">
                  {person.birthday}
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
              <p className="text-lg font-medium text-foreground">
                {person.department}
              </p>
              <p className="text-sm text-muted-foreground bg-muted/50 inline-block px-4 py-1.5 rounded-full border border-border/50">
                {person.designation}
              </p>
            </div>
          </div>
        </div>

        {/* Celebrate button at the bottom */}
        <div className="mt-8">
          <Button
            onClick={triggerConfetti}
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-lg text-primary-foreground font-bold py-6 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.5)] hover:shadow-[0_20px_60px_-10px_hsl(var(--primary)/0.6)] transition-all duration-300 hover:scale-[1.02] transform hover:-translate-y-0.5"
          >
            🎈🎂 Wish a Very Happy Birthday! 🎉🎈
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BirthdayCard;