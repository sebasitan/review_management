# ✅ Google-Safe Compliance Validation Checklist

## Pre-Deployment Validation

Use this checklist to verify 100% Google-safe compliance before launching.

---

## 🔍 STEP 1: ONBOARDING VALIDATION

### Search Functionality
- [ ] Typing triggers Geoapify autocomplete (not Google Places)
- [ ] Dropdown shows business suggestions
- [ ] Results display: name, address, city, country
- [ ] Minimum 3 characters required to search
- [ ] Loading spinner shows during search
- [ ] Error message displays if API fails

### Selection Enforcement
- [ ] User CANNOT proceed without selecting from dropdown
- [ ] Continue button is disabled until selection
- [ ] No "add manually" option available
- [ ] No free-form text submission

### Confirmation Screen
- [ ] Business name is READ-ONLY (not an input)
- [ ] Address is READ-ONLY (not an input)
- [ ] City is READ-ONLY (not an input)
- [ ] Country is READ-ONLY (not an input)
- [ ] Google Maps link auto-generated from lat/lng
- [ ] "Open in Google Maps" button works
- [ ] Back button returns to Step 1
- [ ] Cannot edit any fields

### API Validation
- [ ] POST /api/onboarding requires `source: 'geoapify'`
- [ ] API rejects requests without source field
- [ ] API validates required fields (name, address, lat, lng)
- [ ] API checks for duplicate businesses
- [ ] Success response includes business ID

---

## 📊 STEP 2: DASHBOARD VALIDATION

### Business Profile Display
- [ ] Shows business name
- [ ] Shows full address
- [ ] Shows Google Maps link
- [ ] Does NOT show ratings
- [ ] Does NOT show review count
- [ ] Does NOT show review list
- [ ] Displays compliance message

### Compliance Message
- [ ] Message states: "Reviews are managed on Google Maps"
- [ ] Links to review request tools
- [ ] No misleading claims about review fetching

---

## 📧 STEP 3: REVIEW REQUEST TOOLS

### WhatsApp
- [ ] Input accepts phone number
- [ ] Button disabled until phone entered
- [ ] Generates correct Google Maps link
- [ ] Opens WhatsApp with pre-filled message
- [ ] Logs request to database (ReviewRequest table)
- [ ] Logs analytics event (AnalyticsEvent table)

### SMS
- [ ] Input accepts phone number
- [ ] Button disabled until phone entered
- [ ] Copies SMS template to clipboard
- [ ] Template includes Google Maps link
- [ ] Logs request to database

### Email
- [ ] Input accepts email address
- [ ] Button disabled until email entered
- [ ] Copies email template to clipboard
- [ ] Template includes subject and body
- [ ] Template includes Google Maps link
- [ ] Logs request to database

### QR Code
- [ ] Generates QR code for Google Maps link
- [ ] QR code is downloadable
- [ ] Opens in new tab
- [ ] Logs request to database

### Request Logging
- [ ] All requests saved to ReviewRequest table
- [ ] Channel field is correct (WHATSAPP, SMS, EMAIL, QR_CODE)
- [ ] BusinessId is correct
- [ ] Timestamp is recorded

---

## 🤖 STEP 4: AI REPLY ASSISTANT

### Manual Paste-In
- [ ] Textarea for review text (not auto-fetched)
- [ ] User must manually paste review
- [ ] Optional customer name field
- [ ] Tone selector (Professional, Friendly, Empathetic)
- [ ] Generate button disabled until review text entered

### AI Generation
- [ ] POST /api/ai/generate sends to OpenAI
- [ ] Response displays in preview box
- [ ] Copy to clipboard button works
- [ ] Saved to ReviewDraft table
- [ ] Does NOT auto-post to Google Maps

### Compliance
- [ ] No automatic review fetching
- [ ] User must manually paste review text
- [ ] Clear instructions to paste response on Google Maps

---

## 📈 STEP 5: ANALYTICS VALIDATION

### Data Sources
- [ ] Analytics fetches ONLY internal data
- [ ] Data comes from ReviewRequest table
- [ ] Data comes from AnalyticsEvent table
- [ ] NO external API calls to Google
- [ ] NO scraping or inference

### Display
- [ ] Shows total requests sent
- [ ] Shows requests by channel (WhatsApp, SMS, Email, QR)
- [ ] Shows requests over time (timeline chart)
- [ ] Does NOT show review success rate
- [ ] Does NOT show external review counts
- [ ] Does NOT infer Google business data

---

## 🔌 STEP 6: API COMPLIANCE

### /api/geoapify/autocomplete
- [ ] Uses Geoapify API (not Google Places)
- [ ] Returns formatted business data
- [ ] Includes lat/lng coordinates
- [ ] Sets source = 'geoapify'

### /api/onboarding
- [ ] POST requires source = 'geoapify'
- [ ] Rejects non-Geoapify sources
- [ ] Validates required fields
- [ ] Saves business to database

### /api/reviews
- [ ] GET always returns [] (empty array)
- [ ] Does NOT fetch external reviews
- [ ] Does NOT scrape data
- [ ] Compliance documented in code

### /api/requests
- [ ] POST logs review requests
- [ ] Validates channel enum
- [ ] Associates with businessId
- [ ] GET returns request history

### /api/analytics
- [ ] Returns ONLY internal data
- [ ] Aggregates from ReviewRequest table
- [ ] Groups by channel and date
- [ ] Does NOT infer external metrics

### /api/business
- [ ] GET fetches business by ID
- [ ] Verifies ownership
- [ ] DELETE cascades to related records
- [ ] PUT updates allowed fields only

---

## 🔐 STEP 7: SECURITY VALIDATION

### Authentication
- [ ] All API routes validate session
- [ ] Unauthorized requests return 401
- [ ] Session uses NextAuth.js

### Authorization
- [ ] Business ownership verified in all endpoints
- [ ] Users can only access their own businesses
- [ ] Forbidden requests return 403

### Data Privacy
- [ ] Customer phone/email in requests (optional)
- [ ] No sensitive data logged
- [ ] Database follows best practices

---

## 🌐 STEP 8: EXTERNAL SERVICES

### Geoapify
- [ ] API key configured in .env
- [ ] Autocomplete working
- [ ] Free tier sufficient for testing
- [ ] Error handling implemented

### OpenAI
- [ ] API key configured in .env
- [ ] AI reply generation working
- [ ] Error handling implemented
- [ ] Token usage reasonable

### Google Maps
- [ ] Links use `https://www.google.com/maps/search/?api=1&query=LAT,LNG`
- [ ] NO API key required
- [ ] NO billing
- [ ] Links open correctly

---

## 📱 STEP 9: USER EXPERIENCE

### Mobile Responsive
- [ ] Onboarding works on mobile
- [ ] Dashboard responsive
- [ ] Request tools work on mobile
- [ ] Buttons are touch-friendly

### Loading States
- [ ] Spinners show during API calls
- [ ] Buttons disabled while loading
- [ ] Error messages display properly
- [ ] Success messages display

### Error Handling
- [ ] Network errors handled gracefully
- [ ] User-friendly error messages
- [ ] Retry options available
- [ ] No broken states

---

## 🚀 STEP 10: DEPLOYMENT

### Environment Variables
- [ ] DATABASE_URL configured
- [ ] GEOAPIFY_API_KEY configured
- [ ] OPENAI_API_KEY configured
- [ ] NEXTAUTH_URL set to production domain
- [ ] NEXTAUTH_SECRET generated

### Database
- [ ] Schema pushed to production database
- [ ] Migrations applied
- [ ] Prisma client generated

### Build
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size reasonable

### Production Test
- [ ] Onboarding flow works
- [ ] Review requests work
- [ ] AI assistant works
- [ ] Analytics loads
- [ ] No console errors

---

## ✅ FINAL COMPLIANCE CHECK

Before launch, confirm:

- [ ] **NO Google Places API** used anywhere
- [ ] **NO Google Reviews API** used anywhere
- [ ] **NO web scraping** of any kind
- [ ] **NO external review fetching** in any endpoint
- [ ] **NO display of external ratings** on dashboard
- [ ] **NO display of external review counts**
- [ ] **ONLY Geoapify** for business search
- [ ] **ONLY internal data** in analytics
- [ ] **Manual paste-in ONLY** for AI assistant
- [ ] All documentation accurate

---

## 🎯 SUCCESS CRITERIA

✅ All checkboxes above are checked  
✅ No Google API billing  
✅ No Terms of Service violations  
✅ Platform helps businesses request reviews  
✅ Platform provides AI tools for replies  
✅ Platform tracks internal metrics only  

---

**DATE**: _______________  
**TESTED BY**: _______________  
**STATUS**: _______________  

---

**If all items are checked, you are 100% Google-Safe compliant.** 🎉
