// TODO: Dates arrive as midnight UTC, so the local timezone shifts them a day back west of
// Greenwich. Formatting in UTC would fix that, but only until the API starts sending real times.
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

// Intl cannot format ordinals, so the suffix comes from the plural category of the day number.
const ordinalRules = new Intl.PluralRules("en-US", { type: "ordinal" });

const ordinalSuffixes: Record<Intl.LDMLPluralRule, string> = {
  zero: "th",
  one: "st",
  two: "nd",
  few: "rd",
  many: "th",
  other: "th",
};

export function formatDate(isoDate: string): string {
  // Working on parts keeps the suffix next to the day without parsing the formatted output back.
  return dateFormatter
    .formatToParts(new Date(isoDate))
    .map(part => {
      if (part.type !== "day") {
        return part.value;
      }

      return part.value + ordinalSuffixes[ordinalRules.select(Number(part.value))];
    })
    .join("");
}
