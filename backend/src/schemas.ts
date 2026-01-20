import { z } from 'zod';

export const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).optional(), // Optional for updates or if using SSO
    name: z.string().min(2),
    role: z.enum(['Administrator', 'Manager', 'Sub-Admin', 'Advisor', 'Client']),
    category: z.string().optional(),
    title: z.string().optional(),
    phone: z.string().optional(),
    onboardingCompleted: z.boolean().optional(),
    calendarUrl: z.string().url().optional().or(z.literal('')),
    socialLinks: z.array(z.object({
        platform: z.string(),
        url: z.string()
    })).optional(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export const LeadSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    interest: z.string().optional(),
    status: z.string().optional(),
    source: z.string().optional(),
    assignedTo: z.string().uuid().optional(),
    message: z.string().optional(),
    lifeDetails: z.record(z.any()).optional(),
    realEstateDetails: z.record(z.any()).optional(),
    securitiesDetails: z.record(z.any()).optional(),
    customDetails: z.record(z.any()).optional(),
});

export const ClientSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    advisorId: z.string().uuid().optional(),
    product: z.string().optional(),
    policyNumber: z.string().optional(),
    carrier: z.string().optional(),
    premium: z.number().optional(),
    commissionAmount: z.number().optional()
});
