# Backend Quick Start Guide

## Project Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## API Quick Reference

### Create User Profile
```bash
curl -X POST http://localhost:3000/api/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "monthlySalary": 75000,
    "rent": 20000,
    "monthlyExpenses": 15000,
    "currentSavings": 200000,
    "debts": 50000,
    "city": "Mumbai"
  }'
```

### Get Dashboard Data
```bash
curl "http://localhost:3000/api/dashboard?userId=user_1708309261449_abc12def"
```

### Run Simulation
```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1708309261449_abc12def",
    "decisionType": "BUY_CAR",
    "cost": 800000,
    "emi": 15000
  }'
```

### Get AI Insights
```bash
curl "http://localhost:3000/api/insights?userId=user_1708309261449_abc12def"
```

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/lib/calculations.ts` | All financial math |
| `backend/lib/database.ts` | Data storage (in-memory) |
| `backend/lib/validation.ts` | Input validation |
| `backend/types/index.ts` | TypeScript types |
| `app/api/onboarding/route.ts` | User creation |
| `app/api/dashboard/route.ts` | Metrics calculation |
| `app/api/simulate/route.ts` | Decision simulation |
| `app/api/insights/route.ts` | AI recommendations |

---

## Development Workflow

### Adding a New Feature
1. Define types in `backend/types/index.ts`
2. Add calculation logic in `backend/lib/calculations.ts`
3. Add validation in `backend/lib/validation.ts`
4. Create API route in `app/api/*/route.ts`

### Testing an Endpoint
1. Use curl (see Quick Reference above) or Postman
2. Check the response in browser console or terminal
3. Verify data in network tab

### Debugging
- Check terminal logs from `npm run dev`
- Use browser DevTools for client-side issues
- Add `console.log()` in API routes for debugging

---

## Frontend Integration (Next Steps)

### Store User ID
```typescript
// After onboarding
const { userId } = await response.json();
localStorage.setItem('userId', userId);
```

### Access Dashboard
```typescript
const userId = localStorage.getItem('userId');
const dashResponse = await fetch(`/api/dashboard?userId=${userId}`);
const { data } = await dashResponse.json();
```

### Run Simulation
```typescript
const result = await fetch('/api/simulate', {
  method: 'POST',
  body: JSON.stringify({
    userId,
    decisionType: 'BUY_CAR',
    cost: 800000,
    emi: 15000,
  }),
});
```

---

## Common Issues

### Issue: "Module not found"
**Solution**: Ensure import paths use `@/backend/` alias

### Issue: User ID not found
**Solution**: Data is stored in-memory. Server restart clears data. Save user ID to localStorage.

### Issue: CORS errors
**Solution**: Next.js API routes handle CORS automatically for same-origin requests

---

## Next Steps

- [ ] Implement frontend forms for onboarding
- [ ] Create dashboard UI with charts
- [ ] Build simulation modal component
- [ ] Add comparison result view
- [ ] Implement real database (PostgreSQL/MongoDB)
- [ ] Add user authentication
- [ ] Deploy to production

---

## Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Backend API Documentation](./API_DOCUMENTATION.md)

---

## Support

Check the main README.md or API_DOCUMENTATION.md for more details.
