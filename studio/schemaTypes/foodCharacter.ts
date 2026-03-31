import { defineField, defineType } from "sanity";

export default defineType({
  name: "foodCharacter",
  title: "Food Character",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Profile Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "cityRef",
      title: "City",
      type: "reference",
      to: [{ type: "city" }],
      description:
        "Recommended: select a City document here. This will become the main structured location source.",
    }),
    defineField({
      name: "location",
      title: "Location (Legacy Fallback)",
      type: "string",
      description:
        "Keep this for now so the current frontend keeps working during migration. Use the same value as the selected City document.",
    }),
    defineField({
      name: "country",
      title: "Country (Legacy Fallback)",
      type: "string",
      description:
        "Keep this for now so the current frontend keeps working during migration. Use the same value as the selected City document.",
    }),
    defineField({
      name: "email",
      title: "Private Contact Email",
      type: "string",
      description:
        "Internal/admin-only use. Not shown publicly. Used when someone connects with this Food Character through the platform.",
    }),
    defineField({
      name: "chapter",
      title: "Linked Chapter",
      type: "reference",
      to: [{ type: "chapter" }],
      description:
        "Recommended: directly link this Food Character to a Chapter for stronger connections.",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "characterCategory" }],
        },
      ],
      description:
        "Select reusable character categories. Create new ones in the Character Category section when needed.",
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "string",
    }),
    defineField({
      name: "canRelocate",
      title: "Can Relocate",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "menu",
      title: "Menu Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "url" }],
    }),
  ],
});
