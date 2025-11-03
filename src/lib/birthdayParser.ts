export interface BirthdayPerson {
  name: string;
  birthday: string;
  department: string;
  designation: string;
  image: string;
}

export const parseBirthdayFile = (content: string): BirthdayPerson[] => {
  // Remove commented lines (lines starting with #)
  const cleanedContent = content
    .split('\n')
    .filter(line => !line.trim().startsWith('#'))
    .join('\n');
  
  const entries = cleanedContent.split('[').filter(entry => entry.trim());
  
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
    // Add cache-busting to ensure fresh data
    const response = await fetch('/birthdays.txt?t=' + new Date().getTime(), {
      cache: 'no-store'
    });
    const content = await response.text();
    console.log('Loaded birthday file content:', content);
    const parsed = parseBirthdayFile(content);
    console.log('Parsed birthday data:', parsed);
    return parsed;
  } catch (error) {
    console.error('Error loading birthday data:', error);
    return [];
  }
};