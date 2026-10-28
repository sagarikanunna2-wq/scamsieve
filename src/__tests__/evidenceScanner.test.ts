/**
 * ScamSieve — Evidence Scanner Tests
 *
 * Tests for the deterministic rule-based evidence scanner.
 * These tests verify pattern detection, not AI model output.
 */

import { describe, it, expect } from 'vitest';
import { scanEvidence, getPatternCount } from '../services/evidenceScanner';

describe('evidenceScanner', () => {
  it('returns no findings for an ordinary message', () => {
    const result = scanEvidence(
      'Hi, your order has been shipped. Expected delivery: Thursday.'
    );
    expect(result.findings).toHaveLength(0);
    expect(result.scannedAt).toBeGreaterThan(0);
  });

  it('detects urgent deadline threats', () => {
    const result = scanEvidence(
      'Your account will be suspended within 24 hours unless you verify your identity.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('urgent-deadline');
  });

  it('detects credential requests (OTP)', () => {
    const result = scanEvidence(
      'Please share your OTP to complete the transaction.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('credential-request');
  });

  it('detects credential requests (password)', () => {
    const result = scanEvidence(
      'Send your password to verify your account.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('credential-request');
  });

  it('detects upfront payment requests', () => {
    const result = scanEvidence(
      'Pay a registration fee of ₹4999 to confirm your job placement.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('upfront-payment');
  });

  it('detects prize claims', () => {
    const result = scanEvidence(
      'Congratulations! You have won a lucky draw. Claim your prize now!'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('prize-claim');
  });

  it('detects suspicious URLs (IP-based)', () => {
    const result = scanEvidence(
      'Click here: http://192.168.1.1/login to update your account.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('suspicious-url');
  });

  it('detects bypass-verification patterns', () => {
    const result = scanEvidence(
      "Don't call the bank. Keep this confidential and handle it here."
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('bypass-verification');
  });

  it('detects unusual payment channels', () => {
    const result = scanEvidence(
      'Please pay using gift card or bitcoin to process your refund.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('unusual-payment-channel');
  });

  it('detects personal info requests', () => {
    const result = scanEvidence(
      'Share your bank account number to receive your refund.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('personal-info-request');
  });

  it('detects urgency combined with money request', () => {
    const result = scanEvidence(
      'Urgent! Transfer ₹50,000 immediately to avoid legal action.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('urgency-plus-money');
  });

  it('detects multiple patterns in a complex scam message', () => {
    const result = scanEvidence(
      'ALERT: Your account will be blocked within 2 hours. Share your OTP at http://192.168.1.100/verify to restore access. Do not contact customer care.'
    );
    const ids = result.findings.map((f) => f.id);
    expect(ids.length).toBeGreaterThanOrEqual(3);
    expect(ids).toContain('urgent-deadline');
    expect(ids).toContain('credential-request');
    expect(ids).toContain('suspicious-url');
  });

  it('sorts findings by severity (high first)', () => {
    const result = scanEvidence(
      'Congratulations! Your account expires soon. Share OTP now.'
    );
    if (result.findings.length >= 2) {
      const severities = result.findings.map((f) => f.severity);
      const order = { high: 0, medium: 1, low: 2 };
      for (let i = 1; i < severities.length; i++) {
        expect(order[severities[i]]).toBeGreaterThanOrEqual(
          order[severities[i - 1]]
        );
      }
    }
  });

  it('returns matched phrase for each finding', () => {
    const result = scanEvidence('Please share your OTP immediately.');
    for (const finding of result.findings) {
      if (finding.matchedPhrase) {
        expect(typeof finding.matchedPhrase).toBe('string');
        expect(finding.matchedPhrase.length).toBeGreaterThan(0);
      }
    }
  });

  it('handles empty input gracefully', () => {
    const result = scanEvidence('');
    expect(result.findings).toHaveLength(0);
  });

  it('handles very long input without errors', () => {
    const longText = 'This is a safe message. '.repeat(500);
    const result = scanEvidence(longText);
    expect(result.findings).toHaveLength(0);
  });

  it('does not treat HTML-like content as markup', () => {
    const result = scanEvidence(
      '<script>alert("xss")</script> Please share your OTP.'
    );
    const credFinding = result.findings.find(
      (f) => f.id === 'credential-request'
    );
    expect(credFinding).toBeDefined();
    // Matched phrase should contain the raw text, not interpreted HTML
    if (credFinding?.matchedPhrase) {
      expect(credFinding.matchedPhrase).not.toContain('<');
    }
  });

  it('reports the correct pattern count', () => {
    expect(getPatternCount()).toBeGreaterThanOrEqual(8);
  });
});
