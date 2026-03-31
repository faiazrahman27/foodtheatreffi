import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "./sanity.client";

const builder = imageUrlBuilder({
  projectId,
  dataset,
});

export function urlFor(source: unknown) {
  return builder.image(source);
}