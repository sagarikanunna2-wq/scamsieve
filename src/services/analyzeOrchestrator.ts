/**
 * ScamSieve — Orchestrator
 *
 * Top-level function that coordinates AI classification, evidence scanning,
 * and result interpretation into a single AnalysisResult.
 */

import type { AnalysisResult } from '../types';
import { classifyText } from './scamClassifier';
import { scanEvidence } from './evidenceScanner';
import { interpretResult, generateRecommendations } from './interpreter';

export const MAX_INPUT_LENGTH = 5000;
export const MIN_INPUT_LENGTH = 10;

export function validateInput(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return 'Please paste or type a message to analyze.';
  if (trimmed.length < MIN_INPUT_LENGTH)
    return `Message is too short (minimum ${MIN_INPUT_LENGTH} characters).`;
  if (trimmed.length > MAX_INPUT_LENGTH)
    return `Message is too long (maximum ${MAX_INPUT_LENGTH} characters).`;
  return null; // valid
}

export async function analyzeMessage(text: string): Promise<AnalysisResult> {
  const trimmed = text.trim();
  const validationError = validateInput(trimmed);
  if (validationError) {
    throw new Error(validationError);
  }

  // Step 1: AI classification
  const classification = await classifyText(trimmed);

  // Step 2: Evidence scanning
  const evidence = scanEvidence(trimmed);

  // Step 3: Interpretation
  const interpretation = interpretResult(classification, evidence);

  // Step 4: Recommendations
  const recommendations = generateRecommendations(
    classification.predictedLabel,
    evidence
  );

  return {
    classification,
    evidence,
    interpretation,
    recommendations,
    analyzedText: trimmed,
    timestamp: Date.now(),
  };
}
