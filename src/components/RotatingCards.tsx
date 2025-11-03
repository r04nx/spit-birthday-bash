import { BirthdayPerson } from "@/lib/birthdayParser";
import { Card } from "./ui/card";
import { Cake } from "lucide-react";
import { useState } from "react";

interface RotatingCardsProps {
  people: BirthdayPerson[];
}

interface PersonCardProps {
  person: BirthdayPerson;
  index: number;
}

const PersonCard = ({ person, index }: PersonCardProps) => {
  const defaultImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(person.name);
  const [imageSrc, setImageSrc] = useState(person.image || defaultImage);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(defaultImage);
    }
  };

  return (
    <Card
      key={index}
      className="flex-shrink-0 p-4 bg-gradient-to-br from-card to-card/80 border-2 border-primary/20 shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.3)] hover:shadow-[0_12px_40px_-8px_hsl(var(--primary)/0.4)] hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          <img
            src={imageSrc}
            alt={person.name}
            onError={handleImageError}
            className="relative w-20 h-20 rounded-full object-cover border-2 border-card shadow-lg ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all"
          />
          <div className="absolute -top-1 -right-1 bg-secondary rounded-full p-1.5 shadow-lg group-hover:scale-110 transition-transform">
            <Cake className="w-4 h-4 text-secondary-foreground" />
          </div>
        </div>
        
        <div className="text-left space-y-0.5 flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">{person.name}</h3>
          <p className="text-sm font-semibold text-primary truncate">{person.birthday}</p>
          <p className="text-xs text-muted-foreground truncate">{person.department}</p>
        </div>
      </div>
    </Card>
  );
};

const RotatingCards = ({ people }: RotatingCardsProps) => {
  if (people.length === 0) return null;

  // Only duplicate for infinite scroll if we have 4 or more entries
  // For fewer entries, show them once without duplication
  const displayPeople = people.length >= 4 ? [...people, ...people] : people;
  const shouldAnimate = people.length >= 4;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      
      <div className="h-full overflow-hidden px-2">
        <div className={`flex flex-col gap-3 ${shouldAnimate ? 'animate-marquee-vertical' : ''} hover:pause py-4`}>
          {displayPeople.map((person, index) => (
            <PersonCard key={index} person={person} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RotatingCards;