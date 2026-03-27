import { Subscription } from "./data/subscriptions";

export interface UserSubscription {
  sub: Subscription;
  price: number;
  isCustom?: boolean;
}
