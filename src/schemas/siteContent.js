import { z } from "zod";
import {
  checklistEntrySchema,
  ctaSchema,
  documentSchema,
  draftVideoIdSchema,
  emailSchema,
  externalUrlSchema,
  faqEntrySchema,
  internalRouteSchema,
  mediaSourceSchema,
  optionalStringSchema,
  photoSchema,
  requiredStringSchema as text,
  stableIdSchema,
  timelineEntrySchema,
  uniqueIdCollection,
} from "./fields.js";

const navigationLinkSchema = z.strictObject({ id: stableIdSchema, label: text, to: internalRouteSchema });
const navigationEntrySchema = navigationLinkSchema.partial({ to: true }).extend({
  children: uniqueIdCollection(navigationLinkSchema).optional(),
}).refine(({ to, children }) => Boolean(to || children?.length) && (!children || children.length > 0), {
  path: ["children"],
  error: "Provide a route or a non-empty list of dropdown links.",
});

const directorSchema = z.strictObject({ id: stableIdSchema, name: text, role: text, bio: text, email: emailSchema });
const directorProfileSchema = directorSchema.extend({ photo: photoSchema });
const instrumentSchema = z.strictObject({ id: stableIdSchema, name: text, text, videoId: draftVideoIdSchema });
const rentalSchema = z.strictObject({
  id: stableIdSchema,
  name: text,
  text,
  cta: text,
  to: internalRouteSchema.optional(),
  href: externalUrlSchema.optional(),
}).refine(({ to, href }) => Boolean(to) !== Boolean(href), {
  path: ["href"],
  error: "Provide exactly one rental link, either an internal route or an external URL.",
});

const textCardSchema = z.strictObject({ title: text, text });
const linkCardSchema = textCardSchema.extend({ cta: text });
const headerSchema = z.strictObject({ title: text, intro: text });
const languageOptionSchema = z.strictObject({ id: stableIdSchema, value: text, label: text });
const languageTagSchema = text.refine((value) => {
  try {
    return Intl.getCanonicalLocales(value).length === 1;
  } catch {
    return false;
  }
}, { error: "Enter a language tag such as en or en-US." });

export const sectionSchemas = Object.freeze({
  SCHOOL: text,
  BOOSTER_URL: externalUrlSchema,
  DIRECTOR_EMAIL: emailSchema,
  NAV: uniqueIdCollection(navigationEntrySchema),
  DIRECTORS: uniqueIdCollection(directorSchema),
  INSTRUMENTS: uniqueIdCollection(instrumentSchema),
  INSTRUMENT_FAQ: uniqueIdCollection(faqEntrySchema),
  RENTALS: uniqueIdCollection(rentalSchema),
  INSTRUMENT_STEPS: uniqueIdCollection(textCardSchema.extend({ id: stableIdSchema })),
  RETURNING_DATES: uniqueIdCollection(timelineEntrySchema),
  UIL_DATES: uniqueIdCollection(timelineEntrySchema),
  DOCUMENTS: uniqueIdCollection(documentSchema),
  SITE_METADATA: z.strictObject({ title: text, language: languageTagSchema }),
  SHARED_CONTENT: z.strictObject({
    navigation: z.strictObject({
      skipLink: text,
      mainLabel: text,
      menuLabel: text,
      homeBreadcrumb: text,
      logo: z.strictObject({ src: mediaSourceSchema, alt: optionalStringSchema, label: text }),
    }),
    language: z.strictObject({ label: text, options: uniqueIdCollection(languageOptionSchema) }),
    media: z.strictObject({
      photoPlaceholder: text,
      listeningExampleTitle: text.refine((value) => value.includes("{instrument}"), {
        error: "Include the {instrument} placeholder for the instrument name.",
      }),
      videoPlaceholder: text.refine((value) => value.includes("{title}"), {
        error: "Include the {title} placeholder for the video title.",
      }),
    }),
    documents: z.strictObject({ formatLabel: text, downloadLabel: text }),
    contactHeading: text,
  }),
  FOOTER_CONTENT: z.strictObject({ heading: text, email: emailSchema, boosterLabel: text, boosterUrl: externalUrlSchema, pagesHeading: text }),
  HOME_PAGE: z.strictObject({
    hero: z.strictObject({ title: text, welcome: text, joinLabel: text, returningLabel: text, photo: photoSchema }),
    quickLinks: z.strictObject({ heading: text, newToOrchestra: linkCardSchema, returningMembers: linkCardSchema, gettingAnInstrument: linkCardSchema }),
    gallery: z.strictObject({ heading: text, photos: uniqueIdCollection(photoSchema.extend({ id: stableIdSchema })), notice: text }),
    cta: ctaSchema.omit({ label: true }).extend({ text, newToOrchestraLabel: text, directorsLabel: text }),
  }),
  DIRECTORS_PAGE: z.strictObject({
    title: text,
    profilesHeading: text,
    profiles: uniqueIdCollection(directorProfileSchema),
    orchestraHeading: text,
    groupPhoto: photoSchema,
    cta: ctaSchema,
  }),
  NEW_TO_ORCHESTRA_PAGE: z.strictObject({
    header: headerSchema,
    welcome: z.strictObject({ heading: text, title: text, text, returningPrompt: text, returningLabel: text, instrumentLabel: text, photo: photoSchema }),
    instrumentsHeading: text,
    sizing: textCardSchema,
    faqHeading: text,
    cta: ctaSchema,
  }),
  GETTING_AN_INSTRUMENT_PAGE: z.strictObject({
    header: headerSchema,
    stepsHeading: text,
    rentalsHeading: text,
    faq: z.strictObject({ heading: text, items: uniqueIdCollection(faqEntrySchema) }),
  }),
  RETURNING_MEMBERS_PAGE: z.strictObject({
    header: headerSchema,
    beginnerCallout: z.strictObject({ text, label: text }),
    datesHeading: text,
    reenrollment: z.strictObject({ heading: text, checklist: uniqueIdCollection(checklistEntrySchema), photo: photoSchema }),
    auditions: z.strictObject({ heading: text, chairPlacement: textCardSchema, advancedGroups: textCardSchema }),
    opportunities: z.strictObject({ heading: text, uil: linkCardSchema, leadership: textCardSchema, performances: textCardSchema }),
  }),
  UIL_PAGE: z.strictObject({
    title: text,
    overview: z.strictObject({ heading: text, text, photo: photoSchema }),
    timelineHeading: text,
    otherGroups: z.strictObject({ heading: text, groups: uniqueIdCollection(textCardSchema.extend({ id: stableIdSchema })) }),
    documentsHeading: text,
  }),
});

export const siteContentSchema = z.strictObject(sectionSchemas);
