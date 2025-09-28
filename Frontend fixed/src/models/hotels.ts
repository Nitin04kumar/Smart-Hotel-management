export type RoomType = 'standard' | 'deluxe' | 'suite';
 
export type Hotel = {
  id: string;
  name: string;
  location: string;
  images: string[];
  amenities: string[];
  rating: number; // 0-5
  rooms: Record<RoomType, { price: number; available: number }>;
};
 
export const hotels: Hotel[] = [
  {
    id: 'h1',
    name: 'Grand Central Hotel',
    location: 'New York',
    images: ['https://tse2.mm.bing.net/th/id/OIP.ygRkwUDQ-JLtVnskkE4UhAHaE8?w=180&h=150&c=6&r=0&o=7&dpr=1.5&pid=1.7&rm=3?', '/placeholder.svg?height=160&width=240&text=Lobby'],
    amenities: ['Free Wi-Fi', 'Gym', 'Spa', 'Pool', 'Restaurant'],
    rating: 4.5,
    rooms: {
      standard: { price: 120, available: 10 },
      deluxe: { price: 180, available: 5 },
      suite: { price: 260, available: 2 },
    },
  },
  {
    id: 'h2',
    name: 'Eiffel View Suites',
    location: 'Paris',
    images: ['https://tse3.mm.bing.net/th/id/OIP._D0o_ubVQF6BCNQMSrKBGAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', '/placeholder.svg?height=160&width=240&text=Suite'],
    amenities: ['Breakfast', 'Airport Shuttle', 'Free Wi-Fi', 'Bar'],
    rating: 4.7,
    rooms: {
      standard: { price: 150, available: 8 },
      deluxe: { price: 220, available: 4 },
      suite: { price: 320, available: 2 },
    },
  },
  {
    id: 'h3',
    name: 'Sakura Inn',
    location: 'Tokyo',
    images: ['https://tse3.mm.bing.net/th/id/OIP.Prj5jvX4y06_Awap8KUrMwHaEv?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', '/placeholder.svg?height=160&width=240&text=Garden'],
    amenities: ['Onsen', 'Free Wi-Fi', 'Tea Lounge', 'Laundry'],
    rating: 4.4,
    rooms: {
      standard: { price: 90, available: 12 },
      deluxe: { price: 140, available: 6 },
      suite: { price: 210, available: 3 },
    },
  },
  {
    id: 'h4',
    name: 'Charminar Residency',
    location: 'Hyderabad',
    images: ['https://tse3.mm.bing.net/th/id/OIP.na7Bi862H9uhcHj-2JnH3wHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', '/placeholder.svg?height=160&width=240&text=Lobby'],
    amenities: ['Free Wi-Fi', 'Breakfast', 'Airport Shuttle', 'Gym'],
    rating: 4.3,
    rooms: {
      standard: { price: 100, available: 8 },
      deluxe: { price: 160, available: 5 },
      suite: { price: 240, available: 2 },
    },
  },
  {
    id: 'h5',
    name: 'Deccan Comforts',
    location: 'Pune',
    images: ['https://www.agoda.com/wp-content/uploads/2024/11/O-Hotel-Pune-Koregaon-Park.jpg', '/placeholder.svg?height=160&width=240&text=Suite'],
    amenities: ['Free Wi-Fi', 'Restaurant', 'Bar', 'Laundry'],
    rating: 4.2,
    rooms: {
      standard: { price: 95, available: 9 },
      deluxe: { price: 150, available: 6 },
      suite: { price: 220, available: 3 },
    },
  },
  {
    id: 'h6',
    name: 'Capital View Hotel',
    location: 'Delhi',
    images: ['https://www.roseatehotels.com/newdelhi/roseatehouse/wp-content/uploads/2020/08/infinity-swimming-pool-aerocity-1024x601.jpg', '/placeholder.svg?height=160&width=240&text=Lobby'],
    amenities: ['Free Wi-Fi', 'Gym', 'Spa', 'Restaurant'],
    rating: 4.6,
    rooms: {
      standard: { price: 110, available: 10 },
      deluxe: { price: 180, available: 5 },
      suite: { price: 260, available: 3 },
    },
  },
  {
    id: 'h7',
    name: 'Marina Bay Inn',
    location: 'Chennai',
    images: ['https://tse1.mm.bing.net/th/id/OIP.6ztR_4_Z58KDTt2wgYmS3wHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', '/placeholder.svg?height=160&width=240&text=Sea'] ,
    amenities: ['Free Wi-Fi', 'Pool', 'Restaurant', 'Airport Shuttle'],
    rating: 4.1,
    rooms: {
      standard: { price: 90, available: 12 },
      deluxe: { price: 140, available: 7 },
      suite: { price: 210, available: 3 },
    },
  },
  {
    id: 'h8',
    name: 'Silicon Valley Suites',
    location: 'Bangalore',
    images: ['https://media.boutiquehotel.me/hotel/cover/252219_1516798033.jpg', '/placeholder.svg?height=160&width=240&text=Garden'],
    amenities: ['Free Wi-Fi', 'Bar', 'Gym', 'Laundry'],
    rating: 4.5,
    rooms: {
      standard: { price: 120, available: 10 },
      deluxe: { price: 180, available: 6 },
      suite: { price: 260, available: 3 },
    },
  },
];