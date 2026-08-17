import { formatDate } from "./date";

// Timestamps are written without a zone designator on purpose: they are parsed as local time,
// so the expected day stays the same no matter which timezone the tests run in.
describe("formatDate", () => {
  it("formats a timestamp as month name, day and full year", () => {
    expect(formatDate("2026-08-17T09:12:44")).toBe("August 17th, 2026");
  });

  it.each([
    ["2026-01-01T12:00:00", "January 1st, 2026"],
    ["2026-01-02T12:00:00", "January 2nd, 2026"],
    ["2026-01-03T12:00:00", "January 3rd, 2026"],
    ["2026-01-04T12:00:00", "January 4th, 2026"],
    ["2026-01-11T12:00:00", "January 11th, 2026"],
    ["2026-01-12T12:00:00", "January 12th, 2026"],
    ["2026-01-13T12:00:00", "January 13th, 2026"],
    ["2026-01-21T12:00:00", "January 21st, 2026"],
    ["2026-01-22T12:00:00", "January 22nd, 2026"],
    ["2026-01-23T12:00:00", "January 23rd, 2026"],
  ])("picks the right ordinal suffix for %s", (isoDate, expected) => {
    expect(formatDate(isoDate)).toBe(expected);
  });
});
