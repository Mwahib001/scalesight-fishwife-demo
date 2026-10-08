export const number = (value: number | null | undefined) =>
  value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
        value,
      );
export const decimal = (value: number | null | undefined) =>
  value === null || value === undefined ? "—" : value.toFixed(1);
export const percent = (value: number | null | undefined) =>
  value === null || value === undefined
    ? "—"
    : `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
export const usd = (value: number | null | undefined) =>
  value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
export const date = (value: string | null) =>
  value
    ? new Date(value + "T12:00:00Z").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      })
    : "Not specified";

export const compact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
