# Frontend-Backend Integration Guide

## Overview
This guide explains how to integrate the FinTwin frontend components with the backend API.

---

## Available Custom Hooks

### 1. `useOnboarding()`
For the Onboarding page to save user financial data.

**Usage:**
```typescript
import { useOnboarding } from '@/hooks/useAPI';

function OnboardingForm() {
  const { submitOnboarding, loading, error } = useOnboarding();

  const handleSubmit = async (formData) => {
    const userId = await submitOnboarding({
      monthlySalary: formData.salary,
      rent: formData.rent,
      monthlyExpenses: formData.expenses,
      currentSavings: formData.savings,
      debts: formData.debts,
      city: formData.city,
    });

    if (userId) {
      // Redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {error && <div className="error">{error}</div>}
      <button disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
    </form>
  );
}
```

---

### 2. `useDashboard()`
For the Dashboard page to fetch and display financial metrics.

**Usage:**
```typescript
import { useDashboard } from '@/hooks/useAPI';

function Dashboard() {
  const { fetchDashboard, loading, error, data } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  const { metrics } = data;

  return (
    <div>
      {/* Top Cards */}
      <div className="card">
        <h3>Monthly Leftover</h3>
        <p className={metrics.monthlyLeftover < 0 ? 'red' : 'green'}>
          ₹{Math.abs(metrics.monthlyLeftover).toLocaleString()}
        </p>
      </div>

      <div className="card">
        <h3>Savings Rate</h3>
        <p>{metrics.savingsRate.toFixed(1)}%</p>
      </div>

      <div className="card">
        <h3>Financial Stress</h3>
        <p className={metrics.stressScore > 50 ? 'red' : 'green'}>
          {metrics.stressScore.toFixed(0)}/100
        </p>
      </div>

      <div className="card">
        <h3>Years to Financial Freedom</h3>
        <p>{metrics.freedomYears === 999 ? 'Not achievable' : metrics.freedomYears.toFixed(1)}</p>
      </div>

      {/* Chart with projected balance */}
      <Chart data={metrics.projectedBalance} />
    </div>
  );
}
```

---

### 3. `useSimulation()`
For the Simulation modal to run decision simulations.

**Usage:**
```typescript
import { useSimulation } from '@/hooks/useAPI';

function SimulationModal({ isOpen, onClose }) {
  const { runSimulation, loading, error } = useSimulation();
  const [result, setResult] = useState(null);

  const handleSimulate = async (decisionType, params) => {
    const simResult = await runSimulation(decisionType, params);
    if (simResult) {
      setResult(simResult);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {!result ? (
        <div>
          {/* Decision options */}
          <select onChange={(e) => setDecisionType(e.target.value)}>
            <option>Buy Car</option>
            <option>Move City</option>
            <option>Change Job</option>
            <option>Buy Gadget</option>
            <option>Increase Rent</option>
          </select>

          {/* Conditional input fields based on decision type */}
          {decisionType === 'BUY_CAR' && (
            <>
              <input type="number" placeholder="Car cost" />
              <input type="number" placeholder="Monthly EMI" />
            </>
          )}

          <button onClick={() => handleSimulate(decisionType, { /* params */ })} disabled={loading}>
            {loading ? 'Simulating...' : 'Simulate'}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <SimulationResult result={result} />
      )}
    </Modal>
  );
}

function SimulationResult({ result }) {
  return (
    <div>
      <h2>Simulation Result</h2>
      
      <div className="comparison">
        <div>
          <h3>Before</h3>
          <p>Monthly Leftover: ₹{result.originalMetrics.monthlyLeftover}</p>
          <p>Stress Score: {result.originalMetrics.stressScore}</p>
        </div>

        <div>
          <h3>After</h3>
          <p>Monthly Leftover: ₹{result.newMetrics.monthlyLeftover}</p>
          <p>Stress Score: {result.newMetrics.stressScore}</p>
        </div>
      </div>

      <div className="impact">
        <h3>Impact</h3>
        <p>Monthly Leftover Change: {result.impact.monthlyLeftoverChange > 0 ? '+' : ''}₹{result.impact.monthlyLeftoverChange}</p>
        <p>Stress Score Change: {result.impact.stressScoreChange > 0 ? '+' : ''}{result.impact.stressScoreChange}</p>
      </div>

      <div className="recommendation">
        <h3>AI Recommendation</h3>
        <p>{result.recommendation}</p>
      </div>
    </div>
  );
}
```

---

### 4. `useInsights()`
For the AI insights panel (optional).

**Usage:**
```typescript
import { useInsights } from '@/hooks/useAPI';

function InsightsPanel() {
  const { fetchInsights, loading, error, insights } = useInsights();

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) return <div>Loading insights...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="insights-panel">
      {insights.map((insight, i) => (
        <div key={i} className={`insight insight-${insight.status}`}>
          <h4>{insight.message}</h4>
          <p>{insight.suggestion}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Component Integration Checklist

### Landing Page (`app/page.tsx`)
- [x] Navbar (already exists)
- [x] Hero section (already exists)
- [x] Feature cards (already exists)
- [ ] Add link to `/onboarding` in CTA button

### Onboarding Page (`app/onboarding/page.tsx`)
- [x] OnboardingForm component (already exists)
- [ ] Import and use `useOnboarding()` hook
- [ ] Collect fields: salary, rent, expenses, savings, debts, city
- [ ] Call submitOnboarding on form submit
- [ ] Redirect to `/dashboard` on success
- [ ] Display error messages

### Dashboard (`app/dashboard/page.tsx`)
- [x] Create page component
- [ ] Import and use `useDashboard()` hook
- [ ] Fetch data on component mount
- [ ] Display stat cards (leftover, savings rate, stress, freedom years)
- [ ] Render balance projection chart
- [ ] Add "Simulate Decision" button
- [ ] Display insights panel (optional)

### Simulation Modal
- [ ] Create modal component
- [ ] Import and use `useSimulation()` hook
- [ ] Show decision type selector
- [ ] Show conditional input fields
- [ ] Display simulation result with before/after comparison
- [ ] Show AI recommendation

---

## Sample Data for Testing

```typescript
// Healthy financial situation
const testData1 = {
  monthlySalary: 100000,
  rent: 30000,
  monthlyExpenses: 20000,
  currentSavings: 500000,
  debts: 20000,
  city: 'Mumbai',
};

// Tight financial situation
const testData2 = {
  monthlySalary: 50000,
  rent: 25000,
  monthlyExpenses: 20000,
  currentSavings: 50000,
  debts: 10000,
  city: 'Delhi',
};

// Negative cash flow
const testData3 = {
  monthlySalary: 60000,
  rent: 35000,
  monthlyExpenses: 25000,
  currentSavings: 100000,
  debts: 15000,
  city: 'Bangalore',
};
```

---

## Decision Simulation Examples

### Buy a Car
```typescript
await runSimulation('BUY_CAR', {
  cost: 800000,  // Upfront cost
  emi: 15000,    // Monthly EMI
  duration: 60,  // 5 years
});
```

### Move to a New City
```typescript
await runSimulation('MOVE_CITY', {
  rentChange: 5000,  // Increase in rent
  cost: 50000,       // Moving expenses
});
```

### Change Job (Salary Increase)
```typescript
await runSimulation('CHANGE_JOB', {
  salaryChange: 20000,  // Monthly salary increase
});
```

### Buy a Gadget
```typescript
await runSimulation('BUY_GADGET', {
  cost: 50000,  // Cost of gadget
});
```

### Increase Rent
```typescript
await runSimulation('INCREASE_RENT', {
  rentChange: 5000,  // Rent increase per month
});
```

---

## Error Handling

All hooks provide error states. Always display them to users:

```typescript
if (error) {
  return <div className="alert alert-error">{error}</div>;
}
```

Common errors:
- **"User ID not found"**: User hasn't completed onboarding
- **Validation failed**: Invalid input data
- **User not found**: User ID doesn't exist
- **Internal server error**: Backend issue

---

## Performance Tips

1. **Cache dashboard data**: Store fetched data in state to avoid refetching
2. **Debounce form inputs**: Add delay before validation
3. **Lazy load charts**: Load chart library only when needed
4. **Use React.memo**: Prevent unnecessary re-renders of result cards

---

## Browser Storage

User ID is stored in localStorage:

```typescript
// Get user ID
const userId = localStorage.getItem('userId');

// Clear on logout
localStorage.removeItem('userId');

// Or use the utility function
import { getUserId, clearUserSession } from '@/hooks/useAPI';
```

---

## Next Steps

1. Update [OnboardingForm.tsx](../components/Onboarding/OnboardingForm.tsx) with hook
2. Create Dashboard page with dashboard hook
3. Create SimulationModal component
4. Add routing between pages
5. Style components with Tailwind CSS
6. Test with sample data
7. Deploy!

---

## Troubleshooting

### "Cannot find module '@/hooks/useAPI'"
- Ensure `hooks/useAPI.ts` exists
- Check `tsconfig.json` has `@/` alias configured

### API returns 404
- Verify API route file exists in `app/api/*/route.ts`
- Check server is running (`npm run dev`)

### Data not persisting
- In-memory database clears on server restart
- Save user ID to localStorage immediately after onboarding
- For production, implement real database

---

For detailed API documentation, see [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)
