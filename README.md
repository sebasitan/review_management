# 🚀 Google-Safe Review Engagement Platform

> **A 100% compliant review management platform that helps businesses request reviews and generate AI-powered replies without violating Google's Terms of Service.**

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![Compliance](https://img.shields.io/badge/Compliance-100%25%20Google--Safe-brightgreen)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## 🎯 What This Platform Does

✅ **Helps businesses request reviews** from customers via WhatsApp, SMS, Email, and QR codes  
✅ **Generates AI-powered reply drafts** for manual posting on Google Maps  
✅ **Tracks internal analytics** (requests sent, channels used, timeline)  
✅ **Uses Geoapify** for business location search (Google-safe)  
✅ **Zero Google API costs** - no Places API or Reviews API needed  

---

## ❌ What This Platform Does NOT Do

❌ Fetch external reviews from Google or any platform  
❌ Display review counts or ratings  
❌ Scrape review data  
❌ Use Google Places API or Google Reviews API  
❌ Infer review success or Google business data  
❌ Auto-sync reviews  

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](./QUICK_START.md) | Get up and running in 15 minutes |
| [GOOGLE_SAFE_IMPLEMENTATION.md](./GOOGLE_SAFE_IMPLEMENTATION.md) | Detailed compliance notes |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture and data flow |
| [COMPLIANCE_CHECKLIST.md](./COMPLIANCE_CHECKLIST.md) | Pre-deployment validation |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Technical implementation details |

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Create .env file (see ENV_TEMPLATE.txt)
cp ENV_TEMPLATE.txt .env

# Add required keys:
# - GEOAPIFY_API_KEY (get free at https://geoapify.com)
# - OPENAI_API_KEY (for AI features)
# - DATABASE_URL (PostgreSQL)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
```

### 3. Database Setup

```bash
# Push schema to database
npx prisma db push

# (Optional) View database
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Vanilla CSS (Premium Dark Theme)
- **Database**: Prisma + PostgreSQL (Supabase recommended)
- **Authentication**: NextAuth.js
- **Business Search**: Geoapify Autocomplete API
- **AI**: OpenAI GPT-4 (reply drafts)
- **Deployment**: Vercel

---

## 📋 Core Features

### 1. **Strict Business Onboarding**
- Geoapify autocomplete search (real-time dropdown)
- User MUST select from dropdown (no manual typing)
- Read-only confirmation screen
- Auto-generated Google Maps links

### 2. **Review Request Tools**
- **WhatsApp**: Opens WhatsApp with pre-filled message
- **SMS**: Copies SMS template to clipboard
- **Email**: Copies email template to clipboard
- **QR Code**: Generates downloadable QR code

### 3. **AI Reply Assistant**
- Manual paste-in for review text
- Tone selection (Professional, Friendly, Empathetic)
- OpenAI-powered reply generation
- Copy to clipboard (for manual posting)

### 4. **Internal Analytics**
- Total requests sent
- Requests by channel
- Timeline chart
- **NO external review data**

### 5. **Google-Safe Compliance**
- Zero Google API usage
- No external review fetching
- No billing/costs
- 100% Terms of Service compliant

---

## 🗄️ Database Schema

```prisma
model User {
  id         String     @id @default(cuid())
  email      String     @unique
  businesses Business[]
}

model Business {
  id             String           @id @default(cuid())
  name           String
  address        String
  city           String?
  country        String?
  lat            Float
  lng            Float
  placeId        String?
  ownerId        String
  owner          User             @relation(fields: [ownerId], references: [id])
  reviewRequests ReviewRequest[]
  analytics      AnalyticsEvent[]
  reviewDrafts   ReviewDraft[]
}

model ReviewRequest {
  id         String   @id @default(cuid())
  businessId String
  business   Business @relation(fields: [businessId], references: [id])
  channel    Channel  // WHATSAPP | SMS | EMAIL | QR_CODE
  recipient  String?
  createdAt  DateTime @default(now())
}

model AnalyticsEvent {
  id         String   @id @default(cuid())
  businessId String
  business   Business @relation(fields: [businessId], references: [id])
  type       String
  channel    Channel?
  createdAt  DateTime @default(now())
}

model ReviewDraft {
  id         String   @id @default(cuid())
  businessId String
  business   Business @relation(fields: [businessId], references: [id])
  reviewText String   @db.Text
  tone       String
  aiResponse String   @db.Text
  createdAt  DateTime @default(now())
}

enum Channel {
  WHATSAPP
  SMS
  EMAIL
  QR_CODE
}
```

---

## 🔌 API Routes

| Route | Method | Purpose | Compliance |
|-------|--------|---------|------------|
| `/api/geoapify/autocomplete` | GET | Business search | ✅ Geoapify-only |
| `/api/onboarding` | POST | Save business profile | ✅ Source validation |
| `/api/business` | GET | Fetch business by ID | ✅ Ownership verified |
| `/api/reviews` | GET | **Returns []** | ✅ No external data |
| `/api/requests` | POST/GET | Log/fetch review requests | ✅ Internal tracking |
| `/api/analytics` | GET | Fetch internal analytics | ✅ Internal data only |
| `/api/ai/generate` | POST | Generate AI reply draft | ✅ Manual paste-in |

---

## 🔐 Security

- **Authentication**: NextAuth.js (Google OAuth or Email)
- **Authorization**: Business ownership verified in all endpoints
- **Session Management**: Secure HTTP-only cookies
- **Data Privacy**: Customer contact info optional and secured

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - DATABASE_URL
# - GEOAPIFY_API_KEY
# - OPENAI_API_KEY
# - NEXTAUTH_URL (your production domain)
# - NEXTAUTH_SECRET
```

### Other Platforms
Compatible with any Next.js host (Netlify, Railway, AWS, etc.)

---

## 📊 Compliance Summary

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| No Google Places API | Uses Geoapify | ✅ |
| No Google Reviews API | `/api/reviews` returns [] | ✅ |
| No web scraping | Zero scraping code | ✅ |
| No external review display | Dashboard shows compliance message | ✅ |
| Strict business search | Dropdown selection only | ✅ |
| Read-only confirmation | Step 2 uses divs, not inputs | ✅ |
| Internal analytics only | No external data fetching | ✅ |
| Manual AI paste-in | User must paste review text | ✅ |

**Compliance Score: 100%** ✅

---

## 🎨 UI/UX Highlights

- **Dark Modern Theme** - Premium glassmorphism design
- **Smooth Animations** - slideUp, spin, hover effects
- **Mobile Responsive** - Works on all devices
- **Loading States** - Spinners and disabled buttons
- **Error Handling** - User-friendly error messages
- **Success Feedback** - Confirmation messages and visual cues

---

## 🧪 Testing

### Manual Testing

1. **Onboarding Flow**:
   ```bash
   # Test Steps:
   # 1. Type business name (min 3 chars)
   # 2. Select from Geoapify dropdown
   # 3. Verify read-only confirmation
   # 4. Click "Confirm & Continue"
   # 5. Check database for new business
   ```

2. **Review Request Tools**:
   ```bash
   # Test WhatsApp, SMS, Email, QR Code
   # Verify database logging
   # Check analytics increments
   ```

3. **AI Assistant**:
   ```bash
   # Paste sample review
   # Select tone
   # Generate draft
   # Copy to clipboard
   ```

### Compliance Testing

See [COMPLIANCE_CHECKLIST.md](./COMPLIANCE_CHECKLIST.md) for full validation steps.

---

## 📞 Support

- **Issues**: Check documentation files first
- **Geoapify**: https://www.geoapify.com/docs
- **OpenAI**: https://platform.openai.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Next.js**: https://nextjs.org/docs

---

## 🤝 Contributing

This is a private/commercial project. Contact the repository owner for contribution guidelines.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎯 Roadmap

### Current (v1.0)
- ✅ Google-safe business onboarding
- ✅ Review request tools (WhatsApp, SMS, Email, QR)
- ✅ AI reply assistant
- ✅ Internal analytics

### Future (v2.0 - NOT IMPLEMENTED)
- Google Business Profile OAuth (after ownership verification)
- Review sync (compliant, post-verification)
- Sentiment analysis
- Team collaboration features

---

## ⚠️ Important Notes

1. **This platform does NOT fetch reviews** - it helps you REQUEST reviews
2. **Reviews are managed on Google Maps** - not within this platform
3. **AI replies are drafts** - user must manually post to Google Maps
4. **Zero Google API costs** - uses Geoapify instead
5. **100% compliant** - no Terms of Service violations

---

## 🏆 Built With

This platform was architected with **strict compliance requirements**:

- Zero external review fetching
- No Google APIs
- Complete transparency
- User-centric design
- Production-ready code

Perfect for:
- Small businesses
- Agencies managing multiple clients
- SaaS platforms
- Review management tools

---

**Status**: ✅ Production Ready  
**Compliance**: ✅ 100% Google-Safe  
**Last Updated**: January 2026  

---

Made with ❤️ for businesses who want to grow their reputation ethically and compliantly.
