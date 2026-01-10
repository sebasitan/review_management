# Google-Safe Review Engagement Platform - Implementation Plan

## COMPLIANCE PRINCIPLES (MANDATORY)
✅ Business data ONLY from Geoapify Autocomplete  
✅ NO manual typing or free-form business entry  
✅ Confirmation step is READ-ONLY  
✅ Google Maps links auto-generated  
✅ Continue buttons disabled until selection  
✅ ZERO Google APIs, ZERO scraping, ZERO review fetching  

---

## ARCHITECTURE OVERVIEW

### **Step 1: Find Your Business (Strict)**
- Geoapify Autocomplete API integration
- Real-time dropdown as user types
- Disable navigation until selection
- Capture: name, address, city, country, lat, lng, source="geoapify"

### **Step 2: Confirm Business (Read-Only)**
- Display business data (non-editable)
- Auto-generate Google Maps link: `https://www.google.com/maps/search/?api=1&query={LAT},{LNG}`
- "Open in Google Maps" button
- "Confirm & Continue" button

### **Step 3: Save to Database**
- Persist business to Prisma
- Associate with logged-in user
- Redirect to dashboard

### **Dashboard: Business Profile**
- Display business name, address, Google Maps link
- Status message: "Reviews are managed on Google Maps"
- NO ratings, NO review count, NO review list

### **Review Request Tools**
- Generate shareable links (Google Maps + direct review link if place_id exists)
- Channels: WhatsApp, SMS, Email, QR Code
- Track internally: requests created, channel used, timestamp

### **Analytics (Internal Data Only)**
- Total requests sent
- Requests by channel
- Requests over time
- NO Google review data inference

### **AI Reply Assistant**
- User pastes review text manually
- Select tone: Professional, Friendly, Apologetic, Promotional
- AI generates suggested reply (OpenAI)
- User edits and copies

---

## DATA MODEL (Already in Prisma)

```prisma
Users ✅
Businesses (user_id, name, address, lat, lng, source) ✅
ReviewRequests ✅
AnalyticsEvents ✅
ReviewDraft ✅
```

---

## API ROUTES TO CREATE/UPDATE

1. `/api/geoapify/autocomplete` - Geoapify search
2. `/api/onboarding` - Save business (UPDATE: strict validation)
3. `/api/reviews` - Return empty array (compliance)
4. `/api/requests` - Log review requests
5. `/api/analytics` - Fetch internal analytics
6. `/api/ai/generate` - AI reply drafts

---

## COMPONENTS TO CREATE/UPDATE

1. `src/app/onboarding/page.tsx` - **Strict** business search (Geoapify only)
2. `src/app/dashboard/page.tsx` - Google-safe dashboard (no reviews)
3. `src/app/dashboard/requests/page.tsx` - Review request tools
4. `src/app/dashboard/analytics/page.tsx` - Internal analytics
5. `src/app/dashboard/ai-assistant/page.tsx` - Manual AI reply tool

---

## VALIDATION RULES

### Onboarding Step 1:
- User MUST select from Geoapify dropdown
- Continue button DISABLED until selection
- NO manual submission without selection

### Onboarding Step 2:
- All fields READ-ONLY
- Display only, no editing
- Google Maps link auto-generated

### Dashboard:
- NO display of ratings
- NO display of review count
- NO display of review list
- Message: "Reviews are managed on Google Maps. Use the tools below to request reviews."

---

## EDGE CASES

1. **No search results**: Show "Not found? Try different keywords" (NO manual entry)
2. **Geoapify API failure**: Show error message, allow retry
3. **User tries to edit in step 2**: Fields are read-only (not just disabled)
4. **Missing lat/lng**: Prevent saving, show error
5. **Duplicate business**: Check existing businesses, show warning

---

## FUTURE EXTENSION (DO NOT IMPLEMENT NOW)

- Google Business Profile OAuth
- Review sync after ownership verification
- Leave architecture extensible for this

---

## TECH STACK

- **Geoapify Autocomplete API** (business search)
- **OpenAI GPT-4** (AI reply drafts)
- **Next.js API Routes** (backend)
- **Prisma + PostgreSQL** (database)
- **Zero Google APIs** (compliance)

---

## IMPLEMENTATION CHECKLIST

- [ ] Install Geoapify dependencies
- [ ] Create `/api/geoapify/autocomplete` route
- [ ] Update onboarding page with strict Geoapify-only search
- [ ] Make step 2 read-only (remove all inputs)
- [ ] Remove Google Places API calls
- [ ] Update `/api/reviews` to return empty array
- [ ] Create review request tools page
- [ ] Create analytics page (internal data only)
- [ ] Create AI assistant page (manual paste-in)
- [ ] Add validation for strict dropdown selection
- [ ] Test full compliance flow
- [ ] Deploy to production

---

**STATUS**: Ready for implementation
**PRIORITY**: High - Compliance critical
**ESTIMATED TIME**: 4-6 hours
