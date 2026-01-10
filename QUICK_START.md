# 🚀 Quick Start Guide - Google-Safe Review Platform

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Geoapify API key (free)
- OpenAI API key (for AI features)

---

## Step 1: Environment Setup

1. **Copy environment variables**:
   ```bash
   # Copy ENV_TEMPLATE.txt to .env
   # Or create .env manually
   ```

2. **Get Geoapify API Key** (FREE):
   - Go to https://www.geoapify.com/
   - Sign up for free account
   - Create project and copy API key
   - Add to `.env` as `GEOAPIFY_API_KEY=...`

3. **Get OpenAI API Key**:
   - Go to https://platform.openai.com/
   - Create account and get API key
   - Add to `.env` as `OPENAI_API_KEY=...`

4. **Set NextAuth Secret**:
   ```bash
   # Generate secret
   openssl rand -base64 32
   
   # Add to .env
   NEXTAUTH_SECRET="generated_secret_here"
   ```

---

## Step 2: Database Setup

```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

---

## Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Step 4: Test Onboarding Flow

1. **Create account / Login**
2. **Onboarding Step 1**:
   - Type at least 3 characters (e.g., "coffee shop london")
   - Wait for Geoapify dropdown results
   - Click to select a business (REQUIRED)
   
3. **Onboarding Step 2**:
   - Verify business details (read-only)
   - Click "Open in Google Maps" to verify location
   - Click "Confirm & Continue"

4. **Step 3: Success**
   - View compliance message
   - Go to dashboard

---

## Step 5: Test Features

### **Review Request Tools**
1. Go to Dashboard → "Review Requests"
2. Try generating:
   - WhatsApp link (opens WhatsApp with message)
   - SMS template (copies to clipboard)
   - Email template (copies to clipboard)
   - QR Code (generates downloadable QR)

### **AI Reply Assistant**
1. Go to Dashboard → "AI Assistant"
2. Paste a sample review text
3. Select tone (Professional/Friendly/Empathetic)
4. Click "Generate Reply Draft"
5. Copy and edit as needed

### **Analytics**
1. Go to Dashboard → "Analytics"
2. View internal request tracking
3. Check requests by channel
4. Review timeline

---

## 📋 Compliance Checklist

Before going live, verify:

- [ ] Geoapify API key is working
- [ ] Onboarding shows Geoapify dropdown results
- [ ] Step 2 is completely read-only
- [ ] Cannot manually type business data
- [ ] `GET /api/reviews` returns empty array
- [ ] Dashboard shows NO external review counts
- [ ] Dashboard shows NO external ratings
- [ ] Review request tools log to database
- [ ] AI assistant requires manual paste-in
- [ ] Analytics shows ONLY internal data

---

## 🚨 Common Issues

### **Geoapify not working**
- Check API key in `.env`
- Verify you have credits (3000 free/day)
- Check browser console for errors

### **Database connection failed**
- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL is running
- Run `npx prisma db push` again

### **OpenAI errors**
- Check `OPENAI_API_KEY` in `.env`
- Verify you have credits
- Check usage limits

### **No search results**
- Try different keywords
- Ensure Geoapify API is working
- Check network tab in browser

---

## 📚 API Routes

- `/api/geoapify/autocomplete` - Business search
- `/api/onboarding` - Save business profile
- `/api/business` - Get/update/delete business
- `/api/reviews` - Returns empty array (compliance)
- `/api/requests` - Log review requests
- `/api/analytics` - Fetch internal analytics
- `/api/ai/generate` - Generate AI reply drafts

---

## 🎯 Key Features

✅ **Geoapify-only business search** (no Google APIs)  
✅ **Strict dropdown selection** (no manual typing)  
✅ **Read-only confirmation** (Step 2)  
✅ **Auto-generated Google Maps links**  
✅ **Review request tools** (WhatsApp, SMS, Email, QR)  
✅ **AI reply assistant** (manual paste-in)  
✅ **Internal analytics** (no external data)  
✅ **Zero Google API costs**  
✅ **100% Google-safe compliance**  

---

## 🚀 Deploy to Production

### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### **Environment Variables for Production**
- `DATABASE_URL` - Your production PostgreSQL URL
- `GEOAPIFY_API_KEY` - Your Geoapify key
- `OPENAI_API_KEY` - Your OpenAI key
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Same secret from development

---

## 📞 Support

**Documentation:**
- Geoapify: https://www.geoapify.com/docs
- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs
- NextAuth: https://next-auth.js.org

**Issues:**
- Check `GOOGLE_SAFE_IMPLEMENTATION.md` for detailed compliance notes
- Review Prisma schema in `prisma/schema.prisma`
- Check API routes in `src/app/api/`

---

**STATUS**: Ready to deploy ✅  
**TIME TO LAUNCH**: ~15 minutes  
**COMPLIANCE**: 100% Google-Safe 🔒
