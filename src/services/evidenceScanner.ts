/**
 * ScamSieve — Deterministic Evidence Scanner
 *
 * Rule-based pattern detector that identifies potentially suspicious phrases
 * in message text. This is NOT an AI model — it uses regular expressions
 * and keyword matching.
 *
 * IMPORTANT LIMITATIONS:
 * - A legitimate message can match some of these patterns.
 * - A scam can avoid all known patterns.
 * - Findings are signals, not proof.
 */

import type { EvidenceFinding, EvidenceScanResult, Severity } from '../types';

// ── Pattern definitions ───────────────────────────────────────────────

interface PatternDef {
  id: string;
  title: string;
  explanation: string;
  severity: Severity;
  reason: string;
  patterns: RegExp[];
}

const PATTERN_DEFS: PatternDef[] = [
  {
    id: 'urgent-deadline',
    title: 'Urgent deadline or threat',
    explanation:
      'The message creates a sense of urgency by threatening account suspension, legal action, or a missed deadline.',
    severity: 'high',
    reason:
      'Scammers often use artificial urgency to prevent victims from verifying the request.',
    patterns: [
      /\b(within\s+\d+\s*(hours?|hrs?|minutes?|mins?))\b/i,
      /\b(immediate(ly)?|urgent(ly)?|right\s+away|act\s+now|don'?t\s+delay|time.?sensitive)\b/i,
      /\b(suspend(ed)?|block(ed)?|deactivat(ed?|ing)|terminat(ed?|ing)|lock(ed)?|restrict(ed)?)\b.*\b(account|access|card|service)\b/i,
      /\b(account|access|card|service)\b.*\b(suspend(ed)?|block(ed)?|deactivat(ed?|ing)|terminat(ed?|ing)|lock(ed)?|restrict(ed)?)\b/i,
      /\b(legal\s+action|law\s+enforcement|arrest|warrant|penalty|fine)\b/i,
      /\b(expir(es?|ing|ed)|deadline|last\s+chance|final\s+(notice|warning|reminder))\b/i,
    ],
  },
  {
    id: 'credential-request',
    title: 'Request for authentication credentials',
    explanation:
      'The message asks for OTPs, PINs, passwords, or other authentication secrets.',
    severity: 'high',
    reason:
      'Legitimate organisations typically never ask you to share passwords, OTPs, or PINs via messages.',
    patterns: [
      /\b(otp|one[\s-]?time[\s-]?password|one[\s-]?time[\s-]?code|verification\s+code)\b/i,
      /\b(share|send|provide|enter|confirm|verify|give)\b.{0,40}\b(password|pin|cvv|cvc|otp|passcode|security\s+code|secret\s+code|mpin)\b/i,
      /\b(password|pin|cvv|cvc|otp|passcode|security\s+code|mpin)\b.{0,40}\b(share|send|provide|enter|confirm|verify|give)\b/i,
    ],
  },
  {
    id: 'upfront-payment',
    title: 'Upfront payment or fee request',
    explanation:
      'The message demands an upfront payment, registration fee, or deposit before receiving a service or reward.',
    severity: 'high',
    reason:
      'Legitimate jobs and prizes do not require upfront fees. This is a common advance-fee fraud tactic.',
    patterns: [
      /\b(registration\s+fee|processing\s+fee|advance\s+fee|upfront\s+(fee|payment|charge)|deposit\s+required)\b/i,
      /\b(pay|send|transfer|deposit)\b.{0,50}\b(fee|charge|amount|payment)\b.{0,30}\b(to\s+receive|to\s+get|to\s+claim|before|in\s+order)\b/i,
      /\b(fee\s+of|amount\s+of)\b.{0,20}[\$₹€£]\s*\d+/i,
      /[\$₹€£]\s*\d+.{0,30}\b(fee|charge|deposit|payment)\b/i,
    ],
  },
  {
    id: 'prize-claim',
    title: 'Prize or reward claim',
    explanation:
      'The message announces a prize, lottery win, or unexpected reward.',
    severity: 'medium',
    reason:
      'Unsolicited prize notifications that ask for personal information or payment are a common fraud tactic.',
    patterns: [
      /\b(congrat(ulation)?s?|winner|you('ve|have)?\s+(won|been\s+selected))\b/i,
      /\b(claim\s+(your|the)\s+(prize|reward|gift|bonus))\b/i,
      /\b(lottery|lucky\s+draw|sweepstake|raffle|jackpot)\b/i,
    ],
  },
  {
    id: 'suspicious-url',
    title: 'Suspicious-looking link',
    explanation:
      'The message contains a URL that uses unusual patterns common in phishing links.',
    severity: 'medium',
    reason:
      'Phishing links often mimic real domains using misspellings, extra subdomains, or unusual TLDs.',
    patterns: [
      // Shortened URLs
      /\bhttps?:\/\/(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|ow\.ly|rb\.gy)\/\S+/i,
      // IP-based URLs
      /\bhttps?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i,
      // URLs with suspicious keywords
      /\bhttps?:\/\/\S*(?:login|verify|secure|update|confirm|account|banking)\S*\.\S+/i,
      // Hyphenated domain impersonation
      /\bhttps?:\/\/\S*(?:[a-z]+-){2,}\S*\.\S+/i,
    ],
  },
  {
    id: 'bypass-verification',
    title: 'Bypass of normal verification',
    explanation:
      'The message asks you to bypass normal security procedures, switch to a private channel, or avoid contacting official support.',
    severity: 'medium',
    reason:
      'Scammers try to move victims away from official channels where fraud might be detected.',
    patterns: [
      /\b(don'?t\s+(call|contact|visit|go\s+to)\s+(the\s+)?(bank|branch|support|helpline|customer\s+care))\b/i,
      /\b(keep\s+(this|it)\s+(private|confidential|secret|between\s+us))\b/i,
      /\b(do\s+not\s+share|don'?t\s+tell\s+anyone)\b/i,
      /\b(switch\s+to|move\s+to|contact\s+(me|us)\s+(on|via|through))\b.{0,30}\b(whatsapp|telegram|signal|personal|private)\b/i,
    ],
  },
  {
    id: 'unusual-payment-channel',
    title: 'Unusual payment method requested',
    explanation:
      'The message asks for payment via gift cards, cryptocurrency, or other hard-to-trace methods.',
    severity: 'high',
    reason:
      'Legitimate organisations do not demand payment via gift cards or cryptocurrency.',
    patterns: [
      /\b(gift\s+card|itunes\s+card|google\s+play\s+card|amazon\s+card)\b/i,
      /\b(bitcoin|crypto(currency)?|btc|eth|usdt|wallet\s+address)\b/i,
      /\b(wire\s+transfer|money\s+order|western\s+union|moneygram)\b/i,
    ],
  },
  {
    id: 'personal-info-request',
    title: 'Request for personal or financial information',
    explanation:
      'The message asks for bank account numbers, Aadhaar numbers, Social Security numbers, or other sensitive personal data.',
    severity: 'high',
    reason:
      'Legitimate institutions rarely ask for full account numbers or identity documents via SMS or email.',
    patterns: [
      /\b(bank\s+account\s*(number|details|info(rmation)?))\b/i,
      /\b(aadhaar|aadhar|social\s+security|ssn|pan\s+(card|number))\b/i,
      /\b(credit\s+card\s*(number|details)|debit\s+card\s*(number|details))\b/i,
      /\b(share|send|provide|enter)\b.{0,30}\b(account\s+number|card\s+number|bank\s+details)\b/i,
    ],
  },
  {
    id: 'urgency-plus-money',
    title: 'Urgency combined with money request',
    explanation:
      'The message combines urgent language with a request for money or financial action.',
    severity: 'high',
    reason:
      'The combination of urgency and a financial request is a strong indicator of social engineering.',
    patterns: [
      /\b(urgent(ly)?|immediate(ly)?|right\s+away|asap)\b.{0,80}\b(transfer|pay|send\s+money|payment)\b/i,
      /\b(transfer|pay|send\s+money|payment)\b.{0,80}\b(urgent(ly)?|immediate(ly)?|right\s+away|asap)\b/i,
    ],
  },
];

// ── Scanner ───────────────────────────────────────────────────────────

/**
 * Scans the given text for suspicious patterns.
 * Returns all matched findings with relevant phrases.
 */
export function scanEvidence(text: string): EvidenceScanResult {
  const findings: EvidenceFinding[] = [];

  for (const def of PATTERN_DEFS) {
    let matchedPhrase: string | null = null;

    for (const regex of def.patterns) {
      const match = text.match(regex);
      if (match) {
        matchedPhrase = match[0];
        break;
      }
    }

    if (matchedPhrase) {
      findings.push({
        id: def.id,
        title: def.title,
        explanation: def.explanation,
        matchedPhrase,
        severity: def.severity,
        reason: def.reason,
      });
    }
  }

  // Sort: high → medium → low
  const severityOrder: Record<Severity, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };
  findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    findings,
    scannedAt: Date.now(),
  };
}

/**
 * Exported for testing: returns the number of defined patterns.
 */
export function getPatternCount(): number {
  return PATTERN_DEFS.length;
}
