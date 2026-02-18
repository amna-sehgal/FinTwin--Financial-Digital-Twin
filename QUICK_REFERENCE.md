# FinTwin Backend - Quick Reference Card

Print this and keep it on your desk while developing!

---

## 🚀 Quick Start (Copy & Paste)

### Run Server
```bash
npm run dev
```

### Test Onboarding
```bash
curl -X POST http://localhost:3000/api/onboarding \
  -H "Content-Type: application/json" \
  -d '{"monthlySalary":100000,"rent":30000,"monthlyExpenses":20000,"currentSavings":500000,"debts":20000}'
```

### Get Dashboard
```bash
curl "http://localhost:3000/api/dashboard?userId=USER_ID_HERE"
```

### Test Simulation
```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","decisionType":"BUY_CAR","cost":800000,"emi":15000}'
```

---

## 🎯 Frontend Integration (Copy & Paste)

### Onboarding Form
```typescript
import { useOnboarding } from '@/hooks/useAPI';

const { submitOnboarding, loading, error } = useOnboarding();

const handleSubmit = async (data) => {
  const userId = await submitOnboarding(data);
  if (userId) router.push('/dashboard');
};
```

### Dashboard
```typescript
import { useDashboard } from '@/hooks/useAPI';

const { fetchDashboard, data } = useDashboard();

useEffect(() => {
  fetchDashboard();
}, []);
```

### Simulation
```typescript
import { useSimulation } from '@/hooks/useAPI';

const { runSimulation } = useSimulation();

const result = await runSimulation('BUY_CAR', {
  cost: 800000,
  emi: 15000
});
```

### Insights
```typescript
import { useInsights } from '@/hooks/useAPI';

const { fetchInsights, insights } = useInsights();

useEffect(() => {
  fetchInsights();
}, []);
```

---

## 📊 Metrics at a Glance

| Metric | What It Is | Good Range |
|--------|-----------|-----------|
| **Leftover** | Income - Expenses | > ₹10,000/month |
| **Savings Rate** | % of income saved | 20-50% |
| **Stress Score** | 0-100 health indicator | < 40 |
| **Freedom Years** | Years to FI | < 20 years |

---

## 🎬 5 Decision Types

```typescript
// Buy a car
useSimulation('BUY_CAR', {
  cost: 800000,      // Upfront
  emi: 15000,        // Monthly
  duration: 60       // Months
});

// Buy a gadget
useSimulation('BUY_GADGET', {
  cost: 50000        // One-time
});

// Move city
useSimulation('MOVE_CITY', {
  rentChange: 5000,  // New rent difference
  cost: 50000        // Moving cost
});

// Change job
useSimulation('CHANGE_JOB', {
  salaryChange: 20000  // New salary difference
});

// Increase rent
useSimulation('INCREASE_RENT', {
  rentChange: 5000   // Rent increase
});
```

---

## ✅ Onboarding Form Fields

```typescript
interface OnboardingData {
  monthlySalary: number;      // Gross monthly income
  rent: number;               // Monthly rent/housing
  monthlyExpenses: number;    // Monthly spending
  currentSavings: number;     // Saved amount
  debts: number;              // Monthly EMI/debt
  city?: string;              // Optional city
}
```

---

## 📁 File Locations

### Most Used Files
```
backend/lib/calculations.ts     ← Formulas
backend/lib/database.ts         ← Data storage
backend/types/index.ts          ← Data types
app/api/*/route.ts              ← API endpoints
hooks/useAPI.ts                 ← React hooks
```

### Documentation
```
backend/README.md               ← Backend overview
backend/API_DOCUMENTATION.md    ← Detailed docs
FRONTEND_INTEGRATION.md         ← Code examples
IMPLEMENTATION_CHECKLIST.md     ← Track progress
ARCHITECTURE.md                 ← System design
```

---

## 🔍 Debugging

### Check API Response
Open DevTools → Network → Click request → Response tab

### Check Errors
Terminal running `npm run dev` shows errors

### Check localStorage
DevTools → Application → Storage → localStorage

### Test with curl
```bash
curl -i http://localhost:3000/api/dashboard?userId=test
```

---

## 📋 Common Tasks

### Save User ID from Onboarding
```typescript
const userId = await submitOnboarding(data);
localStorage.setItem('userId', userId);
```

### Get User ID for Other APIs
```typescript
const userId = localStorage.getItem('userId');
```

### Check If User Exists
```typescript
if (!localStorage.getItem('userId')) {
  router.push('/onboarding');
}
```

### Fetch Dashboard on Component Mount
```typescript
useEffect(() => {
  fetchDashboard();
}, []);
```

### Display Error Message
```typescript
{error && <div className="text-red-600">{error}</div>}
```

### Show Loading State
```typescript
{loading ? 'Loading...' : 'Submit'}
```

---

## 🧮 Calculation Formulas

```
Monthly Leftover = Salary - Rent - Expenses - Debts

Savings Rate (%) = (Leftover / Salary) × 100

Stress Score = Based on debt-to-income ratio
              Higher debt = higher stress
              Negative leftover = max stress

Freedom Years = (Annual Expenses × 25 - Current Savings)
                / Annual Leftover

12-Month Balance = Current + (Monthly Leftover × month)
```

---

## 🔗 API Endpoint Summary

| Method | URL | Purpose |
|--------|-----|---------|
| POST | /api/onboarding | Create user |
| GET | /api/onboarding?userId=... | Get user data |
| GET | /api/dashboard?userId=... | Get metrics |
| POST | /api/simulate | Run simulation |
| GET | /api/insights?userId=... | Get insights |

---

## 🎨 Component Structure

```
Landing Page
├─ Navbar (exists)
├─ Hero (exists)
├─ Features (exists)
└─ CTA → /onboarding

Onboarding Page
├─ Form with 6 fields
├─ Validation
└─ Submit → /dashboard

Dashboard Page
├─ 4 Stat Cards
├─ Balance Chart
├─ AI Insights
└─ Simulate Button → Modal

Simulation Modal
├─ Decision Selector
├─ Conditional Inputs
├─ Before/After Tables
└─ Recommendation
```

---

## 🚨 Error Messages

### "Validation failed"
→ Check form field values are valid numbers

### "User not found"
→ Save userId to localStorage after onboarding

### "Internal server error"
→ Check terminal for error logs

### "Cannot find module"
→ Ensure import path uses `@/hooks/useAPI`

---

## ✨ Success Indicators

- [x] All APIs return 200 status
- [x] userId is saved to localStorage
- [x] Dashboard shows correct metrics
- [x] Simulation shows impact numbers
- [x] Insights are personalized
- [x] No console errors
- [x] Forms have validation
- [x] Loading states appear

---

## 📊 Sample User Profiles

### Healthy
```json
{"monthlySalary":100000,"rent":30000,"monthlyExpenses":20000,"currentSavings":500000,"debts":20000}
```

### Tight
```json
{"monthlySalary":50000,"rent":25000,"monthlyExpenses":20000,"currentSavings":50000,"debts":10000}
```

### Critical
```json
{"monthlySalary":60000,"rent":35000,"monthlyExpenses":25000,"currentSavings":100000,"debts":15000}
```

---

## 🎯 Implementation Order

1. **Landing** → Add onboarding link
2. **Onboarding** → Use useOnboarding hook
3. **Dashboard** → Use useDashboard hook + chart
4. **Simulation** → Create modal + useSimulation
5. **Polish** → Style + responsive
6. **Deploy** → Go live!

---

## 📱 Responsive Design Breakpoints

```typescript
// Tailwind CSS
sm: 640px   // Mobile
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

---

## 🔐 Before Production

- [ ] Add user authentication
- [ ] Use real database (PostgreSQL)
- [ ] Add HTTPS
- [ ] Set up rate limiting
- [ ] Add CORS headers
- [ ] Sanitize inputs
- [ ] Add logging
- [ ] Set up monitoring
- [ ] Add backups
- [ ] Security audit

---

## 🎉 Key Achievements

✅ 4 Complete APIs
✅ All calculations working
✅ React hooks ready
✅ Full documentation
✅ Type-safe code
✅ Error handling
✅ Input validation
✅ Data persistence

---

## 📞 Quick Links

- Backend README: `backend/README.md`
- API Docs: `backend/API_DOCUMENTATION.md`
- Integration: `FRONTEND_INTEGRATION.md`
- Checklist: `IMPLEMENTATION_CHECKLIST.md`
- Architecture: `ARCHITECTURE.md`

---

## 💡 Pro Tips

1. Always save userId after onboarding
2. Test each API with curl first
3. Use browser DevTools Network tab
4. Check console for errors
5. Use Postman for complex requests
6. Test with different user profiles
7. Make responsive before deploy
8. Backup important code changes

---

**Bookmark this page! Reference it while coding!**

For detailed information, see the full documentation files.
