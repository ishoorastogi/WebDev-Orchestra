package org.durhamorchestra.calendar;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
class CalendarController {
    private final GoogleCalendarService calendar;

    CalendarController(GoogleCalendarService calendar) {
        this.calendar = calendar;
    }

    @GetMapping("/api/calendar/events")
    List<GoogleCalendarService.CalendarEvent> events(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        if (!start.isBefore(end) || ChronoUnit.DAYS.between(start, end) > 42) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expected a range of 1 to 42 days.");
        }
        return calendar.events(start, end);
    }
}
