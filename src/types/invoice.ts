export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface OptionalFields {
  fiscalId?: string;
  staticId?: string;
  artistCardNumber?: string;
  bankAccount?: string;
  phoneNumber?: string;
  businessRegNumber?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  subject: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyFields: OptionalFields;
  clientName: string;
  clientAddress: string;
  clientFields: OptionalFields;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}