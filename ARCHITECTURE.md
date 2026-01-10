# 🏗️ System Architecture - Google-Safe Review Platform

## Overview
This platform is designed with **strict Google-safe compliance** - zero external review fetching, no Google APIs, and complete transparency.

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   ONBOARDING FLOW                           │
│─────────────────────────────────────────────────────────────│
│  Step 1: Find Business                                      │
│    ├─ User types search query (min 3 chars)                │
│    ├─ Geoapify Autocomplete API called                     │
│    ├─ Dropdown results displayed                           │
│    └─ User MUST select (no manual entry)                   │
│                                                             │
│  Step 2: Confirm Business (READ-ONLY)                      │
│    ├─ Display selected business data                       │
│    ├─ Auto-generate Google Maps link                       │
│    ├─ User verifies (cannot edit)                          │
│    └─ Click "Confirm & Continue"                           │
│                                                             │
│  Step 3: Success                                            │
│    ├─ Business saved to database                           │
│    ├─ Compliance message shown                             │
│    └─ Redirect to dashboard                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DASHBOARD                              │
│─────────────────────────────────────────────────────────────│
│  Business Profile                                           │
│    ├─ Name, Address, City, Country                         │
│    ├─ Google Maps link (lat/lng)                           │
│    └─ NO ratings, NO reviews displayed                     │
│                                                             │
│  Review Request Tools                                       │
│    ├─ WhatsApp Link Generator                              │
│    ├─ SMS Template Copier                                  │
│    ├─ Email Template Copier                                │
│    └─ QR Code Generator                                    │
│                                                             │
│  AI Reply Assistant                                         │
│    ├─ Manual paste review text                             │
│    ├─ Select tone (Professional/Friendly/Empathetic)       │
│    ├─ OpenAI generates draft                               │
│    └─ Copy to clipboard                                    │
│                                                             │
│  Analytics (Internal Only)                                  │
│    ├─ Total requests sent                                  │
│    ├─ Requests by channel                                  │
│    ├─ Timeline chart                                       │
│    └─ NO external review data                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
┌──────────────┐        ┌──────────────────┐        ┌──────────────────┐
│    User      │◄───────│    Business      │────────│  ReviewRequest   │
├──────────────┤        ├──────────────────┤        ├──────────────────┤
│ id           │        │ id               │        │ id               │
│ email        │        │ name             │        │ businessId (FK)  │
│ name         │        │ address          │        │ channel          │
│ role         │        │ city             │        │ recipient        │
│ createdAt    │        │ country          │        │ createdAt        │
└──────────────┘        │ lat              │        └──────────────────┘
                        │ lng              │
                        │ placeId          │                │
                        │ ownerId (FK)     │                │
                        └──────────────────┘                │
                                │                           │
                                │                           │
                                ▼                           ▼
                        ┌──────────────────┐        ┌──────────────────┐
                        │  ReviewDraft     │        │ AnalyticsEvent   │
                        ├──────────────────┤        ├──────────────────┤
                        │ id               │        │ id               │
                        │ businessId (FK)  │        │ businessId (FK)  │
                        │ reviewText       │        │ type             │
                        │ tone             │        │ channel          │
                        │ aiResponse       │        │ createdAt        │
                        │ createdAt        │        └──────────────────┘
                        └──────────────────┘
```

---

## 🔌 API Architecture

### **External APIs Used**

```
┌─────────────────────┐
│   Geoapify API      │ ← Business location autocomplete (ONLY source)
│   (Autocomplete)    │   ✅ Google-safe, no review data
└─────────────────────┘

┌─────────────────────┐
│   OpenAI API        │ ← AI reply draft generation
│   (GPT-4)           │   ✅ Manual paste-in, no auto-sync
└─────────────────────┘
```

### **External APIs NOT Used**
```
❌ Google Places API
❌ Google Reviews API
❌ Any web scraping
❌ Any review fetching service
```

---

## 🛣️ API Routes

```
/api/geoapify/autocomplete
├─ GET: Fetch location suggestions
└─ Uses: Geoapify Autocomplete API

/api/onboarding
├─ POST: Save business profile
└─ Validates: source === 'geoapify'

/api/business
├─ GET: Fetch business by ID
├─ PUT: Update business
└─ DELETE: Delete business + cascade cleanup

/api/reviews
└─ GET: Returns [] (empty array) - COMPLIANCE

/api/requests
├─ GET: Fetch review request history
└─ POST: Log new review request

/api/analytics
└─ GET: Fetch internal analytics (requests, channels, timeline)

/api/ai/generate
└─ POST: Generate AI reply draft (OpenAI)
```

---

## 🔐 Security & Compliance

### **Authentication Flow**
```
User Login
    │
    ├─ NextAuth.js (Google OAuth or Email)
    │
    ├─ Session created
    │
    └─ All API routes validate session
```

### **Authorization Flow**
```
API Request
    │
    ├─ getServerSession() validates user
    │
    ├─ Check business ownership (ownerId === user.id)
    │
    └─ Return data OR 403 Forbidden
```

### **Compliance Enforcement**
```
POST /api/onboarding
    │
    ├─ Validate: source === 'geoapify'
    │   └─ If not, reject with 400 error
    │
    ├─ Validate: required fields (name, address, lat, lng)
    │
    └─ Save to database with source metadata

GET /api/reviews
    │
    └─ ALWAYS return [] (empty array)
        └─ No external review fetching allowed
```

---

## 📊 Review Request Flow

```
User clicks "Send via WhatsApp"
    │
    ├─ Frontend generates message:
    │   "Hi! We'd love your feedback.
    │    Review us: https://google.com/maps/search/?api=1&query=LAT,LNG"
    │
    ├─ POST /api/requests
    │   └─ Log to ReviewRequest table
    │   └─ Log to AnalyticsEvent table
    │
    └─ Open WhatsApp with pre-filled message
        └─ wa.me/PHONE?text=MESSAGE
```

---

## 🤖 AI Reply Draft Flow

```
User pastes review text
    │
    ├─ Selects tone (Professional/Friendly/Empathetic)
    │
    ├─ POST /api/ai/generate
    │   ├─ Send to OpenAI GPT-4
    │   ├─ Generate reply based on tone
    │   └─ Save to ReviewDraft table
    │
    └─ Display AI response
        └─ User copies to clipboard
            └─ Manually pastes into Google Maps
```

---

## 📈 Analytics Data Flow

```
Review Request Sent
    │
    ├─ Create ReviewRequest record
    │   └─ Fields: businessId, channel, recipient, createdAt
    │
    └─ Create AnalyticsEvent record
        └─ Fields: businessId, type, channel, createdAt

Dashboard Analytics Page
    │
    ├─ Query ReviewRequest by businessId
    │
    ├─ Group by channel (WhatsApp, SMS, Email, QR)
    │
    ├─ Group by date (timeline chart)
    │
    └─ Display internal data ONLY
        └─ NO external review data inferred
```

---

## 🌐 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel                              │
│─────────────────────────────────────────────────────────────│
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Next.js App (App Router)                   │   │
│  │  ┌──────────────┐    ┌──────────────┐              │   │
│  │  │  Frontend    │    │  API Routes  │              │   │
│  │  │  (React/TSX) │◄───│  (Next.js)   │              │   │
│  │  └──────────────┘    └──────────────┘              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                    │
│─────────────────────────────────────────────────────────────│
│  Database with Prisma ORM                                   │
│  ├─ Users, Businesses, ReviewRequests                       │
│  └─ AnalyticsEvents, ReviewDrafts                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│─────────────────────────────────────────────────────────────│
│  ├─ Geoapify (Business Search)                              │
│  └─ OpenAI (AI Reply Drafts)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Compliance Summary

| Feature | Implementation | Google-Safe? |
|---------|---------------|--------------|
| Business Search | Geoapify Autocomplete | ✅ Yes |
| Business Data | User selects from dropdown | ✅ Yes |
| Confirmation | Read-only display | ✅ Yes |
| Review Display | Returns empty array | ✅ Yes |
| Review Requests | Internal logging only | ✅ Yes |
| AI Replies | Manual paste-in | ✅ Yes |
| Analytics | Internal data only | ✅ Yes |
| Google Maps Links | Auto-generated (lat/lng) | ✅ Yes |

---

**Built with strict compliance to avoid:**
- ❌ Google Places API usage
- ❌ Google Reviews API usage
- ❌ Web scraping
- ❌ Billing/costs from Google
- ❌ Terms of Service violations

**Status: 100% Compliant** ✅
