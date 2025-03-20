export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
    };
    company: {
      name: string;
    };
    website: string;
  }