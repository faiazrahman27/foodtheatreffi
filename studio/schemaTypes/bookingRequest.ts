import { defineField, defineType } from "sanity";

export default defineType({
  name: "bookingRequest",
  title: "Booking Request",
  type: "document",
  fields: [
    defineField({
      name: "experienceTitle",
      title: "Experience Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
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
      name: "preferredDate",
      title: "Preferred Date",
      type: "string",
    }),
    defineField({
      name: "guestCount",
      title: "Guest Count",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 5,
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
