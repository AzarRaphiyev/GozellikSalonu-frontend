// components/reservation/types.ts faylında:
export interface Service {
  id: string; // və ya number, backend-dən asılı olaraq
  name: string;
  description: string;
  durationInMinutes: number; // Köhnə 'duration' əvəzinə bunu əlavə edin
  price: string;
  // Əgər köhnə kodların sıradan çıxmasını istəmirsinizsə, duration-u opsional saxlaya bilərsiniz:
  duration?: string; 
}

export interface Professional {
  id: number;
  name: string;           // Backend-dən "Usta Əli" olaraq gəlir
  title: string;          // Backend-dən "Bərbər" və ya "Stilist" olaraq gəlir
  email: string;
  profileImageUrl?: string | null; // Backend-də dəqiq bu addadır
  createdAt?: string;
  updatedAt?: string;
  
  // Əgər köhnə kodların işləməsini istəyirsənsə, bunları opsional saxlaya bilərsən:
  firstName?: string;
  lastName?: string;
  specialty?: string;
}

export interface ReservationData {
  service: Service | null;
  professional: Professional | null;
  date: Date | null;
  time: string | null;
}
