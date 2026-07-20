import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[0-9+\s-]+$/, "Enter a valid phone number"),
  email: z.email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  address: z.string().min(10, "Please enter a complete address"),
  postal_code: z.string().optional(),
  order_notes: z.string().optional(),
  coupon_code: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
