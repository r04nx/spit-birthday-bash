import { BirthdayPerson } from "@/lib/birthdayParser";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import confetti from "canvas-confetti";
import { Cake, Sparkles } from "lucide-react";

interface BirthdayCardProps {
  person: BirthdayPerson;
}

const BirthdayCard = ({ person }: BirthdayCardProps) => {
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 border-2 border-primary/20 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.3)] hover:shadow-[0_20px_60px_-10px_hsl(var(--primary)/0.4)] transition-all duration-300 h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-bl-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-tr-full blur-2xl" />
      
      <div className="relative p-6 md:p-8 flex flex-col items-center text-center space-y-6 h-full">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-md opacity-75 animate-pulse" />
          <img
            src={person.image || defaultImage}
            alt={person.name}
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-card shadow-lg"
          />
          <div className="absolute -top-2 -right-2 bg-secondary rounded-full p-2 shadow-lg animate-float">
            <Cake className="w-6 h-6 text-secondary-foreground" />
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            {person.name}
          </h3>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-lg font-semibold text-primary">
              {person.birthday}
            </p>
          </div>

          <div className="space-y-1 pt-2">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{person.department}</span>
            </p>
            <p className="text-sm text-muted-foreground bg-muted/50 inline-block px-3 py-1 rounded-full">
              {person.designation}
            </p>
          </div>
        </div>

        <Button
          onClick={triggerConfetti}
          className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground font-semibold text-lg py-6 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.5)] hover:shadow-[0_20px_60px_-10px_hsl(var(--primary)/0.6)] transition-all duration-300 hover:scale-105"
        >
          🎉 Wish Happy Birthday! 🎉
        </Button>
      </div>
    </Card>
  );
};

export default BirthdayCard;