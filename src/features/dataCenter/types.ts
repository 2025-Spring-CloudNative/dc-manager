export type DataCenter = 
    {
  "dataCenter": {
    "name": string,
    "location": string, 
  },
  "subnetCidr": string
}

export type DC = {
  id:       number;
  name:     string;
  location: string;
  subnetId: number;
}



