import { defineField, defineType } from "sanity";

export default defineType({
  name: "chapterApplication",
  title: "Chapter Application",
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
      name: "role",
      title: "Role / Background",
      type: "string",
      description:
        "This can later help shape the chapter style or admin understanding of the applicant.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publicDescription",
      title: "Public Chapter Description",
      type: "text",
      rows: 5,
      description:
        "A short public-facing description that can later be adapted for the real Chapter page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "networkDescription",
      title: "Local Network / Access",
      type: "text",
      rows: 5,
      description:
        "Internal/admin review field describing local access, partners, venues, and network strength.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "conceptVision",
      title: "Internal Vision / Why This Chapter Should Exist",
      type: "text",
      rows: 6,
      description:
        "This is more internal and editorial. It helps the admin understand the long-term vision and fit.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "portfolioLink",
      title: "Portfolio Link",
      type: "url",
    }),
    defineField({
      name: "cityPhoto",
      title: "City Photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().assetRequired(),
    }),
    defineField({
      name: "proposalFile",
      title: "Proposal File",
      type: "file",
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
