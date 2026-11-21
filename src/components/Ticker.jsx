import { getTickerItems } from "../lib/api";
import TickerLive from "./TickerLive";

export default async function Ticker() {
  let items = [];
  let feedError = "";

  try {
    items = await getTickerItems();
  } catch (error) {
    feedError = error.message;
  }

  return <TickerLive initialError={feedError} initialItems={items} />;
}
