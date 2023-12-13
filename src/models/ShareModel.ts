export interface CreateShareInput {
  shareName: string;
  sharePrice: number;
  shareSymbol: string;
  shareQuantity: number;
}

export interface UpdateShareInput {
  shareId: string;
  sharePrice: number;
}

export interface ShareModel {
  id: string;
  shareName: string;
  shareSymbol: string;
  sharePrice: number;
  sharePriceStr: string;
  shareQuantity: number;
  updatedAt: Date;
  createdAt: Date;
}

