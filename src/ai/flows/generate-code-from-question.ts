'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating code snippets
 *               based on a coding question and a specified programming language.
 *
 * - generateCodeFromQuestion - A function that handles the code generation process.
 * - GenerateCodeFromQuestionInput - The input type for the generateCodeFromQuestion function.
 * - GenerateCodeFromQuestionOutput - The return type for the generateCodeFromQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCodeFromQuestionInputSchema = z.object({
  question: z.string().describe('The coding question or problem description.'),
  language: z
    .enum(['C', 'C++', 'Python', 'Java'])
    .describe('The target programming language for the code generation.'),
});
export type GenerateCodeFromQuestionInput = z.infer<
  typeof GenerateCodeFromQuestionInputSchema
>;

const GenerateCodeFromQuestionOutputSchema = z.object({
  code: z.string().describe('The generated code snippet, without any comments.'),
});
export type GenerateCodeFromQuestionOutput = z.infer<
  typeof GenerateCodeFromQuestionOutputSchema
>;

export async function generateCodeFromQuestion(
  input: GenerateCodeFromQuestionInput
): Promise<GenerateCodeFromQuestionOutput> {
  return generateCodeFromQuestionFlow(input);
}

const generateCodePrompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: { schema: GenerateCodeFromQuestionInputSchema },
  output: { schema: GenerateCodeFromQuestionOutputSchema },
  prompt: `You are an expert programming assistant that generates code snippets.

Generate a code snippet in the '{{{language}}}' programming language that solves the following problem. The code should be clean, efficient, and should not contain any comments.

Problem: {{{question}}}

Your response must be a JSON object with a single 'code' field containing the generated code snippet. Do not include markdown formatting for the code block.`,
});

const generateCodeFromQuestionFlow = ai.defineFlow(
  {
    name: 'generateCodeFromQuestionFlow',
    inputSchema: GenerateCodeFromQuestionInputSchema,
    outputSchema: GenerateCodeFromQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await generateCodePrompt(input);
    return output!;
  }
);
