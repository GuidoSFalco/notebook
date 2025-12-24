
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: string;
  category: string;
  organizer: string;
}

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Jazz Night Under the Stars',
    description: 'Experience an evening of smooth jazz with the city skyline as your backdrop. Featuring local artists and gourmet food trucks.',
    date: '2024-06-15T19:00:00',
    location: 'Central Park, New York',
    image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2400&auto=format&fit=crop',
    price: '$25',
    category: 'Music',
    organizer: 'City Vibe Events'
  },
  {
    id: '2',
    title: 'Tech Innovators Summit',
    description: 'Join leading minds in technology for a day of inspiring talks, networking, and demos of the latest gadgets.',
    date: '2024-07-10T09:00:00',
    location: 'Moscone Center, San Francisco',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2400&auto=format&fit=crop',
    price: '$150',
    category: 'Technology',
    organizer: 'TechWorld'
  },
  {
    id: '3',
    title: 'Culinary Masterclass: Italian',
    description: 'Learn to cook authentic Italian pasta from scratch with Chef Giovanni. Ingredients and wine pairing included.',
    date: '2024-06-20T18:00:00',
    location: 'The Kitchen Studio, Chicago',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2400&auto=format&fit=crop',
    price: '$85',
    category: 'Food',
    organizer: 'Culinary Arts School'
  },
  {
    id: '4',
    title: 'Morning Yoga by the Beach',
    description: 'Start your day with a refreshing yoga session on the sand. All levels welcome. Bring your own mat.',
    date: '2024-06-22T07:00:00',
    location: 'Santa Monica Beach, LA',
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2400&auto=format&fit=crop',
    price: 'Free',
    category: 'Health',
    organizer: 'Zen Life'
  },
  {
    id: '5',
    title: 'Abstract Art Exhibition',
    description: 'A showcase of contemporary abstract art from emerging artists around the globe.',
    date: '2024-07-05T10:00:00',
    location: 'Modern Art Gallery, Seattle',
    image: 'https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=2400&auto=format&fit=crop',
    price: '$12',
    category: 'Art',
    organizer: 'Art Collective'
  },
];
