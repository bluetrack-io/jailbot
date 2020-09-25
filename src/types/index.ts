/** Dollar amount as a string, with symbol, commas, and zero-padded cents */
export type DollarString = string;

/** The record for a single inmate returned by the jailview API */
export type RawInmateRecord = {
  /** Booking time in format of "MM/DD/YYYY HH:MM" */
  datetimebooked: string;
  /** Name in format of "$first, $last" */
  name: string;
  /** String of html image tag with b64 encoded image */
  mugshotpath: string;
  /** Total outstanding amount (bonds + detainers) */
  amount: DollarString;
  outstandingbonds: DollarString;
  outstandingdetainers: DollarString;

  bookhandle: string;
  bookno: string;
  charges: string;
  detainers: string;
}

export type StoredInmateRecord = RawInmateRecord & {
  runtime_batch: string;
  saved_at: string;
}
