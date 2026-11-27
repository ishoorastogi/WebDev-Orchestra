import type { SiteContent } from "./schema";

const section = (id: string, type: SiteContent["pages"][string]["sections"][number]["type"], title: string, body = "") => ({
  id, type, title, body, image: "", alt: "", ctaLabel: "", ctaHref: "", items: [],
});

// Editable starting copy is derived from the existing pages and their shared data.
// School-specific details stay empty until confirmed details are provided.
export const defaultSiteContent: SiteContent = {
  nav: [
    { id: "home", label: "Home", href: "/" },
    { id: "directors", label: "Directors", href: "/directors" },
    { id: "new", label: "New to Orchestra", href: "/new-to-orchestra" },
    { id: "instrument", label: "Getting an Instrument", href: "/getting-an-instrument" },
    { id: "returning", label: "Returning Members", href: "/returning-members" },
    { id: "uil", label: "UIL & Groups", href: "/uil" },
  ],
  footer: { school: "Durham Middle School Orchestra", email: "", boosterUrl: "", description: "" },
  pages: {
    "": { title: "Welcome to Durham Orchestra", intro: "Explore orchestra programs, instruments, and resources for students and families.", sections: [
      { ...section("hero", "hero", "Welcome to Durham Orchestra", "Explore orchestra programs, instruments, and resources for students and families."), ctaLabel: "Join Orchestra", ctaHref: "/new-to-orchestra", image: "", alt: "Orchestra performing" },
      { ...section("quick-links", "card-grid", "Quick links"), items: [
        { id: "new", title: "New to Orchestra", body: "Meet the instruments and pick one.", href: "/new-to-orchestra", image: "", alt: "" },
        { id: "returning", title: "Returning Members", body: "Re-enrollment, auditions, and dates.", href: "/returning-members", image: "", alt: "" },
        { id: "instrument", title: "Getting an Instrument", body: "Rental options and school instruments.", href: "/getting-an-instrument", image: "", alt: "" },
      ] },
      section("events", "events", "Upcoming events", "There are no upcoming events to display yet."),
      { ...section("gallery", "image", "Photo gallery"), items: [1, 2, 3, 4].map((number) => ({ id: `gallery-${number}`, title: `Photo ${number}`, body: "", href: "", image: "", alt: "" })) },
      { ...section("cta", "cta", "Ready to join the orchestra?", "Start with the instruments or meet the directors."), ctaLabel: "New to Orchestra", ctaHref: "/new-to-orchestra" },
    ] },
    directors: { title: "Meet the Directors", intro: "", sections: [
      { ...section("directors", "contact", "Our directors", ""), items: [
        { id: "director-1", title: "Orchestra Director", body: "", href: "", image: "", alt: "" },
        { id: "director-2", title: "Assistant Director", body: "", href: "", image: "", alt: "" },
      ] },
      section("orchestra", "image", "Orchestra", "Group photo"),
      { ...section("cta", "cta", "Want to join the orchestra?"), ctaLabel: "New to Orchestra", ctaHref: "/new-to-orchestra" },
    ] },
    "new-to-orchestra": { title: "New to Orchestra", intro: "No experience needed. Meet the instruments, listen, and pick your favorite.", sections: [
      section("welcome", "image-text", "Welcome, new players!", "No experience is needed to get started. Class details will be shared by the directors."),
      { ...section("instruments", "card-grid", "Meet the instruments"), items: [
        { id: "violin", title: "Violin", body: "The most popular orchestra instrument and highest in pitch. Violins often carry the melody.", href: "", image: "", alt: "" },
        { id: "viola", title: "Viola", body: "A little bigger and lower than the violin, with a warm sound between violin and cello.", href: "", image: "", alt: "" },
        { id: "cello", title: "Cello", body: "Played sitting down with the instrument resting on the floor. It is the second-lowest and second-biggest string instrument.", href: "", image: "", alt: "" },
        { id: "bass", title: "Bass", body: "The biggest and lowest instrument in the orchestra. The bass is the foundation that everyone else builds on.", href: "", image: "", alt: "" },
      ] },
      section("faq", "text", "FAQ", "How much practice is expected?\nPractice expectations will be shared by the directors.\n\nCan I switch instruments?\nAsk the directors about the instrument switching process.\n\nWhat size instrument do I need?\nStudents of any height can play any instrument because each comes in multiple sizes.\n\nWhere do I rent?\nSee the Getting an Instrument page for rental options."),
      { ...section("cta", "cta", "Ready to pick an instrument?"), ctaLabel: "Getting an Instrument", ctaHref: "/getting-an-instrument" },
    ] },
    "getting-an-instrument": { title: "Getting an Instrument", intro: "Rent from a local company or ask about a school instrument.", sections: [
      { ...section("steps", "timeline", "Steps"), items: [
        { id: "choose", title: "Choose an instrument", body: "Watch the videos on New to Orchestra.", href: "", image: "", alt: "" },
        { id: "rent", title: "Rent or borrow", body: "Pick a rental option or ask about a school instrument.", href: "", image: "", alt: "" },
        { id: "supplies", title: "Get supplies", body: "Confirm required supplies with the directors before purchasing.", href: "", image: "", alt: "" },
        { id: "class", title: "Bring it to class", body: "First-day instrument instructions will be shared with students and families.", href: "", image: "", alt: "" },
      ] },
      { ...section("rentals", "card-grid", "Rental options"), items: [
        { id: "rental-1", title: "Rental provider", body: "Compare available rental options before signing up.", href: "", image: "", alt: "" },
        { id: "school-instrument", title: "School instrument", body: "Ask the directors about instrument availability and fees.", href: "/directors", image: "", alt: "" },
      ] },
      section("faq", "text", "FAQ", "Monthly vs. yearly payment\nCompare the available plans with the rental provider before signing up.\n\nInstrument sizes\nEach instrument comes in multiple sizes. The directors can help you choose.\n\nSupplies checklist\nConfirm required supplies with the directors before purchasing.\n\nWho do I contact?\nContact information is available on the Directors page."),
      section("contact", "contact", "Questions?", "Contact the directors for help."),
    ] },
    "returning-members": { title: "Returning Members", intro: "Welcome back! Here is what you need for the new year.", sections: [
      { ...section("dates", "timeline", "Key dates"), items: [
        { id: "reenroll", title: "Re-enrollment opens", body: "To be announced", href: "", image: "", alt: "" },
        { id: "forms", title: "Forms due", body: "To be announced", href: "", image: "", alt: "" },
        { id: "placement", title: "Chair placement", body: "To be announced", href: "", image: "", alt: "" },
        { id: "rehearsal", title: "First rehearsal", body: "To be announced", href: "", image: "", alt: "" },
      ] },
      section("enrollment", "checklist", "Re-enrollment and instruments", "Complete registration; submit forms and fees; renew rental or size up; review handbook updates."),
      { ...section("seating", "card-grid", "Auditions and seating"), items: [
        { id: "chair-placement", title: "Chair placement", body: "Process and dates will be shared when confirmed.", href: "", image: "", alt: "" },
        { id: "advanced-groups", title: "Advanced groups", body: "Ensemble details will be shared when confirmed.", href: "", image: "", alt: "" },
      ] },
      { ...section("opportunities", "card-grid", "Opportunities"), items: [
        { id: "uil", title: "UIL & other groups", body: "Contests and extra ensembles.", href: "/uil", image: "", alt: "" },
        { id: "leadership", title: "Leadership roles", body: "Information about leadership opportunities will be shared when available.", href: "", image: "", alt: "" },
        { id: "performances", title: "Performances", body: "Concert information will be added when dates are confirmed.", href: "", image: "", alt: "" },
      ] },
    ] },
    uil: { title: "UIL Info & Other Groups", intro: "", sections: [
      section("uil", "image-text", "What is UIL?", "Information about UIL orchestra contests and participation will be shared here."),
      { ...section("timeline", "timeline", "How it works"), items: [
        { id: "signup", title: "Sign-up", body: "To be announced", href: "", image: "", alt: "" },
        { id: "rehearsals", title: "Rehearsals", body: "To be announced", href: "", image: "", alt: "" },
        { id: "contest", title: "Contest day", body: "To be announced", href: "", image: "", alt: "" },
        { id: "results", title: "Results", body: "To be announced", href: "", image: "", alt: "" },
      ] },
      section("groups", "card-grid", "Other groups", "Information about additional ensembles will be shared when available."),
      section("documents", "documents", "Forms and documents"),
      section("contact", "contact", "Questions?", "Contact the directors for help."),
    ] },
  },
  events: [{ id: "1", title: "Fall Orchestra Concert", description: "", date: "2026-11-12", startTime: "", endTime: "", location: "", image: "", alt: "", url: "", visible: false }],
};
