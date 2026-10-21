import { z } from "zod";

export const projectTypes = [
  "new-website",
  "website-refresh",
  "landing-page",
  "care-support",
  "something-else",
];

export const budgetRanges = [
  "under-2000",
  "2000-4000",
  "4000-8000",
  "8000-plus",
  "not-sure",
];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Please enter your name." })
    .max(80, { error: "Please use 80 characters or fewer." }),
  email: z
    .email({ error: "Please enter a valid email address." })
    .max(254, { error: "Please use a shorter email address." }),
  projectType: z.enum(projectTypes).or(z.literal("")).default(""),
  budget: z.enum(budgetRanges).or(z.literal("")).default(""),
  message: z
    .string()
    .trim()
    .min(20, { error: "Please share at least 20 characters about your project." })
    .max(3000, { error: "Please keep your message under 3,000 characters." }),
  consent: z.literal(true, {
    error: "Please confirm that we can contact you about this enquiry.",
  }),
  website: z.string().max(0).optional().default(""),
  startedAt: z.number().int().nonnegative().optional(),
});

export const fieldMessages = {
  name: "Please enter your name.",
  email: "Please enter a valid email address.",
  projectType: "Please choose a project type.",
  budget: "Please choose a budget range.",
  message: "Please share at least 20 characters about your project.",
  consent: "Please confirm that we can contact you about this enquiry.",
  form: "Please check the form and try again.",
};

export function toFieldErrors(error) {
  const fields = {};
  for (const issue of error.issues) {
    const key = issue.path[0] ?? "form";
    if (!fields[key]) {
      fields[key] = fieldMessages[key] ?? "Please check this field.";
    }
  }
  return fields;
}
