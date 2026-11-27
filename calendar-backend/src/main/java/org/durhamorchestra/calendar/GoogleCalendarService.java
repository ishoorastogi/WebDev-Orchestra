package org.durhamorchestra.calendar;

import java.net.http.HttpClient;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@Service
class GoogleCalendarService {
    private static final ZoneId CENTRAL = ZoneId.of("America/Chicago");

    private final RestClient google;
    private final String calendarId;
    private final String apiKey;

    GoogleCalendarService(@Value("${calendar.google.base-url}") String baseUrl,
            @Value("${calendar.google.id}") String calendarId,
            @Value("${calendar.google.key}") String apiKey) {
        var requestFactory = new JdkClientHttpRequestFactory(
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build());
        requestFactory.setReadTimeout(Duration.ofSeconds(10));
        this.google = RestClient.builder().baseUrl(baseUrl).requestFactory(requestFactory).build();
        this.calendarId = calendarId;
        this.apiKey = apiKey;
    }

    List<CalendarEvent> events(LocalDate start, LocalDate end) {
        if (calendarId.isBlank() || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Calendar is not configured.");
        }

        List<CalendarEvent> events = new ArrayList<>();
        Set<String> seenTokens = new HashSet<>();
        String pageToken = null;
        try {
            do {
                Optional<String> token = Optional.ofNullable(pageToken);
                GooglePage page = google.get()
                        .uri(builder -> builder.pathSegment("calendars", "{calendarId}", "events")
                                .queryParam("timeMin", "{start}")
                                .queryParam("timeMax", "{end}")
                                .queryParam("timeZone", "{zone}")
                                .queryParam("singleEvents", true)
                                .queryParam("orderBy", "startTime")
                                .queryParam("fields", "nextPageToken,items(id,status,summary,description,location,start(date,dateTime),end(date,dateTime))")
                                .queryParamIfPresent("pageToken", token.map(ignored -> "{token}"))
                                .build(calendarId, start.atStartOfDay(CENTRAL).toInstant(),
                                        end.atStartOfDay(CENTRAL).toInstant(), CENTRAL.getId(), token.orElse("")))
                        .header("x-goog-api-key", apiKey)
                        .retrieve()
                        .body(GooglePage.class);
                if (page == null) {
                    throw unavailable();
                }
                if (page.items() != null) {
                    for (GoogleEvent item : page.items()) {
                        CalendarEvent event = normalize(item);
                        if (event != null && event.lastDate().compareTo(start) >= 0 && event.firstDate().isBefore(end)) {
                            events.add(event);
                        }
                    }
                }
                pageToken = page.nextPageToken();
                if (pageToken != null && !seenTokens.add(pageToken)) {
                    throw unavailable();
                }
            } while (pageToken != null && !pageToken.isBlank());
        } catch (RestClientException | DateTimeParseException exception) {
            // Upstream error messages and response bodies can contain request credentials.
            throw unavailable();
        }
        return events;
    }

    private CalendarEvent normalize(GoogleEvent item) {
        if ("cancelled".equals(item.status()) || item.start() == null || item.end() == null) {
            return null;
        }
        String title = item.summary() == null || item.summary().isBlank() ? "Calendar event" : item.summary();
        if (item.start().date() != null && item.end().date() != null) {
            return new CalendarEvent(item.id(), title, item.description(), item.location(), true,
                    item.start().date(), item.end().date().minusDays(1), null, null);
        }
        if (item.start().dateTime() == null || item.end().dateTime() == null) {
            return null;
        }
        Instant startsAt = item.start().dateTime().toInstant();
        Instant endsAt = item.end().dateTime().toInstant();
        if (endsAt.isBefore(startsAt)) {
            return null;
        }
        Instant lastMoment = endsAt.isAfter(startsAt) ? endsAt.minusNanos(1) : startsAt;
        return new CalendarEvent(item.id(), title, item.description(), item.location(), false,
                startsAt.atZone(CENTRAL).toLocalDate(), lastMoment.atZone(CENTRAL).toLocalDate(),
                startsAt, endsAt);
    }

    private ResponseStatusException unavailable() {
        return new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Google Calendar is unavailable.");
    }

    record CalendarEvent(String id, String title, String description, String location, boolean allDay,
                         LocalDate firstDate, LocalDate lastDate, Instant startsAt, Instant endsAt) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GooglePage(String nextPageToken, List<GoogleEvent> items) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GoogleEvent(String id, String status, String summary, String description, String location,
                               GoogleDate start, GoogleDate end) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GoogleDate(LocalDate date, OffsetDateTime dateTime) {}
}
