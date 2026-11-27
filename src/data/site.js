// all editable site content lives here. replace [bracketed] placeholders with real info.

// school name in nav
export const SCHOOL = "Durham Middle School Orchestra";
export const BOOSTER_URL = "https://example.com/booster"; // todo: existing booster website
export const DIRECTOR_EMAIL = "director@example.org"; // todo

// nav links, children = dropdown
export const NAV = [
  { label: "Home", to: "/" },
  { label: "Directors", to: "/directors" },
  { label: "New to Orchestra", to: "/new-to-orchestra" },
  { label: "Getting an Instrument", to: "/getting-an-instrument" },
  { label: "Returning Members", to: "/returning-members" },
  { label: "UIL & Groups", to: "/uil" },
  { label: "Calendar", to: "/calendar" },
];

// dir info, edit here
export const DIRECTORS = [
  { name: "[Director name]", role: "Orchestra Director", bio: "[Short bio: background, years teaching, favorite part of orchestra.]", email: "director1@example.org" },
  { name: "[Director name]", role: "Assistant Director", bio: "[Short bio.]", email: "director2@example.org" },
];

// videoid: paste the youtube video id to show the embedded listening example.
// yt ids go in videoid
export const INSTRUMENTS = [
  { name: "Violin", videoId: "", text: "The most popular orchestra instrument and the highest in pitch. Violins often carry the melody and are usually the center of attention." },
  { name: "Viola", videoId: "", text: "The violin's laid-back older cousin. A little bigger and lower, with a warm sound that sits between the violin and the cello." },
  { name: "Cello", videoId: "", text: "Played sitting down with the instrument resting on the floor. It is the second-lowest and second-biggest string instrument." },
  { name: "Bass", videoId: "", text: "The biggest and lowest instrument in the orchestra. The bass is the foundation that everyone else builds on." },
];

export const INSTRUMENT_FAQ = [
  { q: "How much practice is expected?", a: "[Answer: recommended minutes per week.]" },
  { q: "Can I switch instruments?", a: "[Answer: switching policy.]" },
  { q: "What size instrument do I need?", a: "Students of any height can play any instrument because each comes in multiple sizes. [Add sizing details.]" },
  { q: "Where do I rent?", a: "See the Getting an Instrument page for rental companies and school instruments." },
];

// rental co links
export const RENTALS = [
  { name: "company", text: "[Monthly fee, yearly fee, and how to sign up.]", href: "https://www.musicarts.com", cta: "Rent online" },
  { name: "compaany", text: "[Monthly fee, yearly fee, and how to sign up.]", href: "https://www.amazon.com", cta: "Rent online" },
  { name: "School instrument", text: "The directors have a very limited supply of school instruments for a yearly fee. [Details.]", to: "/directors", cta: "Ask the directors" },
];

// steps for getting an inst
export const INSTRUMENT_STEPS = [
  { title: "Choose an instrument", text: "Watch the videos on New to Orchestra." },
  { title: "Rent or borrow", text: "Pick a rental company or ask about a school instrument." },
  { title: "Get supplies", text: "[Rosin, shoulder rest, and other supplies.]" },
  { title: "Bring it to class", text: "[First day instructions.]" },
];

// returning mbr dates
export const RETURNING_DATES = [
  { date: "[DATE]", title: "Re-enrollment opens", text: "[Details.]" },
  { date: "[DATE]", title: "Forms due", text: "[Details.]" },
  { date: "[DATE]", title: "Chair placement", text: "[Details.]" },
  { date: "[DATE]", title: "First rehearsal", text: "[Details.]" },
];

//uil timeline
export const UIL_DATES = [
  { date: "[DATE]", title: "Sign-up", text: "[Details.]" },
  { date: "[DATE]", title: "Rehearsals", text: "[Details.]" },
  { date: "[DATE]", title: "Contest day", text: "[Details.]" },
  { date: "[DATE]", title: "Results", text: "[Details.]" },
];

// pdf forms live in public/forms
export const DOCUMENTS = [
  { name: "[Form name]", href: "/forms/form-1.pdf" },
  { name: "[Form name]", href: "/forms/form-2.pdf" },
  { name: "[Form name]", href: "/forms/form-3.pdf" },
];

