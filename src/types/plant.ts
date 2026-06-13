export interface Plant {
  id: number;
  name: string;
  scientificName: string;
  type: string;
  category: string;
  price: number;
  image: string;
  description: string;
  careLevel: string;
  light: string;
  water: string;
  popular?: boolean;
}

export interface CartItem extends Plant {
  quantity: number;
}
