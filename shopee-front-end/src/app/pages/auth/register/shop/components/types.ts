export interface ShopRegistrationForm {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  businessName: string;
  shopName: string;
  taxCode: string;
  businessAddress?: string;
  businessDescription?: string;
  businessType?: string;
  confirmPassword: string;
}

export const BUSINESS_TYPES = [
  { value: "", label: "Select Business Type" },
  { value: "Electronics", label: "Electronics" },
  { value: "Fashion", label: "Fashion" },
  { value: "Home & Garden", label: "Home & Garden" },
  { value: "Sports & Outdoor", label: "Sports & Outdoor" },
  { value: "Health & Beauty", label: "Health & Beauty" },
  { value: "Books & Media", label: "Books & Media" },
  { value: "Food & Beverages", label: "Food & Beverages" },
  { value: "Automotive", label: "Automotive" },
  { value: "Other", label: "Other" }
] as const; 
