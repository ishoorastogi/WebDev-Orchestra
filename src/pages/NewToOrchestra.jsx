import { useLanguage } from "../i18n/LanguageProvider.jsx";
import { Link } from "react-router-dom";
import Accordion from "../components/Accordion.jsx";
import Button from "../components/Button.jsx";
import CtaBand from "../components/CtaBand.jsx";
import InstrumentFeature from "../components/InstrumentFeature.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Photo from "../components/Photo.jsx";
import Section from "../components/Section.jsx";
import { INSTRUMENTS, INSTRUMENT_FAQ } from "../data/site.js";

// intro + inst videos + faq
export default function NewToOrchestra() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t("New to Orchestra")} intro={t("No experience needed. Meet the instruments, listen, and pick your favorite.")} />
      <Section title={t("Welcome, new players!")}>
        <div className="split">
          <div>
            <h3>{t("No experience needed")}</h3>
            <p>{t("[How class works and what the first year looks like.]")}</p>
            <p>{t("Already in orchestra?")}{" "}<Link to="/returning-members">{t("Returning members start here.")}</Link></p>
            <Button to="/getting-an-instrument">{t("Getting an Instrument")}</Button>
          </div>
          <Photo label="Photo: beginner class" height={240} />
        </div>
      </Section>
      <Section title={t("Meet the instruments")}>
        <div className="stack">
          {/* alt left/right */}
          {INSTRUMENTS.map((inst, i) => (
            <InstrumentFeature key={inst.name} {...inst} flip={i % 2 === 1} />
          ))}
        </div>
      </Section>
      <Section>
        <div className="callout">
          <h3>{t("Any height can play")}</h3>
          <p>{t("Every instrument comes in multiple sizes, so students of any height can play any instrument.")}</p>
        </div>
      </Section>
      <Section title={t("FAQ")}>
        <Accordion items={INSTRUMENT_FAQ} />
      </Section>
      <Section>
        <CtaBand title={t("Ready to pick an instrument?")} actions={[{ label: t("Getting an Instrument"), to: "/getting-an-instrument" }]} />
      </Section>
    </>
  );
}
