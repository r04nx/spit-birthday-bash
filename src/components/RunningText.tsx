import { BirthdayPerson } from "@/lib/birthdayParser";

interface RunningTextProps {
  people: BirthdayPerson[];
}

const RunningText = ({ people }: RunningTextProps) => {
  const names = people.map(p => p.name).join(" 🎂 ");
  const doubledNames = `${names} 🎂 ${names}`;

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent py-4 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)]">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-xl md:text-2xl font-bold text-primary-foreground px-4">
          {doubledNames}
        </span>
        <span className="text-xl md:text-2xl font-bold text-primary-foreground px-4">
          {doubledNames}
        </span>
      </div>
    </div>
  );
};

export default RunningText;