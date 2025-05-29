export type LeafletSection = {
  title: LeafletTextfield;
  content: LeafletTextfield;
};

export type LeafletTextfield = {
  value?: string;
  placeholder?: string;
};

export type LeafletData = {
  title: LeafletTextfield;
  petName: LeafletTextfield;
  petSexIsMale: boolean;
  imageSrc: string;
  asideSection: LeafletSection[];
  sections: LeafletSection[];
};
