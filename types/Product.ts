export type Variant = {
  stock: number | "Unlimited";
  color: string;
  size: (string | number)[];
  images: string[];
};

export type Product = {
  id: string;
  name: {
    en: string;
    dk: string;
  };
  brand: string;
  price: number;
  stock: number | "Unlimited";
  color: string;
  size: (string | number)[];
  images: string[];
  variant?: Variant[];
  categories: string[];
};
