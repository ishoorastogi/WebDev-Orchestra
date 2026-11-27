// all editable site content lives here. replace [bracketed] placeholders with real info.
// Keep IDs fixed when editing copy or reordering entries.

// school name in nav
export const SCHOOL = "Durham Middle School Orchestra";
export const BOOSTER_URL = "https://example.com/booster"; // todo: existing booster website
export const DIRECTOR_EMAIL = "director@example.org"; // todo

// nav links, children = dropdown
export const NAV = [
  { id: "nav-home", label: "Home", to: "/" },
  { id: "nav-directors", label: "Directors", to: "/directors" },
  { id: "nav-new-to-orchestra", label: "New to Orchestra", to: "/new-to-orchestra" },
  { id: "nav-getting-an-instrument", label: "Getting an Instrument", to: "/getting-an-instrument" },
  { id: "nav-returning-members", label: "Returning Members", to: "/returning-members" },
  { id: "nav-uil", label: "UIL & Groups", to: "/uil" },
];

const directorProfiles = [
  {
    id: "director-1",
    name: "[Director name]",
    role: "Orchestra Director",
    bio: "[Short bio: background, years teaching, favorite part of orchestra.]",
    email: "director1@example.org",
    photo: { src: "", alt: "", caption: "", label: "Director photo" },
  },
  {
    id: "director-2",
    name: "[Director name]",
    role: "Assistant Director",
    bio: "[Short bio.]",
    email: "director2@example.org",
    photo: { src: "", alt: "", caption: "", label: "Director photo" },
  },
];

// Keep the public contact-list shape while editing each profile and photo together.
export const DIRECTORS = directorProfiles.map(({ id, name, role, bio, email }) => ({ id, name, role, bio, email }));

// videoid: paste the youtube video id to show the embedded listening example.
// yt ids go in videoid
export const INSTRUMENTS = [
  { id: "instrument-violin", name: "Violin", videoId: "", text: "The most popular orchestra instrument and the highest in pitch. Violins often carry the melody and are usually the center of attention." },
  { id: "instrument-viola", name: "Viola", videoId: "", text: "The violin's laid-back older cousin. A little bigger and lower, with a warm sound that sits between the violin and the cello." },
  { id: "instrument-cello", name: "Cello", videoId: "", text: "Played sitting down with the instrument resting on the floor. It is the second-lowest and second-biggest string instrument." },
  { id: "instrument-bass", name: "Bass", videoId: "", text: "The biggest and lowest instrument in the orchestra. The bass is the foundation that everyone else builds on." },
];

export const INSTRUMENT_FAQ = [
  { id: "faq-practice", q: "How much practice is expected?", a: "[Answer: recommended minutes per week.]" },
  { id: "faq-switching", q: "Can I switch instruments?", a: "[Answer: switching policy.]" },
  { id: "faq-size", q: "What size instrument do I need?", a: "Students of any height can play any instrument because each comes in multiple sizes. [Add sizing details.]" },
  { id: "faq-where-to-rent", q: "Where do I rent?", a: "See the Getting an Instrument page for rental companies and school instruments." },
];

// rental co links
export const RENTALS = [
  { id: "rental-vendor-1", name: "company", text: "[Monthly fee, yearly fee, and how to sign up.]", href: "https://www.musicarts.com", cta: "Rent online" },
  { id: "rental-vendor-2", name: "compaany", text: "[Monthly fee, yearly fee, and how to sign up.]", href: "https://www.amazon.com", cta: "Rent online" },
  { id: "rental-school", name: "School instrument", text: "The directors have a very limited supply of school instruments for a yearly fee. [Details.]", to: "/directors", cta: "Ask the directors" },
];

// steps for getting an inst
export const INSTRUMENT_STEPS = [
  { id: "step-choose", title: "Choose an instrument", text: "Watch the videos on New to Orchestra." },
  { id: "step-rent-or-borrow", title: "Rent or borrow", text: "Pick a rental company or ask about a school instrument." },
  { id: "step-supplies", title: "Get supplies", text: "[Rosin, shoulder rest, and other supplies.]" },
  { id: "step-bring-to-class", title: "Bring it to class", text: "[First day instructions.]" },
];

// returning mbr dates
export const RETURNING_DATES = [
  { id: "returning-reenrollment", date: "[DATE]", title: "Re-enrollment opens", text: "[Details.]" },
  { id: "returning-forms", date: "[DATE]", title: "Forms due", text: "[Details.]" },
  { id: "returning-chair-placement", date: "[DATE]", title: "Chair placement", text: "[Details.]" },
  { id: "returning-rehearsal", date: "[DATE]", title: "First rehearsal", text: "[Details.]" },
];

//uil timeline
export const UIL_DATES = [
  { id: "uil-sign-up", date: "[DATE]", title: "Sign-up", text: "[Details.]" },
  { id: "uil-rehearsals", date: "[DATE]", title: "Rehearsals", text: "[Details.]" },
  { id: "uil-contest-day", date: "[DATE]", title: "Contest day", text: "[Details.]" },
  { id: "uil-results", date: "[DATE]", title: "Results", text: "[Details.]" },
];

// pdf forms live in public/forms
export const DOCUMENTS = [
  { id: "uil-document-1", name: "[Form name]", href: "/forms/form-1.pdf" },
  { id: "uil-document-2", name: "[Form name]", href: "/forms/form-2.pdf" },
  { id: "uil-document-3", name: "[Form name]", href: "/forms/form-3.pdf" },
];

export const SITE_METADATA = {
  title: SCHOOL,
  language: "en",
};

export const SHARED_CONTENT = {
  navigation: {
    skipLink: "Skip to content",
    mainLabel: "Main",
    menuLabel: "Menu",
    homeBreadcrumb: "Home",
    logo: { src: "", alt: "", label: "LOGO" },
  },
  language: {
    label: "Language",
    options: [
      { id: "language-en", value: "en", label: "EN" },
      { id: "language-es", value: "es", label: "ES" },
      { id: "language-idk", value: "idk", label: "IDK" },
    ],
  },
  media: {
    photoPlaceholder: "Photo",
    // Keep these tokens where the instrument name or video title should appear.
    listeningExampleTitle: "{instrument} listening example",
    videoPlaceholder: "Video coming soon: {title}",
  },
  documents: {
    formatLabel: "PDF",
    downloadLabel: "Download",
  },
  contactHeading: "Questions?",
};

export const FOOTER_CONTENT = {
  heading: SCHOOL,
  email: DIRECTOR_EMAIL,
  boosterLabel: "Booster website",
  boosterUrl: BOOSTER_URL,
  pagesHeading: "Pages",
};

// Photo labels appear while src is empty. Captions appear below the photo when supplied.
export const HOME_PAGE = {
  hero: {
    title: "Welcome to Durham Orchestra",
    welcome: `[Short welcome from the directors about the orchestra program at ${SCHOOL}.]`,
    joinLabel: "Join Orchestra",
    returningLabel: "Returning Members",
    photo: { src: "", alt: "", caption: "", label: "Hero photo: orchestra performing" },
  },
  quickLinks: {
    heading: "Quick links",
    newToOrchestra: { title: "New to Orchestra", cta: "Learn more", text: "Meet the instruments and pick one." },
    returningMembers: { title: "Returning Members", cta: "Get started", text: "Re-enrollment, auditions, and dates." },
    gettingAnInstrument: { title: "Getting an Instrument", cta: "Rent or borrow", text: "Rental options and school instruments." },
  },
  gallery: {
    heading: "Photo gallery",
    photos: [
      { id: "gallery-photo-1", src: "", alt: "", caption: "", label: "Photo 1" },
      { id: "gallery-photo-2", src: "", alt: "", caption: "", label: "Photo 2" },
      { id: "gallery-photo-3", src: "", alt: "", caption: "", label: "Photo 3" },
      { id: "gallery-photo-4", src: "", alt: "", caption: "", label: "Photo 4" },
    ],
    notice: "Photos are for viewing only.",
  },
  cta: {
    title: "Ready to join the orchestra?",
    text: "Start with the instruments or meet the directors.",
    newToOrchestraLabel: "New to Orchestra",
    directorsLabel: "Meet the directors",
  },
};

export const DIRECTORS_PAGE = {
  title: "Meet the Directors",
  profilesHeading: "Our directors",
  profiles: directorProfiles,
  orchestraHeading: "Orchestra",
  groupPhoto: { src: "", alt: "", caption: "", label: "Full-width group photo" },
  cta: {
    title: "Want to join the orchestra?",
    label: "New to Orchestra",
  },
};

export const NEW_TO_ORCHESTRA_PAGE = {
  header: {
    title: "New to Orchestra",
    intro: "No experience needed. Meet the instruments, listen, and pick your favorite.",
  },
  welcome: {
    heading: "Welcome, new players!",
    title: "No experience needed",
    text: "[How class works and what the first year looks like.]",
    returningPrompt: "Already in orchestra?",
    returningLabel: "Returning members start here.",
    instrumentLabel: "Getting an Instrument",
    photo: { src: "", alt: "", caption: "", label: "Photo: beginner class" },
  },
  instrumentsHeading: "Meet the instruments",
  sizing: {
    title: "Any height can play",
    text: "Every instrument comes in multiple sizes, so students of any height can play any instrument.",
  },
  faqHeading: "FAQ",
  cta: {
    title: "Ready to pick an instrument?",
    label: "Getting an Instrument",
  },
};

export const GETTING_AN_INSTRUMENT_PAGE = {
  header: {
    title: "Getting an Instrument",
    intro: "Rent from a local company or ask about a school instrument.",
  },
  stepsHeading: "Steps",
  rentalsHeading: "Rental options",
  faq: {
    heading: "FAQ",
    items: [
      { id: "faq-payment", q: "Monthly vs. yearly payment", a: "Renting by the year costs less than paying monthly. [Add details.]" },
      { id: "faq-rental-sizing", q: "Instrument sizes", a: "Each instrument comes in multiple sizes. The directors help you pick one." },
      { id: "faq-supplies", q: "Supplies checklist", a: "[List the supplies every student needs.]" },
      { id: "faq-rental-contact", q: "Who do I contact?", a: "Email the directors using the contacts below." },
    ],
  },
};

export const RETURNING_MEMBERS_PAGE = {
  header: {
    title: "Returning Members",
    intro: "Welcome back! Here is what you need for the new year.",
  },
  beginnerCallout: {
    text: "New to orchestra?",
    label: "Start here.",
  },
  datesHeading: "Key dates",
  reenrollment: {
    heading: "Re-enrollment and instruments",
    checklist: [
      { id: "checklist-registration", text: "Complete registration" },
      { id: "checklist-forms-and-fees", text: "Submit forms and fees" },
      { id: "checklist-rental", text: "Renew rental or size up" },
      { id: "checklist-handbook", text: "Review handbook updates" },
    ],
    photo: { src: "", alt: "", caption: "", label: "Photo: returning students" },
  },
  auditions: {
    heading: "Auditions and seating",
    chairPlacement: { title: "Chair placement", text: "[Process and dates.]" },
    advancedGroups: { title: "Advanced groups", text: "[Details about special ensembles.]" },
  },
  opportunities: {
    heading: "Opportunities",
    uil: { title: "UIL & other groups", cta: "Learn more", text: "Contests and extra ensembles." },
    leadership: { title: "Leadership roles", text: "[Section leaders and officers.]" },
    performances: { title: "Performances", text: "[Concerts and events this year.]" },
  },
};

export const UIL_PAGE = {
  title: "UIL Info & Other Groups",
  overview: {
    heading: "What is UIL?",
    text: "[Short explanation of UIL orchestra contests, who can take part, and what to expect.]",
    photo: { src: "", alt: "", caption: "", label: "Photo: contest" },
  },
  timelineHeading: "How it works",
  otherGroups: {
    heading: "Other groups",
    groups: [
      { id: "other-group-1", title: "[Group name]", text: "[Who it is for, when it meets, how to join.]" },
      { id: "other-group-2", title: "[Group name]", text: "[Who it is for, when it meets, how to join.]" },
      { id: "other-group-3", title: "[Group name]", text: "[Who it is for, when it meets, how to join.]" },
    ],
  },
  documentsHeading: "Forms and documents",
};
