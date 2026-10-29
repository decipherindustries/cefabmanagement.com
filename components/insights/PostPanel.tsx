import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NewsletterSignup } from "@/components/insights/NewsletterSignup";
import { href, type Locale } from "@/lib/routes";
import type { Dictionary } from "@/content";

// End-of-article panel: "Work with me" on the left, newsletter sign-up on the right.
export function PostPanel({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const p = dict.insights.panel;
  return (
    <aside className="ck-post-panel" aria-label={p.workTitle}>
      <div className="ck-post-panel__work">
        <h2 className="ck-post-panel__title">{p.workTitle}</h2>
        <p className="ck-post-panel__body">{p.workBody}</p>
        <div>
          <Button variant="inverse" size="lg" href={href("contact", locale)} iconRight={<ArrowRight />}>
            {p.workCta}
          </Button>
        </div>
      </div>
      <div className="ck-post-panel__signup">
        <NewsletterSignup dict={dict} locale={locale} tone="dark" />
      </div>
    </aside>
  );
}
