export interface CacheMessage {
  createdAt: Date;
  user: {
    id: string;
    username: string;
  };
  content: string;
  msgRead: boolean;
}
