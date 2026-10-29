// X/Twitter uses the same generated article image as Open Graph.
// Next.js requires route segment config to be declared literally, not re-exported.
export { default, size, contentType, alt, generateStaticParams } from "./opengraph-image";
export const dynamicParams = false;
