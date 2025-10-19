# Smart Medicine Refill Reminder System

A comprehensive full-stack web application that helps users track their medicines, sends refill reminders automatically, and provides quick access to online pharmacy reordering.

## 🎯 Project Overview

This system allows users to add their medicines with details such as name, dosage frequency, total quantity, and start date. The system automatically calculates refill dates, tracks remaining doses, and sends email reminders when stock is running low. It provides a user-friendly dashboard to monitor all medicines in real time.

## ✨ Features

### Core Features
- **User Authentication**: Secure signup, login, logout with JWT authentication
- **Medicine Management**: Add, update, delete medicines with automatic refill calculations
- **Real-time Dashboard**: Monitor all medicines with status indicators and progress bars
- **Email Notifications**: Automated daily and weekly reminders for refill dates
- **Pharmacy Integration**: Direct links to 1mg.com for quick medicine reordering
- **Status Tracking**: Visual indicators for OK, Low Stock, and Refill Needed status

### Technical Features
- **RESTful API**: Complete backend API with proper authentication and validation
- **Responsive Design**: Mobile-first responsive UI design
- **Real-time Calculations**: Automatic refill date and remaining dose calculations
- **Scheduled Tasks**: Background scheduler for email reminders
- **Modern Tech Stack**: Java Spring Boot backend + React TypeScript frontend

## 🛠 Tech Stack

### Backend (Java)
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security with JWT authentication
- **Database**: H2 (development) / MySQL (production)
- **Email**: Spring Mail with HTML templates
- **Scheduling**: Spring Scheduler for automated tasks
- **Build Tool**: Maven

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern responsive design
- **Build Tool**: Create React App

### Database
- **Development**: H2 in-memory database
- **Production**: MySQL 8.0+
- **ORM**: JPA/Hibernate

## 📁 Project Structure

```
smart-medicine-refill-system/
├── backend/                    # Java Spring Boot backend
│   ├── src/main/java/
│   │   └── com/medicinerefill/smartmedicine/
│   │       ├── config/         # Security, JWT configuration
│   │       ├── controller/     # REST API controllers
│   │       ├── dto/           # Data Transfer Objects
│   │       ├── model/         # JPA entities
│   │       ├── repository/    # Data access layer
│   │       └── service/       # Business logic services
│   ├── src/main/resources/
│   │   └── application.yml    # Application configuration
│   └── pom.xml               # Maven dependencies
├── frontend/                  # React TypeScript frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Utility functions
│   └── package.json         # NPM dependencies
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Java 17+** - For backend development
- **Node.js 16+** - For frontend development
- **Maven 3.8+** - For backend build
- **Git** - For version control

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

3. **Access H2 Console (Development):**
   - URL: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   
   The frontend will start on `http://localhost:3000`

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the backend directory or set environment variables:

```properties
# Database Configuration (for MySQL production)
DB_URL=jdbc:mysql://localhost:3306/medicine_refill_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Email Configuration
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### Frontend Configuration

Create a `.env` file in the frontend directory:

```properties
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api
```

## 📧 Email Setup

### Gmail Configuration

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → App passwords
   - Select "Other" and create password
3. **Update application.yml:**
   ```yaml
   spring:
     mail:
       username: your-email@gmail.com
       password: your-generated-app-password
   ```

## 🌐 API Endpoints

### Authentication Endpoints
```
POST /api/auth/signup    - Register new user
POST /api/auth/signin    - Login user
POST /api/auth/logout    - Logout user
GET  /api/auth/me        - Get current user
```

### Medicine Endpoints
```
GET    /api/medicines                  - Get all medicines
POST   /api/medicines                  - Create medicine
GET    /api/medicines/{id}             - Get medicine by ID
PUT    /api/medicines/{id}             - Update medicine
DELETE /api/medicines/{id}             - Delete medicine
POST   /api/medicines/{id}/take-dose   - Take a dose
POST   /api/medicines/{id}/refill      - Refill medicine
GET    /api/medicines/dashboard-summary - Get dashboard summary
```

### Notification Endpoints
```
POST /api/notifications/trigger-reminder-check        - Manual reminder trigger
POST /api/notifications/send-immediate-reminder/{id}  - Send immediate reminder
GET  /api/notifications/status                        - Get notification status
```

## 📱 Key Features in Detail

### 1. Medicine Tracking
- Add medicines with name, dosage, quantity, and start date
- Automatic calculation of refill dates based on usage
- Real-time tracking of remaining doses and days left

### 2. Smart Notifications
- **Daily Reminders**: Sent at 9:00 AM for medicines needing refill within 7 days
- **Weekly Summary**: Every Monday at 10:00 AM with upcoming refills
- **HTML Email Templates**: Beautiful, responsive email design
- **Configurable Thresholds**: Set custom low-stock alerts per medicine

### 3. Dashboard Analytics
- Total medicines count
- Status breakdown (OK, Low Stock, Refill Needed)
- Priority-based medicine sorting
- Visual progress indicators

### 4. Pharmacy Integration
- One-click redirect to 1mg.com with medicine name pre-filled
- Quick reordering without manual search

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt hashing for password security
- **CORS Configuration**: Secure cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: JPA/Hibernate query protection

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Production Deployment

### Database Setup (MySQL)
1. Install MySQL 8.0+
2. Create database:
   ```sql
   CREATE DATABASE medicine_refill_db;
   CREATE USER 'medicine_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON medicine_refill_db.* TO 'medicine_user'@'localhost';
   ```

### Backend Deployment
1. Update `application.yml` for production
2. Build JAR file:
   ```bash
   mvn clean package
   ```
3. Run production build:
   ```bash
   java -jar target/smart-medicine-backend-1.0.0.jar
   ```

### Frontend Deployment
1. Build production bundle:
   ```bash
   npm run build
   ```
2. Deploy `build/` directory to web server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check Java version (17+ required)
- Verify Maven installation
- Check port 8080 availability

**Email notifications not working:**
- Verify Gmail app password setup
- Check email configuration in application.yml
- Ensure 2FA is enabled on Gmail

**Frontend API calls failing:**
- Verify backend is running on port 8080
- Check CORS configuration
- Confirm proxy setting in package.json

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**Built with ❤️ for better health management**