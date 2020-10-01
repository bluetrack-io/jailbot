export interface ApiClientI {
  getBatchList(): Promise<ReadonlyArray<BatchMeta>>
  getBatch(batch_id:string): Promise<any>;
}

export interface BatchMeta {
  batch_id: string;
  time: Date;
}
