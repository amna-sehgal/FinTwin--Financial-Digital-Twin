# FinTwin Backend Documentation

## Overview

The FinTwin backend is built with **Next.js 14** and provides a complete financial simulation and analysis system. It handles user onboarding, financial metrics calculation, decision simulation, and AI-powered insights.

---

## Project Structure

```
backend/
├── lib/
│   ├── calculations.ts    # Financial calculation logic
│   ├── database.ts        # In-memory database
│   └── validation.ts      # Input validation
├── types/
│   └── index.ts           # TypeScript interfaces
└── README.md

app/api/
├── onboarding/
│   └── route.ts           # User onboarding API
├── dashboard/
│   └── route.ts           # Dashboard metrics API
├── simulate/
│   └── route.ts           # Decision simulation API
└── insights/
    └── route.ts           # AI insights API
```

---

## API Endpoints

### 1. **Onboarding** - `POST /api/onboarding`

Creates a new user profile with financial data.

**Request Body:**
```json
{
  "monthlySalary": 75000,
  "rent": 20000,
  "monthlyExpenses": 15000,
  "currentSavings": 200000,
  "debts": 50000,
  "city": "Mumbai"
}
```

**Fields:**
- `monthlySalary` (number, required): Monthly gross income
- `rent` (number, required): Monthly rent/housing
- `monthlyExpenses` (number, required): Monthly expenses
- `currentSavings` (number, required): Current savings balance
- `debts` (number, required): Monthly EMI or debt obligations
- `city` (string, optional): City of residence

**Response (201):**
```json
{
  "success": true,
  "userId": "user_1708309261449_abc12def",
  "data": {
    "id": "user_1708309261449_abc12def",
    "monthlySalary": 75000,
    "rent": 20000,
    "monthlyExpenses": 15000,
    "currentSavings": 200000,
    "debts": 50000,
    "city": "Mumbai",
    "createdAt": "2024-02-18T10:00:00Z",
    "updatedAt": "2024-02-18T10:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "monthlySalary",
      "message": "Monthly salary is required and must be a number"
    }
  ]
}
```

---

### 2. **Get Onboarding Data** - `GET /api/onboarding?userId=<userId>`

Retrieves saved onboarding data for a user.

**Query Parameters:**
- `userId` (string, required): User ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_1708309261449_abc12def",
    "monthlySalary": 75000,
    "rent": 20000,
    "monthlyExpenses": 15000,
    "currentSavings": 200000,
    "debts": 50000,
    "city": "Mumbai",
    "createdAt": "2024-02-18T10:00:00Z",
    "updatedAt": "2024-02-18T10:00:00Z"
  }
}
```

---

### 3. **Dashboard Metrics** - `GET /api/dashboard?userId=<userId>`

Gets calculated financial metrics and 12-month projections.

**Query Parameters:**
- `userId` (string, required): User ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userData": { ...user data... },
    "metrics": {
      "monthlyLeftover": -10000,
      "savingsRate": -13.33,
      "stressScore": 73,
      "freedomYears": 999,
      "projectedBalance": [
        {
          "month": 1,
          "balance": 190000,
          "date": "2024-03-18"
        },
        {
          "month": 2,
          "balance": 180000,
          "date": "2024-04-18"
        }
        // ... 10 more months
      ]
    }
  }
}
```

**Metrics Explanation:**
- `monthlyLeftover`: Salary - Rent - Expenses - Debts. Negative means spending more than earning.
- `savingsRate`: Percentage of salary that can be saved monthly.
- `stressScore`: 0-100 scale. Higher = more financial stress.
- `freedomYears`: Years to achieve financial independence (25x annual expenses).
- `projectedBalance`: 12-month balance projection for graphing.

---

### 4. **Simulate Decision** - `POST /api/simulate`

Simulates the financial impact of a major decision.

**Request Body:**
```json
{
  "userId": "user_1708309261449_abc12def",
  "decisionType": "BUY_CAR",
  "cost": 800000,
  "emi": 15000,
  "duration": 60
}
```

**Decision Types & Required Fields:**

#### `BUY_CAR`
- `cost` (number, required): Car cost (upfront)
- `emi` (number, optional): Monthly EMI
- `duration` (number, optional): EMI duration in months

#### `BUY_GADGET`
- `cost` (number, required): Gadget cost

#### `MOVE_CITY`
- `rentChange` (number, required): Change in monthly rent
- `cost` (number, optional): Moving expenses

#### `CHANGE_JOB`
- `salaryChange` (number, required): Change in monthly salary

#### `INCREASE_RENT`
- `rentChange` (number, required): Change in monthly rent

**Response (200):**
```json
{
  "success": true,
  "data": {
    "decision": "BUY_CAR",
    "originalMetrics": {
      "monthlyLeftover": -10000,
      "savingsRate": -13.33,
      "stressScore": 73,
      "freedomYears": 999,
      "projectedBalance": [...]
    },
    "newMetrics": {
      "monthlyLeftover": -25000,
      "savingsRate": -33.33,
      "stressScore": 95,
      "freedomYears": 999,
      "projectedBalance": [...]
    },
    "impact": {
      "monthlyLeftoverChange": -15000,
      "savingsRateChange": -20,
      "stressScoreChange": 22,
      "freedomYearsChange": 0
    },
    "recommendation": "Buying a car will significantly increase your financial stress (95/100). Consider waiting or finding alternatives."
  }
}
```

---

### 5. **AI Insights** - `GET /api/insights?userId=<userId>`

Generates AI-powered insights based on financial data.

**Query Parameters:**
- `userId` (string, required): User ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "status": "critical",
        "message": "Your financial stress level is critically high",
        "suggestion": "Consider negotiating a salary increase, reducing expenses, or seeking financial counseling."
      },
      {
        "status": "warning",
        "message": "You are spending more than you earn",
        "suggestion": "Create a budget immediately and identify areas to cut expenses or increase income."
      }
    ],
    "metrics": {
      "monthlyLeftover": -10000,
      "savingsRate": -13.33,
      "stressScore": 73,
      "freedomYears": 999,
      "projectedBalance": [...]
    }
  }
}
```

---

## Core Calculations

### Monthly Leftover
```
Monthly Leftover = Salary - Rent - Expenses - Debts
```

### Savings Rate
```
Savings Rate (%) = (Monthly Leftover / Salary) × 100
```

### Stress Score
The stress score is calculated based on:
1. **Debt-to-Income Ratio**: Higher debt increases stress
2. **Monthly Leftover**: Negative or low leftover increases stress
3. **Score Range**: 0 (no stress) to 100 (critical stress)

### Freedom Years (Financial Independence)
```
Target Savings = 25 × Annual Expenses (4% rule)
Years to FI = (Target - Current Savings) / Annual Leftover
```

### 12-Month Balance Projection
Projects future balance assuming constant monthly leftover:
```
Balance_month = Current Savings + (Monthly Leftover × month)
```

---

## Validation Rules

### Onboarding Validation
- All numeric fields must be non-negative
- Salary is required and must be > 0
- Expenses exceeding income by >50% trigger a warning

### Simulation Validation
- Valid decision types: BUY_CAR, BUY_GADGET, MOVE_CITY, CHANGE_JOB, INCREASE_RENT
- Required fields depend on decision type
- Numeric fields must be valid numbers

---

## Error Handling

All endpoints return consistent error responses:

**400 Bad Request** - Validation error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

**404 Not Found** - User doesn't exist:
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error** - Server error:
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Data Persistence

### Current Implementation
Uses **in-memory database** (`backend/lib/database.ts`). Data is stored during the session but lost on server restart.

### Production Migration
For production, migrate to:
- **PostgreSQL** with Prisma ORM
- **MongoDB** with Mongoose
- **Firebase** for real-time features

**Migration Steps:**
1. Replace functions in `database.ts`
2. Use ORM models instead of in-memory maps
3. Add database connection pooling
4. Implement error handling for DB failures

---

## Usage Examples

### Frontend Integration

```typescript
// Onboarding
const response = await fetch('/api/onboarding', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    monthlySalary: 75000,
    rent: 20000,
    monthlyExpenses: 15000,
    currentSavings: 200000,
    debts: 50000,
  }),
});
const { userId } = await response.json();
localStorage.setItem('userId', userId);

// Dashboard
const dashResponse = await fetch(`/api/dashboard?userId=${userId}`);
const dashData = await dashResponse.json();

// Simulation
const simResponse = await fetch('/api/simulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId,
    decisionType: 'BUY_CAR',
    cost: 800000,
    emi: 15000,
  }),
});
const result = await simResponse.json();
```

---

## Testing

### Test Data
```javascript
const testUser = {
  monthlySalary: 100000,
  rent: 30000,
  monthlyExpenses: 20000,
  currentSavings: 500000,
  debts: 20000,
};

// Monthly leftover: 100k - 30k - 20k - 20k = 30k
// Savings rate: 30k / 100k = 30%
// Stress score: Low (around 20)
// Freedom years: ~20 years
```

---

## Future Enhancements

1. ✅ User authentication (JWT/OAuth)
2. ✅ Real database integration
3. ✅ Advanced AI insights (ML-based)
4. ✅ Investment recommendations
5. ✅ Multi-scenario comparisons
6. ✅ Export reports (PDF)
7. ✅ Historical data tracking
8. ✅ Goal setting and tracking

---

## Environment Variables

No additional environment variables needed for MVP. For production:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
NODE_ENV=production
```

---

## Support

For issues or questions, refer to the main README.md or create an issue in the repository.
