export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  location: string;
  image: string;
  price: number;
  category: string;
  organizer: string;
  attendees: number;
}
