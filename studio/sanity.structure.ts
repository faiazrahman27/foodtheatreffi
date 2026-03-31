import type { StructureResolver } from "sanity/structure";

const APPLICATION_TYPES = [
  "bookingRequest",
  "characterApplication",
  "chapterApplication",
  "generalInquiry",
  "foodCharacter",
  "experience",
  "chapter",
  "journalPost",
];

function statusFilteredList(
  S: Parameters<StructureResolver>[0],
  {
    title,
    schemaType,
    status,
  }: {
    title: string;
    schemaType: string;
    status: string;
  }
) {
  return S.listItem()
    .title(title)
    .child(
      S.documentList()
        .title(title)
        .schemaType(schemaType)
        .filter('_type == $type && status == $status')
        .params({
          type: schemaType,
          status,
        })
        .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
    );
}

function allDocumentsList(
  S: Parameters<StructureResolver>[0],
  {
    title,
    schemaType,
  }: {
    title: string;
    schemaType: string;
  }
) {
  return S.listItem()
    .title(title)
    .child(
      S.documentTypeList(schemaType)
        .title(title)
        .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Food Theatre")
    .items([
      S.listItem()
        .title("Applications")
        .child(
          S.list()
            .title("Applications")
            .items([
              S.listItem()
                .title("Booking Requests")
                .child(
                  S.list()
                    .title("Booking Requests")
                    .items([
                      statusFilteredList(S, {
                        title: "New Booking Requests",
                        schemaType: "bookingRequest",
                        status: "new",
                      }),
                      statusFilteredList(S, {
                        title: "Reviewed Booking Requests",
                        schemaType: "bookingRequest",
                        status: "reviewed",
                      }),
                      statusFilteredList(S, {
                        title: "Contacted Booking Requests",
                        schemaType: "bookingRequest",
                        status: "contacted",
                      }),
                      statusFilteredList(S, {
                        title: "Closed Booking Requests",
                        schemaType: "bookingRequest",
                        status: "closed",
                      }),
                      S.divider(),
                      allDocumentsList(S, {
                        title: "All Booking Requests",
                        schemaType: "bookingRequest",
                      }),
                    ])
                ),

              S.listItem()
                .title("Character Applications")
                .child(
                  S.list()
                    .title("Character Applications")
                    .items([
                      statusFilteredList(S, {
                        title: "New Character Applications",
                        schemaType: "characterApplication",
                        status: "new",
                      }),
                      statusFilteredList(S, {
                        title: "Reviewed Character Applications",
                        schemaType: "characterApplication",
                        status: "reviewed",
                      }),
                      statusFilteredList(S, {
                        title: "Contacted Character Applications",
                        schemaType: "characterApplication",
                        status: "contacted",
                      }),
                      statusFilteredList(S, {
                        title: "Closed Character Applications",
                        schemaType: "characterApplication",
                        status: "closed",
                      }),
                      S.divider(),
                      allDocumentsList(S, {
                        title: "All Character Applications",
                        schemaType: "characterApplication",
                      }),
                    ])
                ),

              S.listItem()
                .title("Chapter Applications")
                .child(
                  S.list()
                    .title("Chapter Applications")
                    .items([
                      statusFilteredList(S, {
                        title: "New Chapter Applications",
                        schemaType: "chapterApplication",
                        status: "new",
                      }),
                      statusFilteredList(S, {
                        title: "Reviewed Chapter Applications",
                        schemaType: "chapterApplication",
                        status: "reviewed",
                      }),
                      statusFilteredList(S, {
                        title: "Contacted Chapter Applications",
                        schemaType: "chapterApplication",
                        status: "contacted",
                      }),
                      statusFilteredList(S, {
                        title: "Closed Chapter Applications",
                        schemaType: "chapterApplication",
                        status: "closed",
                      }),
                      S.divider(),
                      allDocumentsList(S, {
                        title: "All Chapter Applications",
                        schemaType: "chapterApplication",
                      }),
                    ])
                ),

              S.listItem()
                .title("General Inquiries")
                .child(
                  S.list()
                    .title("General Inquiries")
                    .items([
                      statusFilteredList(S, {
                        title: "New General Inquiries",
                        schemaType: "generalInquiry",
                        status: "new",
                      }),
                      statusFilteredList(S, {
                        title: "Reviewed General Inquiries",
                        schemaType: "generalInquiry",
                        status: "reviewed",
                      }),
                      statusFilteredList(S, {
                        title: "Contacted General Inquiries",
                        schemaType: "generalInquiry",
                        status: "contacted",
                      }),
                      statusFilteredList(S, {
                        title: "Closed General Inquiries",
                        schemaType: "generalInquiry",
                        status: "closed",
                      }),
                      S.divider(),
                      allDocumentsList(S, {
                        title: "All General Inquiries",
                        schemaType: "generalInquiry",
                      }),
                    ])
                ),
            ])
        ),

      S.listItem()
        .title("Platform Content")
        .child(
          S.list()
            .title("Platform Content")
            .items([
              S.documentTypeListItem("foodCharacter").title("Food Characters"),
              S.documentTypeListItem("experience").title("Experiences"),
              S.documentTypeListItem("chapter").title("Chapters"),
              S.documentTypeListItem("journalPost").title("Journal Posts"),
            ])
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !APPLICATION_TYPES.includes(listItem.getId() || "")
      ),
    ]);
