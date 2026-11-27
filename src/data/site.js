// Shared public site content. Add confirmed school details here when provided.

// school name in nav
export const SCHOOL = "Durham Middle School Orchestra";
export const BOOSTER_URL = "";
export const DIRECTOR_EMAIL = "";

// nav links, children = dropdown
export const NAV = [
  { label: "Home", to: "/" },
  { label: "Directors", to: "/directors" },
  { label: "New to Orchestra", to: "/new-to-orchestra" },
  { label: "Getting an Instrument", to: "/getting-an-instrument" },
  { label: "Returning Members", to: "/returning-members" },
  { label: "UIL & Groups", to: "/uil" },
];

// dir info, edit here
export const DIRECTORS = [
  { name: "Orchestra Director", role: "Orchestra Director", bio: "", email: "" },
  { name: "Assistant Director", role: "Assistant Director", bio: "", email: "" },
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
  { q: "How much practice is expected?", a: "Practice expectations will be shared by the directors." },
  { q: "Can I switch instruments?", a: "Ask the directors about the instrument switching process." },
  { q: "What size instrument do I need?", a: "Students of any height can play any instrument because each comes in multiple sizes." },
  { q: "Where do I rent?", a: "See the Getting an Instrument page for rental companies and school instruments." },
];

// rental co links
export const RENTALS = [
  { name: "Rental provider", text: "Compare available rental options before signing up.", href: "", cta: "" },
  { name: "School instrument", text: "Ask the directors about instrument availability and fees.", to: "/directors", cta: "Meet the directors" },
];

// steps for getting an inst
export const INSTRUMENT_STEPS = [
  { title: "Choose an instrument", text: "Watch the videos on New to Orchestra." },
  { title: "Rent or borrow", text: "Pick a rental company or ask about a school instrument." },
  { title: "Get supplies", text: "Confirm required supplies with the directors before purchasing." },
  { title: "Bring it to class", text: "First-day instrument instructions will be shared with students and families." },
];

// returning mbr dates
export const RETURNING_DATES = [
  { date: "To be announced", title: "Re-enrollment opens", text: "" },
  { date: "To be announced", title: "Forms due", text: "" },
  { date: "To be announced", title: "Chair placement", text: "" },
  { date: "To be announced", title: "First rehearsal", text: "" },
];

//uil timeline
export const UIL_DATES = [
  { date: "To be announced", title: "Sign-up", text: "" },
  { date: "To be announced", title: "Rehearsals", text: "" },
  { date: "To be announced", title: "Contest day", text: "" },
  { date: "To be announced", title: "Results", text: "" },
];

// pdf forms live in public/forms
export const DOCUMENTS = [];

