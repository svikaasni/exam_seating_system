# 🎓 Exam Seating Arrangement System

An automated, intelligent Exam Seating Arrangement and Management System built with **Spring Boot**, **React**, and **MySQL**. It optimizes student hall allocations to minimize malpractice (e.g., preventing students from the same department/course from sitting next to each other), generates printable PDF seating charts, and dispatches automated notifications via **Email** and **WhatsApp**.

---

## 🚀 Key Features

* **⚡ Smart Seating Allocation:** Automatically distributes students across exam halls and seats using customizable anti-clustering logic.
* **👥 Multi-Role Authentication:** Role-based access control (Admin, Staff, Student) powered by **Spring Security** and **Google OAuth 2.0**.
* **📂 Bulk Student Excel Upload:** Fast import of student records from `.xlsx` / `.xls` spreadsheets with automatic duplicate handling.
* **📄 Automated PDF Seating Charts:** Generates formatted, printable PDF seating arrangement charts on-demand using **iText PDF**.
* **📲 Multi-Channel Notifications:**
  * **Email Alerts:** Automated email notifications sent upon seat allocation.
  * **WhatsApp Messages:** Real-time exam and seat notifications via **Twilio API**.
  * **Background Reminders:** Scheduled daemon that checks for upcoming exams within 1 hour and sends automated reminders.
* **📊 Analytics Dashboard:** Overview of total allocations run, emails dispatched, and PDF seating plans generated.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, React Router DOM 7, SheetJS (`xlsx`), React Icons |
| **Backend** | Java 21, Spring Boot 3.5, Spring Data JPA, Spring Security |
| **Database** | MySQL |
| **Document Processing**| iText 7 (PDF Generation), Apache POI (Excel Processing) |
| **Communication** | Twilio SDK (WhatsApp / SMS), Spring Mail (SMTP Email) |
| **Build Tools** | Maven Wrapper (`mvnw`), npm |

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
* **Java Development Kit (JDK) 21**
* **Node.js (v18 or higher) & npm**
* **MySQL Server** (running on port `3306`)

---

## 🗄️ Database Setup

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or MySQL CLI).
2. Create the database and tables using the schema below:

```sql
CREATE DATABASE IF NOT EXISTS `exam_seating_system`;
USE `exam_seating_system`;

-- 1. Departments
CREATE TABLE IF NOT EXISTS `department` (
    `department_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `department_name` VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Users
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) DEFAULT NULL,
    `role` VARCHAR(50) NOT NULL,
    `student_id` BIGINT DEFAULT NULL
);

-- 3. Students
CREATE TABLE IF NOT EXISTS `student` (
    `student_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `register_no` VARCHAR(100) DEFAULT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `year` INT DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `department_id` BIGINT DEFAULT NULL,
    FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE SET NULL
);

-- 4. Exams
CREATE TABLE IF NOT EXISTS `exam` (
    `exam_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `exam_name` VARCHAR(255) DEFAULT NULL,
    `course_code` VARCHAR(50) DEFAULT NULL,
    `exam_date_time` DATETIME DEFAULT NULL
);

-- 5. Exam Halls
CREATE TABLE IF NOT EXISTS `exam_hall` (
    `hall_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `hall_name` VARCHAR(255) DEFAULT NULL,
    `hall_code` VARCHAR(50) DEFAULT NULL,
    `capacity` INT NOT NULL DEFAULT 0
);

-- 6. Seats
CREATE TABLE IF NOT EXISTS `seat` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `seat_number` VARCHAR(50) NOT NULL,
    `exam_hall_id` BIGINT NOT NULL,
    UNIQUE (`seat_number`, `exam_hall_id`),
    FOREIGN KEY (`exam_hall_id`) REFERENCES `exam_hall` (`hall_id`) ON DELETE CASCADE
);

-- 7. Seat Allocations
CREATE TABLE IF NOT EXISTS `seat_allocation` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `exam_hall_id` BIGINT NOT NULL,
    `exam_id` BIGINT NOT NULL,
    `seat_number` INT NOT NULL,
    `seat_code` VARCHAR(20) NOT NULL,
    `course_code` VARCHAR(50) DEFAULT NULL,
    `exam_time` DATETIME DEFAULT NULL,
    UNIQUE (`student_id`, `exam_id`),
    UNIQUE (`exam_hall_id`, `seat_number`, `exam_id`),
    FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
    FOREIGN KEY (`exam_hall_id`) REFERENCES `exam_hall` (`hall_id`) ON DELETE CASCADE,
    FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`) ON DELETE CASCADE
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS `notification` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_email` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `message` TEXT DEFAULT NULL,
    `sent` BOOLEAN NOT NULL DEFAULT FALSE,
    `status` VARCHAR(50) DEFAULT NULL,
    `sent_time` DATETIME DEFAULT NULL
);

-- 9. Dashboard Stats
CREATE TABLE IF NOT EXISTS `dashboard_stats` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `allocations_run` BIGINT DEFAULT 0,
    `emails_sent` BIGINT DEFAULT 0,
    `pdf_generated` BIGINT DEFAULT 0
);

-- Initial Stats & Admin Seed Data (Default Password: admin123)
INSERT IGNORE INTO `dashboard_stats` (`id`, `allocations_run`, `emails_sent`, `pdf_generated`) VALUES (1, 0, 0, 0);

INSERT IGNORE INTO `users` (`username`, `password`, `role`) VALUES
('admin', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWGYEi', 'ADMIN'),
('staff', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWGYEi', 'STAFF');

-- Sample Departments & Exam Halls
INSERT IGNORE INTO `department` (`department_name`) VALUES
('Computer Science and Engineering'),
('Information Technology'),
('Electronics and Communication Engineering'),
('Mechanical Engineering');

INSERT IGNORE INTO `exam_hall` (`hall_name`, `hall_code`, `capacity`) VALUES
('Main Block Hall 1', 'C1-01', 30),
('Main Block Hall 2', 'C1-02', 30),
('Science Block Hall', 'S2-05', 40);
```

---

## ⚙️ Configuration

In `backend/src/main/resources/application-local.properties`, configure your local database and credentials:

```properties
# MySQL Connection
spring.datasource.url=jdbc:mysql://localhost:3306/exam_seating_system
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Mail (Optional - for Email alerts)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_GMAIL_APP_PASSWORD

# Twilio (Optional - for WhatsApp alerts)
twilio.account.sid=YOUR_TWILIO_ACCOUNT_SID
twilio.auth.token=YOUR_TWILIO_AUTH_TOKEN
twilio.whatsapp.from=whatsapp:+14155238886
```

---

## 🏃 Getting Started

### 1. Run the Backend (Spring Boot)
Open a terminal in the `backend` folder:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```
* Backend starts at: **`http://localhost:8080`**

### 2. Run the Frontend (React)
Open a separate terminal in the `frontend` folder:
```bash
npm install
npm start
```
* Frontend starts at: **`http://localhost:3000`**

---

## 📑 Excel Upload Format

When importing students via the **Upload Students** screen, prepare your `.xlsx` or `.xls` file with the following headers:

| registerNo | name | email | year | department | phone |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 21CS001 | Aarav Sharma | aarav.sharma@example.com | 3 | Computer Science and Engineering | 9876543210 |
| 21IT001 | Priya Nair | priya.nair@example.com | 3 | Information Technology | 9876543211 |
| 21EC001 | Rahul Das | rahul.das@example.com | 2 | Electronics and Communication Engineering | 9876543212 |

---

## 🔐 Default Credentials

| Username | Password | Role |
| :--- | :--- | :--- |
| `admin` | `admin123` | **ADMIN** (Full Access) |
| `staff` | `admin123` | **STAFF** (Read-Only) |

---

## 📂 Project Structure

```text
exam-seating-system/
├── backend/
│   ├── src/main/java/com/college/exam/seating/system/
│   │   ├── config/          # Spring Security & CORS Configuration
│   │   ├── controller/      # REST API Controllers (Auth, Student, Allocation, PDF, etc.)
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Database Entities
│   │   ├── repository/      # Spring Data Repositories
│   │   ├── scheduler/       # Automated Background Tasks
│   │   └── service/         # Business Logic & Allocation Algorithms
│   └── src/main/resources/  # application.properties & static assets
│
└── frontend/
    ├── public/              # Static HTML & icons
    └── src/
        ├── components/      # UI Components (Sidebar, Topbar, Forms)
        ├── pages/           # Views (Dashboard, Allocation, Students, PDF, Notifications)
        └── services/        # Backend API service integrations
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
