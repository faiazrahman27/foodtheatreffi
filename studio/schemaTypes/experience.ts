import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "cityRef",
      title: "City",
      type: "reference",
      to: [{ type: "city" }],
    }),

    defineField({
      name: "city",
      title: "City (Fallback)",
      type: "string",
    }),

    defineField({
      name: "country",
      title: "Country (Fallback)",
      type: "string",
    }),

    defineField({
      name: "format",
      title: "Format",
      type: "reference",
      to: [{ type: "experienceFormat" }],
      description: "Select a reusable experience format",
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "string",
    }),

    defineField({
      name: "bookingStyle",
      title: "Booking Style",
      type: "string",
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "foodCharacter",
      title: "Food Character",
      type: "reference",
      to: [{ type: "foodCharacter" }],
    }),

    defineField({
      name: "chapter",
      title: "Chapter",
      type: "reference",
      to: [{ type: "chapter" }],
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
