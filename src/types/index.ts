import { Timestamp } from 'firebase/firestore';

export interface Package {
  id: string;
  category: 'Gym Membership' | 'Personal Training';
  name: string;
  price: number;
  durationDays: number;
  isActive: boolean;
  order: number;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  bio: string;
  certifications: string[];
  imageUrl?: string;
  order: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewText: string;
  rating: number;
  memberType?: string;
  isVisible: boolean;
  createdAt: Timestamp;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string;
  category: string;
  order: number;
}

export interface Enquiry {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  interestedIn: string;
  heardFrom: string;
  status: 'new';
}
