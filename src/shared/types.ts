export type BatchMeta = {
  /** Unique identifier of this batch */
  id: string;
  /** Unix timestamp of the batch */
  time: number;
}

export type BatchData = BatchMeta & {
  records: InmateRecord[];
}

export type InmateRecord = {
  id: string;
  name: string;
  datetimebooked: string;
  charges: string;
  detainers: string;

  bookno: string;
  bookhandle: string;

  amount: string;
  outstandingbonds: string;
  outstandingdetainers: string;

  mugshot_id: string;
}
