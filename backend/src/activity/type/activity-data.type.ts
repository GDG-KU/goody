export type ActivityData = {
  id: number;
  userId: number;
  title: string;
  description: string;
  locationName: string;
  imageUrl: string;
  activityKeywords: {
    id: number;
    keywordId: number;
  }[];
};
