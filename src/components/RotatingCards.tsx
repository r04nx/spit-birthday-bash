import { BirthdayPerson } from "@/lib/birthdayParser";
import { Card } from "./ui/card";
import { Cake } from "lucide-react";

interface RotatingCardsProps {
  people: BirthdayPerson[];
}

const RotatingCards = ({ people }: RotatingCardsProps) => {
  if (people.length === 0) return null;

  return (
    <div className="py-8 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        This Month's Celebrations 🎊
      </h2>
      
      <div className="flex gap-6 animate-marquee hover:pause">
        {[...people, ...people].map((person, index) => {
          const defaultImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(person.name);
          
          return (
            <Card
              key={index}
              className="flex-shrink-0 w-64 p-6 bg-gradient-to-br from-card to-card/80 border-2 border-primary/20 shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.3)] hover:shadow-[0_12px_40px_-8px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={person.image || defaultImage}
                    alt={person.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                  <div className="absolute -top-1 -right-1 bg-secondary rounded-full p-1">
                    <Cake className="w-4 h-4 text-secondary-foreground" />
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="font-display font-bold text-lg text-foreground">{person.name}</h3>
                  <p className="text-sm font-semibold text-primary">{person.birthday}</p>
                  <p className="text-xs text-muted-foreground">{person.department}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RotatingCards;