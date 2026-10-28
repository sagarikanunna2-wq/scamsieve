/**
 * ScamSieve — Result Interpreter
 *
 * Combines AI model predictions with evidence scanner findings
 * to produce a human-readable interpretation and recommendations.
 *
 * This module does NOT calculate an arbitrary combined fraud percentage.
 * It keeps AI predictions and rule-based findings separate.
 */

import type {
  ClassificationResult,
  EvidenceScanResult,
  Interpretation,
  PredictedLabel,
} from '../types';

// ── Interpretation ────────────────────────────────────────────────────

export function interpretResult(
  classification: ClassificationResult,
  evidence: EvidenceScanResult
): Interpretation {
  const { predictedLabel } = classification;
  const highFindings = evidence.findings.filter((f) => f.severity === 'high');
  const hasHighEvidence = highFindings.length > 0;
  const hasAnyEvidence = evidence.findings.length > 0;

  // Detect disagreement between model and evidence scanner
  const disagreement =
    (predictedLabel === 'legitimate' && hasHighEvidence) ||
    (predictedLabel === 'fraud' && !hasAnyEvidence);

  if (predictedLabel === 'fraud') {
    return {
      headline: 'Potential fraud detected',
      explanation: hasAnyEvidence
        ? 'The AI model classifies this message as potentially fraudulent. The evidence scanner also identified suspicious patterns. Exercise extreme caution.'
        : 'The AI model classifies this message as potentially fraudulent, although no specific suspicious patterns were identified by the rule-based scanner. The model may have detected subtle language patterns. Verify the sender independently.',
      riskLevel: 'high',
      disagreement,
    };
  }

  if (predictedLabel === 'spam') {
    return {
      headline: 'Spam-like message detected',
      explanation: hasHighEvidence
        ? 'The AI model classifies this as spam, but the evidence scanner identified high-severity warning signs. This message may warrant closer scrutiny.'
        : 'The AI model classifies this as spam — unwanted promotional or bulk content without a clear attempt to steal information. Use standard caution.',
      riskLevel: hasHighEvidence ? 'medium' : 'medium',
      disagreement: hasHighEvidence,
    };
  }

  if (predictedLabel === 'legitimate') {
    if (hasHighEvidence) {
      return {
        headline: 'AI says legitimate, but suspicious patterns found',
        explanation:
          'The AI model classifies this message as legitimate, but the evidence scanner identified potentially suspicious patterns. This disagreement suggests extra caution — verify the sender and any requests independently before taking action.',
        riskLevel: 'medium',
        disagreement: true,
      };
    }
    if (hasAnyEvidence) {
      return {
        headline: 'No strong fraud signal detected',
        explanation:
          'The AI model classifies this message as legitimate. A few patterns were noted by the rule-based scanner, but they may appear in normal messages too. Stay alert but no immediate action is required.',
        riskLevel: 'low',
        disagreement: false,
      };
    }
    return {
      headline: 'No strong fraud signal detected',
      explanation:
        'The AI model classifies this message as legitimate and the evidence scanner found no suspicious patterns. However, no automated tool can guarantee that a message is safe — use your own judgement.',
      riskLevel: 'low',
      disagreement: false,
    };
  }

  // unknown label
  return {
    headline: 'Classification uncertain',
    explanation:
      'The model returned an unexpected label. The result may not be reliable. Treat this message with caution and verify it independently.',
    riskLevel: 'medium',
    disagreement: false,
  };
}

// ── Recommendations ───────────────────────────────────────────────────

export function generateRecommendations(
  predictedLabel: PredictedLabel,
  evidence: EvidenceScanResult
): string[] {
  const recs: string[] = [];
  const findingIds = new Set(evidence.findings.map((f) => f.id));

  // Universal recommendation
  if (predictedLabel === 'fraud' || predictedLabel === 'spam') {
    recs.push(
      'Do not click any links in this message until you have independently verified the sender.'
    );
  }

  if (findingIds.has('credential-request')) {
    recs.push(
      'Never share OTPs, PINs, passwords, or CVV numbers with anyone who contacts you unexpectedly — banks and legitimate services never ask for these via messages.'
    );
  }

  if (findingIds.has('upfront-payment')) {
    recs.push(
      'Do not pay unexpected registration fees or advance charges without independently verifying the organisation and the request.'
    );
  }

  if (findingIds.has('suspicious-url')) {
    recs.push(
      'Do not click links in the message. If you need to check your account, navigate directly to the official website by typing the address yourself.'
    );
  }

  if (findingIds.has('unusual-payment-channel')) {
    recs.push(
      'Be extremely cautious of requests for payment via gift cards, cryptocurrency, or wire transfer — these methods are virtually impossible to reverse.'
    );
  }

  if (findingIds.has('bypass-verification')) {
    recs.push(
      'If a message asks you to avoid contacting official support or keep the interaction private, treat it as a red flag.'
    );
  }

  if (findingIds.has('personal-info-request')) {
    recs.push(
      'Do not share personal or financial information such as bank account numbers, Aadhaar numbers, or card details via messages.'
    );
  }

  if (findingIds.has('urgent-deadline') || findingIds.has('urgency-plus-money')) {
    recs.push(
      'Artificial urgency is a social engineering tactic. Take your time to verify any claims before acting.'
    );
  }

  if (findingIds.has('prize-claim')) {
    recs.push(
      'Unexpected prize notifications are a common fraud pattern. If you did not enter a competition, treat the claim with suspicion.'
    );
  }

  // General verification recommendation
  if (predictedLabel === 'fraud' || predictedLabel === 'spam' || evidence.findings.length > 0) {
    recs.push(
      'Contact the organisation using a phone number or website obtained independently from an official source — not the one in this message.'
    );
  }

  // For legitimate classification with no evidence
  if (predictedLabel === 'legitimate' && evidence.findings.length === 0) {
    recs.push(
      'If the message appears legitimate but you remain uncertain, verify it independently by contacting the sender through official channels.'
    );
  }

  // India-specific — always included as optional resource
  recs.push(
    'If you believe you have received a fraudulent message, you can report it at cybercrime.gov.in or call the Indian Cyber Crime Helpline at 1930.'
  );

  return recs;
}
