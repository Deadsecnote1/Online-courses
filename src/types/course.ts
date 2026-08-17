export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Development' | 'IT & Security' | 'Business' | 'Design' | 'Marketing' | 'Data Science' | 'Personal Development';
  instructor: string;
  rating: number;
  reviews_count: number;
  students_count: number;
  original_price: number;
  coupon_code: string;
  destination_url: string; // Udemy URL wrapped with affiliate tracking
  raw_udemy_url: string;
  created_at: string;
  expires_at: string;
  is_expired: boolean;
  is_featured?: boolean;
  report_count: number;
  image_url: string;
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Expert';
  duration: string; // e.g. "12.5 total hours"
  language: string;
}

export type CategoryFilter = 'All' | Course['category'];

export interface ReportPayload {
  course_id: string;
  reason: 'expired_code' | 'wrong_price' | 'broken_link' | 'other';
  notes?: string;
}
