# Testing Guide - Smart Medicine Refill System

This document provides comprehensive instructions for testing the Smart Medicine Refill System.

## 🧪 Testing Overview

The system includes multiple layers of testing:
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Complete user flow testing
- **Manual Testing**: User interface and workflow testing

## 🚀 Quick Testing Setup

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
Backend will be available at: `http://localhost:8080`

### 2. Access H2 Database Console (Development)
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

### 3. Start the Frontend (if available)
```bash
cd frontend
npm start
```
Frontend will be available at: `http://localhost:3000`

## 📡 API Testing with Postman/Curl

### Authentication Endpoints

#### 1. User Registration
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

#### 2. User Login
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### 3. Get Current User
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Logout
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Medicine Management Endpoints

**Note**: All medicine endpoints require authentication. Include the JWT token in the Authorization header.

#### 1. Create Medicine
```bash
curl -X POST http://localhost:8080/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicineName": "Aspirin 81mg",
    "dosagePerDay": 1,
    "totalQuantity": 30,
    "startDate": "2024-12-01",
    "currentQuantity": 15,
    "notificationsEnabled": true,
    "lowStockThreshold": 5
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "medicineName": "Aspirin 81mg",
  "dosagePerDay": 1,
  "totalQuantity": 30,
  "startDate": "2024-12-01",
  "refillDate": "2024-12-16",
  "currentQuantity": 15,
  "notificationsEnabled": true,
  "lowStockThreshold": 5,
  "status": "OK",
  "daysLeft": 15,
  "remainingDoses": 15,
  "refillUrl": "https://www.1mg.com/search/all?name=Aspirin%2081mg"
}
```

#### 2. Get All Medicines
```bash
curl -X GET http://localhost:8080/api/medicines \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. Get Medicine by ID
```bash
curl -X GET http://localhost:8080/api/medicines/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Update Medicine
```bash
curl -X PUT http://localhost:8080/api/medicines/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicineName": "Aspirin 81mg Updated",
    "dosagePerDay": 1,
    "totalQuantity": 30,
    "startDate": "2024-12-01",
    "currentQuantity": 10
  }'
```

#### 5. Take a Dose
```bash
curl -X POST http://localhost:8080/api/medicines/1/take-dose \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 6. Refill Medicine
```bash
curl -X POST "http://localhost:8080/api/medicines/1/refill?quantity=30" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 7. Get Medicines by Status
```bash
curl -X GET http://localhost:8080/api/medicines/status/LOW \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 8. Get Dashboard Summary
```bash
curl -X GET http://localhost:8080/api/medicines/dashboard-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 9. Delete Medicine
```bash
curl -X DELETE http://localhost:8080/api/medicines/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Notification Endpoints

#### 1. Trigger Manual Reminder Check
```bash
curl -X POST http://localhost:8080/api/notifications/trigger-reminder-check \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 2. Send Immediate Reminder
```bash
curl -X POST http://localhost:8080/api/notifications/send-immediate-reminder/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. Get Notification Status
```bash
curl -X GET http://localhost:8080/api/notifications/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Unit Testing

### Backend Unit Tests
```bash
cd backend
mvn test
```

### Running Specific Test Classes
```bash
# Test controllers
mvn test -Dtest=AuthControllerTest

# Test services
mvn test -Dtest=EmailServiceTest

# Test repositories
mvn test -Dtest=MedicineRepositoryTest
```

### Frontend Unit Tests (when React components are created)
```bash
cd frontend
npm test
```

## 🔄 Integration Testing Scenarios

### Scenario 1: Complete User Registration and Medicine Management
1. Register a new user
2. Login with the user credentials
3. Create multiple medicines with different statuses
4. Update medicine quantities
5. Take doses and verify calculations
6. Refill medicines
7. Get dashboard summary
8. Logout

### Scenario 2: Notification System Testing
1. Create medicines with low stock (current quantity < threshold)
2. Create medicines with refill date within 7 days
3. Trigger manual reminder check
4. Verify email notifications (check logs)
5. Send immediate reminders

### Scenario 3: Medicine Status Calculations
1. Create medicine with high stock → Status should be "OK"
2. Reduce quantity to threshold level → Status should be "LOW"
3. Reduce quantity to 0 → Status should be "REFILL_NEEDED"
4. Verify days left calculation
5. Verify refill date calculation

## 🐛 Error Testing

### Authentication Errors
```bash
# Test invalid login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid@example.com", "password": "wrong"}'

# Test duplicate email registration
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "existing@example.com", "password": "password"}'

# Test accessing protected endpoint without token
curl -X GET http://localhost:8080/api/medicines
```

### Validation Errors
```bash
# Test invalid medicine data
curl -X POST http://localhost:8080/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicineName": "",
    "dosagePerDay": -1,
    "totalQuantity": 0,
    "startDate": "invalid-date"
  }'
```

### Resource Not Found Errors
```bash
# Test getting non-existent medicine
curl -X GET http://localhost:8080/api/medicines/99999 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test updating non-existent medicine
curl -X PUT http://localhost:8080/api/medicines/99999 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"medicineName": "Test"}'
```

## 📊 Performance Testing

### Load Testing with curl
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl -X GET http://localhost:8080/api/medicines \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" &
done
wait
```

### Database Performance
1. Create multiple users (100+)
2. Create multiple medicines per user (50+ each)
3. Test query performance for dashboard summary
4. Test notification query performance

## 🔍 Manual Testing Checklist

### User Interface Testing
- [ ] User registration form validation
- [ ] Login form functionality
- [ ] Dashboard displays correct medicine counts
- [ ] Medicine cards show correct status colors
- [ ] Progress bars display accurate percentages
- [ ] Refill buttons redirect to pharmacy website
- [ ] Add/Edit medicine forms work correctly
- [ ] Responsive design on mobile devices

### Workflow Testing
- [ ] Complete user journey from registration to medicine management
- [ ] Email notifications are received (check spam folder)
- [ ] Medicine status updates automatically
- [ ] Dose tracking works correctly
- [ ] Refill functionality updates quantities
- [ ] Search and filtering work properly

### Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 📧 Email Testing

### Email Configuration Testing
1. Configure email settings in `application.yml`
2. Create medicine with refill date tomorrow
3. Trigger manual reminder check
4. Check application logs for email sending confirmation
5. Check email inbox for received notification

### Email Template Testing
1. Test single medicine reminder email
2. Test multiple medicines reminder email
3. Test weekly summary email
4. Verify HTML rendering in different email clients

## 🚨 Security Testing

### JWT Token Testing
```bash
# Test expired token (manually set expired token)
curl -X GET http://localhost:8080/api/medicines \
  -H "Authorization: Bearer EXPIRED_TOKEN"

# Test malformed token
curl -X GET http://localhost:8080/api/medicines \
  -H "Authorization: Bearer invalid.token.here"

# Test missing token
curl -X GET http://localhost:8080/api/medicines
```

### Authorization Testing
1. Create user A and user B
2. User A creates medicines
3. Try to access User A's medicines with User B's token
4. Verify proper 403/404 responses

## 📈 Test Data Generation

### Creating Test Users
```bash
# Create multiple test users
for i in {1..5}; do
  curl -X POST http://localhost:8080/api/auth/signup \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Test User $i\", \"email\": \"user$i@test.com\", \"password\": \"password123\"}"
done
```

### Creating Test Medicines with Different Statuses

```bash
# Medicine with OK status (high stock)
curl -X POST http://localhost:8080/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicineName": "Medicine OK Status",
    "dosagePerDay": 1,
    "totalQuantity": 30,
    "startDate": "2024-12-01",
    "currentQuantity": 25
  }'

# Medicine with LOW status (low stock)
curl -X POST http://localhost:8080/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicineName": "Medicine LOW Status",
    "dosagePerDay": 1,
    "totalQuantity": 30,
    "startDate": "2024-12-01",
    "currentQuantity": 3
  }'

# Medicine with REFILL_NEEDED status (no stock)
curl -X POST http://localhost:8080/api/medicines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicineName": "Medicine REFILL NEEDED",
    "dosagePerDay": 1,
    "totalQuantity": 30,
    "startDate": "2024-12-01",
    "currentQuantity": 0
  }'
```

## 🔧 Troubleshooting Common Test Issues

### Backend Issues
- **Port 8080 already in use**: Kill existing processes or use different port
- **Database connection errors**: Verify H2 console access
- **JWT token issues**: Check token expiration and format
- **Email sending fails**: Verify SMTP configuration

### Frontend Issues
- **API calls failing**: Check backend is running and CORS configuration
- **Authentication not working**: Verify JWT token storage and headers
- **Responsive design issues**: Test on different screen sizes

### Database Issues
- **Tables not created**: Check JPA configuration and entity annotations
- **Data not persisting**: Verify transaction management
- **Query performance**: Check database indexes and query optimization

## 📝 Test Reports

After running tests, generate reports:

### Backend Test Report
```bash
cd backend
mvn test
# Check target/surefire-reports/ for detailed results
```

### Coverage Report
```bash
cd backend
mvn jacoco:report
# Open target/site/jacoco/index.html for coverage report
```

---

**Happy Testing! 🎉**