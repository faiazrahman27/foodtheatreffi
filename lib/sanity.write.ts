import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./sanity.client";

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
