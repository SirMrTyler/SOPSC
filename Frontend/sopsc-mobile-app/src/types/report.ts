export interface Report {
  reportId: number;
  chaplain: string;
  chaplainDivision: string;
  hoursOfService?: number | null;
  commuteTime?: number | null;
  primaryAgency: string;
  typeOfService: string;
  contactName: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  addressDispatch: string;
  cityDispatch: string;
  narrative: string;
  dateCreated: string;
}
