import { useEffect, useRef, useState } from "react";
import "../styles/Calendar.css";

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const central = "America/Chicago";
const centralDate = new Intl.DateTimeFormat("en-US", {
  timeZone: central, year: "numeric", month: "2-digit", day: "2-digit",
});
const monthLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC", month: "long", year: "numeric",
});
const allDayLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC", dateStyle: "long",
});
const eventTime = new Intl.DateTimeFormat("en-US", {
  timeZone: central, dateStyle: "medium", timeStyle: "short",
});

// Date cells use UTC as a date-only representation. Event instants use Central time.
function dateCell(year, month, day) {
  return new Date(Date.UTC(year, month, day));
}

function todayKey() {
  const parts = Object.fromEntries(centralDate.formatToParts(new Date()).map(({ type, value }) => [type, value]));
  return [parts.year, parts.month, parts.day].join("-");
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function currentMonthStart() {
  return new Date(todayKey().slice(0, 7) + "-01T00:00:00Z");
}

function EventDetails({ event, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal();
  }, []);

  const formatDate = (date) => allDayLabel.format(new Date(date + "T00:00:00Z"));
  const when = event.allDay
    ? event.firstDate === event.lastDate
      ? formatDate(event.firstDate)
      : allDayLabel.formatRange(new Date(event.firstDate + "T00:00:00Z"), new Date(event.lastDate + "T00:00:00Z"))
    : eventTime.formatRange(new Date(event.startsAt), new Date(event.endsAt));

  return (
    <dialog ref={dialog} className="calendar-event-dialog" aria-labelledby="calendar-event-title" onClose={onClose}>
      <h2 id="calendar-event-title">{event.title}</h2>
      <p>{when} · {event.allDay ? "All day" : "Central time"}</p>
      {event.location && <p>{event.location}</p>}
      {event.description && <p className="calendar-event-description">{event.description}</p>}
      <form method="dialog">
        <button type="submit">Close</button>
      </form>
    </dialog>
  );
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(currentMonthStart);
  const [result, setResult] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const year = currentMonth.getUTCFullYear();
  const month = currentMonth.getUTCMonth();
  const firstDay = currentMonth.getUTCDay();
  const calendarDays = Array.from({ length: 42 }, (_, index) => dateCell(year, month, index - firstDay + 1));
  const gridStart = dateKey(calendarDays[0]);
  const gridEnd = dateKey(dateCell(year, month, 43 - firstDay));
  const query = new URLSearchParams({ start: gridStart, end: gridEnd }).toString();
  const today = todayKey();

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvents() {
      try {
        const response = await fetch(`/api/calendar/events?${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Calendar request failed");
        const events = await response.json();
        if (!Array.isArray(events)) throw new Error("Invalid calendar response");
        if (!controller.signal.aborted) setResult({ query, events });
      } catch {
        if (!controller.signal.aborted) setResult({ query, error: true });
      }
    }

    loadEvents();
    return () => controller.abort();
  }, [query]);

  const activeResult = result?.query === query ? result : null;
  const events = activeResult?.events ?? [];
  const hasMonthEvents = events.some(({ firstDate, lastDate }) =>
    firstDate < dateKey(dateCell(year, month + 1, 1)) && lastDate >= dateKey(currentMonth),
  );

  function changeMonth(amount) {
    setCurrentMonth((previous) => dateCell(previous.getUTCFullYear(), previous.getUTCMonth() + amount, 1));
  }

  return (
    <div className="calendar-page">
      <section className="calendar-hero">
        <div className="calendar-container">
          <h1>Calendar</h1>
          <p>Concerts, contests, and important dates.</p>
        </div>
      </section>

      <section className="calendar-section">
        <div className="calendar-container">
          <div className="calendar-card">
            <div className="calendar-toolbar">
              <h2>{monthLabel.format(currentMonth)}</h2>
              <div className="calendar-controls">
                <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
                <button type="button" onClick={() => setCurrentMonth(currentMonthStart())}>Today</button>
                <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
              </div>
            </div>
            <div role="status">
              {!activeResult && <p className="calendar-status">Loading events…</p>}
              {activeResult?.error && <p className="calendar-status">Calendar events are unavailable. Please try again later.</p>}
              {activeResult?.events && !hasMonthEvents && <p className="calendar-status">No events this month.</p>}
            </div>
            <div className="calendar-weekdays">
              {weekdays.map((day) => <div key={day}>{day}</div>)}
            </div>
            <div className="calendar-grid">
              {calendarDays.map((date) => {
                const day = dateKey(date);
                return (
                  <div key={day} className={`calendar-day ${date.getUTCMonth() !== month ? "outside-month" : ""}`}>
                    <span className={day === today ? "today-date" : ""}>{date.getUTCDate()}</span>
                    <div className="calendar-day-events">
                      {events.filter(({ firstDate, lastDate }) => firstDate <= day && day <= lastDate).map((event) => (
                        <button key={event.id} type="button" className="calendar-event" onClick={() => setSelectedEvent(event)}>
                          {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {selectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
