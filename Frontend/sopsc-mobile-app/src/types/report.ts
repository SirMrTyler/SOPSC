export interface Report {
  reportId: number;
  chaplain: string;
  chaplainDivision: string;
  hoursOfService?: number | null;
  commuteTime?: number | null;
  primaryAgency: string;
  typeOfService: string;
  contactName: string;
  pocPhone?: string | null;
  pocEmail?: string | null;
  clientName?: string | null;
  clientPhone?: string | null;
  addressDispatch: string;
  cityDispatch: string;
  addressDestination?: string | null;
  cityDestination?: string | null;
  dispatchTime?: string | null;
  arrivalTime?: string | null;
  milesDriven?: number | null;
  narrative: string;
  dateCreated: string;
  createdById: number;
}
