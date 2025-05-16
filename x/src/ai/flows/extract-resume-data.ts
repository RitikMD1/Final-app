// extract-resume-data.ts
'use server';

/**
 * @fileOverview Extracts key information from a resume using generative AI.
 *
 * - extractResumeData - A function that handles the resume data extraction process.
 * - ExtractResumeDataInput - The input type for the extractResumeData function.
 * - ExtractResumeDataOutput - The return type for the extractResumeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractResumeDataInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
});

export type ExtractResumeDataInput = z.infer<typeof ExtractResumeDataInputSchema>;

const SkillsSchema = z.array(z.string()).describe('List of skills extracted from the resume.');
const ExperienceSchema = z.array(
  z.object({
    title: z.string().describe('Job title'),
    company: z.string().describe('Company name'),
    dates: z.string().describe('Dates of employment'),
    description: z.string().describe('Job description'),
  })
).describe('List of work experiences.');
const EducationSchema = z.array(
  z.object({
    institution: z.string().describe('Educational institution name'),
    degree: z.string().describe('Degree earned'),
    dates: z.string().describe('Dates of attendance'),
  })
).describe('List of educational experiences.');

const ExtractResumeDataOutputSchema = z.object({
  name: z.string().optional().describe('Full name of the individual.'),
  email: z.string().optional().describe('Email address.'),
  phone: z.string().optional().describe('Phone number.'),
  summary: z.string().optional().describe('Summary or objective statement from the resume.'),
  skills: SkillsSchema,
  experience: ExperienceSchema,
  education: EducationSchema,
});

export type ExtractResumeDataOutput = z.infer<typeof ExtractResumeDataOutputSchema>;

export async function extractResumeData(input: ExtractResumeDataInput): Promise<ExtractResumeDataOutput> {
  return extractResumeDataFlow(input);
}

const extractResumeDataPrompt = ai.definePrompt({
  name: 'extractResumeDataPrompt',
  input: {schema: ExtractResumeDataInputSchema},
  output: {schema: ExtractResumeDataOutputSchema},
  prompt: `You are an AI expert in parsing resumes and extracting key information. Analyze the following resume text and extract the individual's name, email address, phone number, a summary or objective statement, skills, work experience, and education.

Resume Text:
{{{resumeText}}}

Name: (Full name of the individual)
Email: (Email address)
Phone: (Phone number)
Summary: (A brief summary or objective statement, if present)
Skills: (list of skills)
Experience: (list of work experiences with title, company, dates, description)
Education: (list of educational experiences with institution, degree, dates)

Ensure the output is structured according to the schema definitions. If a field like phone number, email, or summary is not present or clearly identifiable, omit it or return an empty string for that field.`,
});

const extractResumeDataFlow = ai.defineFlow(
  {
    name: 'extractResumeDataFlow',
    inputSchema: ExtractResumeDataInputSchema,
    outputSchema: ExtractResumeDataOutputSchema,
  },
  async input => {
    const {output} = await extractResumeDataPrompt(input);
    return output!;
  }
);
