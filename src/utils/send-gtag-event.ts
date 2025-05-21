export default function sendGtagEvent(eventName: string, properties: Record<string, any>): void {
  if (window.zaraz) {
    window.zaraz.track(eventName, properties);
  }
}
