export type CreateActivityData = {
  title: string;
  description: string;
  locationName: string;
  keywords: number[];
  imageUrl?: string | null;
  userId: number;
};
