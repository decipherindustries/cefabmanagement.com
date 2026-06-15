import { Badge } from "./Badge";
import { CheckItem } from "./CheckItem";

export interface Tier {
  name: string; popular?: boolean; availability: string; forWhom: string; features: string[];
}

export function PricingCard({ name, popular, availability, forWhom, features, popularLabel }: Tier & { popularLabel: string }) {
  return (
    <div className={`cc-price ${popular ? "cc-price--featured" : ""}`.trim()}>
      {popular && (
        <span className="cc-price__flag"><Badge variant="accent">{popularLabel}</Badge></span>
      )}
      <h3 className="cc-price__name">{name}</h3>
      <p className="cc-price__avail">{availability}</p>
      <p className="cc-price__for">{forWhom}</p>
      <hr className="cc-price__rule" />
      <div className="cc-price__list">
        {features.map((f) => (
          <CheckItem key={f} tone={popular ? "onDark" : "accent"}>{f}</CheckItem>
        ))}
      </div>
    </div>
  );
}
