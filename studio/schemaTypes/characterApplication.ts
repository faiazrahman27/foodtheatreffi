import { defineField, defineType } from "sanity";

export default defineType({
  name: "characterApplication",
  title: "Character Application",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cuisineStyle",
      title: "Cuisine / Style / Format",
      type: "string",
      description:
        "This can later be used as a category or tag for the public profile.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publicBio",
      title: "Public Bio",
      type: "text",
      rows: 5,
      description:
        "A short profile-style bio that can be adapted for the public Food Character page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "portfolioLink",
      title: "Portfolio Link",
      type: "url",
    }),
    defineField({
      name: "story",
      title: "Story / Why You Fit Food Theatre",
      type: "text",
      rows: 6,
      description:
        "This is more internal and editorial. It helps the admin understand motivation, fit, and point of view.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "characterPhoto",
      title: "Character Photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().assetRequired(),
    }),
    defineField({
      name: "cvFile",
      title: "CV File",
      type: "file",
      validation: (Rule) => Rule.required().assetRequired(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Contacted", value: "contacted" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: [
          { title: "Low", value: "low" },
          { title: "Medium", value: "medium" },
          { title: "High", value: "high" },
        ],
      },
      initialValue: "medium",
    }),
    defineField({
      name: "decision",
      title: "Decision",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Shortlisted", value: "shortlisted" },
          { title: "Accepted", value: "accepted" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "contactedAt",
      title: "Contacted At",
      type: "datetime",
    }),
    defineField({
      name: "adminNotes",
      title: "Admin Notes",
      type: "text",
      rows: 4,
    }),
  ],
});
