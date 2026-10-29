"use client";
import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const getSnapshot = () => new URLSearchParams(window.location.search).get("subscribed") === "1";
const getServerSnapshot = () => false;

// Reads the query string on the client only, so the page itself stays static.
export function SubscribedNotice({ message }: { message: string }) {
  const show = useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
  if (!show) return null;
  return <div className="cc-card cc-card--soft cc-card--pad-lg" role="status">{message}</div>;
}
