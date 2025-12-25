export interface Team {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  logoUrl: string;
  color: string;
  seasonWins: number;
  seasonLosses: number;
  ranking: number;
  defaultSkaterImage: string;
  type: string;
}
