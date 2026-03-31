import { defineField, defineType } from "sanity";

export default defineType({
  name: "chapter",
  title: "Chapter",
  type: "document",
  fields: [
    defineField({
      name: "cityRef",
      title: "City",
      type: "reference",
      to: [{ type: "city" }],
      description:
        "Recommended: select a City document here. This will become the main structured location source.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City (Legacy Fallback)",
      type: "string",
      description:
        "Keep this for now so the current frontend keeps working during migration. Use the same value as the selected City document.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "city",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country (Legacy Fallback)",
      type: "string",
      description:
        "Keep this for now so the current frontend keeps working during migration. Use the same value as the selected City document.",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "chapterStyle",
      title: "Chapter Style",
      type: "reference",
      to: [{ type: "chapterStyle" }],
      description: "Select a reusable chapter style.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
