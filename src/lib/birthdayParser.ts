export interface BirthdayPerson {
  name: string;
  birthday: string;
  department: string;
  designation: string;
  image: string;
}

export const parseBirthdayFile = (content: string): BirthdayPerson[] => {
  const entries = content.split('[').filter(entry => entry.trim());
  
  return entries.map(entry => {
    const lines = entry.split('\n').filter(line => line.trim() && !line.trim().startsWith(']'));
    
    const person: Partial<BirthdayPerson> = {};
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      if (key.toLowerCase().includes('name')) {
        person.name = value;
      } else if (key.toLowerCase().includes('birthday') || key.toLowerCase().includes('birtday')) {
        person.birthday = value;
      } else if (key.toLowerCase().includes('department')) {
        person.department = value;
      } else if (key.toLowerCase().includes('designation')) {
        person.designation = value;
      } else if (key.toLowerCase().includes('image')) {
        person.image = value;
      }
    });
    
    return person as BirthdayPerson;
  }).filter(person => person.name && person.birthday);
};

export const filterByCurrentMonth = (people: BirthdayPerson[]): BirthdayPerson[] => {
  const currentMonth = new Date().toLocaleString('en', { month: 'long' });
  
  return people.filter(person => {
    const birthday = person.birthday.toLowerCase();
    return birthday.includes(currentMonth.toLowerCase());
  });
};

export const loadBirthdayData = async (): Promise<BirthdayPerson[]> => {
  try {
    const response = await fetch('/birthdays.txt');
    const content = await response.text();
    return parseBirthdayFile(content);
  } catch (error) {
    console.error('Error loading birthday data:', error);
    return [];
  }
};