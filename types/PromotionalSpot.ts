export type PromotionalSpot = {
  link: string;
  position: number;
  type: "1x1" | "2x1" | "2x2";
  image: {
    aspectRatio: string;
    imageUrl: string;
    focalPoint: {
      x: number;
      y: number;
    };
    maxWidth: string;
    alt: string;
  };
  imageAltText: string;
  _alias: string;
};
