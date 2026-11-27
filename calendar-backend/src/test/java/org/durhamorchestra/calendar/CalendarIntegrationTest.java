package org.durhamorchestra.calendar;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import com.jayway.jsonpath.JsonPath;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CalendarIntegrationTest {
    private static final String FIXTURE_KEY = "dummy-fixture-only";
    private static final HttpServer GOOGLE = startFixture();

    @LocalServerPort
    int port;

    @DynamicPropertySource
    static void googleProperties(DynamicPropertyRegistry registry) {
        registry.add("calendar.google.base-url", () -> "http://127.0.0.1:" + GOOGLE.getAddress().getPort() + "/calendar/v3");
        registry.add("calendar.google.id", () -> "fixture/calendar@example.test");
        registry.add("calendar.google.key", () -> FIXTURE_KEY);
    }

    @AfterAll
    static void stopFixture() {
        GOOGLE.stop(0);
    }

    @Test
    void listsPaginatedEventsWithCentralDatesAndExclusiveAllDayEnd() throws Exception {
        var response = get("2026-03-01", "2026-04-01");
        assertThat(response.statusCode()).isEqualTo(200);
        var events = JsonPath.parse(response.body());
        assertThat(events.<Integer>read("$.length()")).isEqualTo(2);
        assertThat(events.<String>read("$[0].title")).isEqualTo("Spring rehearsal");
        assertThat(events.<String>read("$[0].firstDate")).isEqualTo("2026-03-10");
        assertThat(events.<String>read("$[0].lastDate")).isEqualTo("2026-03-10");
        assertThat(events.<String>read("$[0].startsAt")).isEqualTo("2026-03-11T01:00:00Z");
        assertThat(events.<Boolean>read("$[1].allDay")).isTrue();
        assertThat(events.<String>read("$[1].lastDate")).isEqualTo("2026-03-13");
        assertThat(response.body()).doesNotContain(FIXTURE_KEY);
    }

    @Test
    void returnsAnEmptyListForAnEmptyRange() throws Exception {
        var response = get("2026-04-01", "2026-05-01");
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).isEqualTo("[]");
    }

    @Test
    void rejectsInvalidRanges() throws Exception {
        assertThat(get("2026-03-01", "2026-05-01").statusCode()).isEqualTo(400);
        assertThat(get("2026-05-01", "2026-05-01").statusCode()).isEqualTo(400);
        assertThat(get("invalid", "2026-05-01").statusCode()).isEqualTo(400);
    }

    @Test
    void redactsUpstreamFailureDetails() throws Exception {
        var response = get("2026-05-01", "2026-06-01");
        assertThat(response.statusCode()).isEqualTo(502);
        assertThat(response.body()).doesNotContain(FIXTURE_KEY);
    }

    private HttpResponse<String> get(String start, String end) throws Exception {
        var uri = URI.create("http://127.0.0.1:" + port + "/api/calendar/events?start=" + start + "&end=" + end);
        try (var client = HttpClient.newHttpClient()) {
            return client.send(HttpRequest.newBuilder(uri).build(), HttpResponse.BodyHandlers.ofString());
        }
    }

    private static HttpServer startFixture() {
        try {
            var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            server.createContext("/calendar/v3/calendars/", exchange -> {
                var uri = exchange.getRequestURI();
                String query = uri.getQuery();
                int status = 200;
                String body;
                if (!uri.getRawPath().equals("/calendar/v3/calendars/fixture%2Fcalendar%40example.test/events")
                        || !FIXTURE_KEY.equals(exchange.getRequestHeaders().getFirst("x-goog-api-key"))
                        || !query.contains("timeZone=America/Chicago") || !query.contains("singleEvents=true")
                        || query.contains("key=")) {
                    status = 400;
                    body = "{}";
                } else if (query.contains("pageToken=page+2")) {
                    body = """
                            {"items":[
                              {"id":"tour","summary":"Orchestra tour","start":{"date":"2026-03-12"},"end":{"date":"2026-03-14"}},
                              {"id":"removed","status":"cancelled","start":{"date":"2026-03-12"},"end":{"date":"2026-03-13"}}
                            ]}
                            """;
                } else if (query.contains("timeMin=2026-03-01T06:00:00Z")
                        && query.contains("timeMax=2026-04-01T05:00:00Z")) {
                    body = """
                            {"nextPageToken":"page+2","items":[
                              {"id":"rehearsal","summary":"Spring rehearsal","location":"Orchestra room",
                               "start":{"dateTime":"2026-03-11T01:00:00Z"},"end":{"dateTime":"2026-03-11T05:00:00Z"}}
                            ]}
                            """;
                } else if (query.contains("timeMin=2026-05-01")) {
                    status = 403;
                    body = "{\"error\":\"" + FIXTURE_KEY + "\"}";
                } else {
                    body = "{}";
                }
                byte[] data = body.getBytes(StandardCharsets.UTF_8);
                try (exchange) {
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    exchange.sendResponseHeaders(status, data.length);
                    exchange.getResponseBody().write(data);
                }
            });
            server.start();
            return server;
        } catch (IOException exception) {
            throw new IllegalStateException("Could not start Google API fixture", exception);
        }
    }
}
