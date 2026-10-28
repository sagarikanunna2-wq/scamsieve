# ScamSieve — AI-Powered Scam Message Detector

> **"Think before you trust."**  
> An open-source, privacy-first cybersecurity tool built for the **Hacktoberfest 2026 DigitalOcean Best Open-Source AI Project Challenge**.

---

## 🛡️ Project Overview

**ScamSieve** helps everyday users, professionals, and students identify fraudulent SMS messages, phishing emails, fake job offers, unexpected fee requests, and deceptive alerts. 

Instead of routing user communications through remote cloud APIs or storing sensitive text on a backend database, ScamSieve runs real AI classification directly **inside the client browser** using Transformers.js and ONNX runtime, augmented by a deterministic, rule-based evidence scanner.

---

## 🚀 Key Features

- **100% Client-Side Machine Learning**: Real text classification inference powered by `@huggingface/transformers` running on WebAssembly/ONNX in your browser.
- **Dual-Layer Analysis**:
  1. **Neural Classification**: Categorizes message intent into `fraud`, `spam`, or `legitimate` and presents raw model confidence distributions.
  2. **Evidence-Based Warning Scanner**: Deterministic heuristic engine detecting urgent deadlines, credential harvesting (OTPs/passwords), advance fee fraud, suspicious URLs, and isolation tactics.
- **Disagreement & Ambiguity Transparency**: Honestly highlights when the neural model and heuristic scanner disagree instead of masking uncertainty behind fabricated percentages.
- **Safe Next-Step Action Plans**: Contextual defensive guidance, including direct links to the official Indian **National Cyber Crime Reporting Portal** ([cybercrime.gov.in](https://cybercrime.gov.in)) and helpline **1930**.
- **No Account, No Server Storage, Zero Tracking**: No logins, no database persistence, and no third-party telemetry.
- **Light Theme Security Design**: Modern, clean, accessible UI built with Tailwind CSS and Lucide React icons.

---

## 🧠 Open-Weight AI Model

- **Model**: [`Horizon-Labs/phishing-scam-detector-base`](https://huggingface.co/Horizon-Labs/phishing-scam-detector-base)
- **Base Architecture**: `mmBERT-base` (~307M parameters) fine-tuned on multilingual phishing, scam, and legitimate communication corpora.
- **Target Classes**: `fraud`, `spam`, `legitimate`
- **Model License**: **Apache-2.0**
- **Quantization**: INT8 (`q8`) ONNX runtime loaded in browser.

### How Model Inference Works

1. On the user's first analysis request, the browser lazily downloads and instantiates the ONNX model pipeline via `@huggingface/transformers`.
2. A singleton mutex pattern ensures concurrent requests never trigger duplicate model downloads.
3. Once initialized, the model pipeline is cached in memory for near-instant subsequent inferences.
4. Raw softmax logits across all classes are parsed and normalized without altering or faking scores.

---

## 🔍 Heuristic Evidence Scanner

The evidence scanner (`src/services/evidenceScanner.ts`) runs alongside the neural model to identify concrete social engineering indicators:

| Category | Patterns Detected | Severity |
| :--- | :--- | :--- |
| **Urgent Deadline** | Threats of immediate suspension, legal fines, or ticking timers | High |
| **Credential Request** | Requests for OTP, PIN, password, CVV, or authentication tokens | High |
| **Upfront Fee** | Mandatory onboarding fee, advance deposit, processing fee | High |
| **Suspicious URLs** | IP addresses, URL shorteners, or deceptive hyphenated subdomains | Medium |
| **Bypass Verification** | Urging secrecy, avoiding bank customer care, or shifting to private messaging | Medium |
| **Unusual Payment** | Demands for cryptocurrency, gift cards, or wire transfer | High |

---

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Runtime**: [@huggingface/transformers](https://huggingface.co/docs/transformers.js)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 📦 Installation & Quickstart

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm / yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/scamsieve.git
cd scamsieve

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🧪 Testing

Run automated unit and integration tests:

```bash
# Run unit tests
npm test

# Build production bundle
npm run build
```

---

## ⚠️ Limitations & Ethical Disclosures

- **False Positives**: Legitimate alerts from real banks and employers can occasionally mimic scam language (e.g., legitimate OTP delivery messages or promotional sales).
- **False Negatives**: Advanced targeted spear-phishing or novel fraud methods may evade detection.
- **First-Load Download**: Initial model setup requires network connectivity to download model weights (~641 MB uncompressed / quantized stream). Ensure adequate memory and stable internet for the first load.
- **Advisory Only**: ScamSieve is an assistive screening tool and cannot guarantee total protection. Always verify suspicious communications through official independently sourced channels.

---

## 🇮🇳 Cybercrime Reporting Resources

If you encounter or fall victim to online fraud in India:
- **National Cyber Crime Reporting Portal**: [https://cybercrime.gov.in/](https://cybercrime.gov.in/)
- **National Helpline Number**: **1930** (Citizen Financial Cyber Fraud Reporting and Management System)

---

## 📄 License

- Application Code: [MIT License](LICENSE)
- Pretrained Model (`Horizon-Labs/phishing-scam-detector-base`): [Apache-2.0 License](https://huggingface.co/Horizon-Labs/phishing-scam-detector-base)
