/**
 * Sample messages for demonstration.
 * Each message MUST go through the real AI model when analyzed.
 * No pre-determined classification is attached.
 */

export interface SampleMessage {
  id: string;
  title: string;
  description: string;
  text: string;
  category: 'suspicious' | 'promotional' | 'normal';
}

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: 'bank-otp',
    title: 'Suspicious bank alert',
    description: 'Asks for OTP and contains a suspicious link',
    category: 'suspicious',
    text: `ALERT: Your SecureBank account has been temporarily suspended due to unusual activity. To restore access within 24 hours, verify your identity by sharing your OTP at https://securebank-verify.example.com/restore. Failure to act will result in permanent account closure. Do not contact customer care — this is handled by our automated security team.`,
  },
  {
    id: 'fake-job',
    title: 'Suspicious job offer',
    description: 'Demands an upfront registration fee',
    category: 'suspicious',
    text: `Congratulations! You have been selected for a Senior Data Analyst position at GlobalTech Solutions with a starting salary of ₹18,00,000/year. To complete your onboarding, pay a one-time registration fee of ₹4,999 via UPI to hr@globaltech-careers.example.com within 48 hours. Contact us on WhatsApp at +91-9876543210 for details. This offer is confidential — do not share it with anyone.`,
  },
  {
    id: 'discount-promo',
    title: 'Promotional message',
    description: 'Offers a discount without requesting sensitive info',
    category: 'promotional',
    text: `FreshMart: Hi! Enjoy 20% off your next order with code FRESH20. Valid till Sunday. Free delivery on orders above ₹499. Shop now at freshmart.example.com. Reply STOP to unsubscribe.`,
  },
  {
    id: 'normal-notification',
    title: 'Normal account notification',
    description: 'Standard account activity alert',
    category: 'normal',
    text: `Your CloudDrive storage is 85% full. You're using 12.8 GB of your 15 GB plan. To manage your storage, review large files in your account settings at clouddrive.example.com/storage. Upgrade to Premium for 100 GB at ₹149/month.`,
  },
];
