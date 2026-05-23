#Deployment Link


https://tool-managemnt.vercel.app

# Tool Management System 🛠️

A comprehensive full-stack application for managing cutting tools, orders, and usage tracking across multiple shops with role-based access control.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Workflow](#project-workflow)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [User Roles & Permissions](#user-roles--permissions)
- [Contributing](#contributing)
- [License](#license)

## 📖 Project Overview

The Tool Management System is designed to streamline the management of cutting tools across multiple operational zones and shops. It provides real-time tracking, inventory management, usage analytics, and order processing with a role-based access control system.

**Key Capabilities:**
- Multi-shop tool inventory management
- Real-time usage tracking and analytics
- Order creation and management
- Tool request workflow
- Comprehensive dashboards for different user roles
- JWT-based authentication and authorization

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **TypeScript** 5.5.3 - Type safety
- **Vite** 5.4.2 - Build tool
- **TailwindCSS** 3.4.1 - Styling
- **React Router** 6.26.0 - Routing
- **Recharts** 2.8.0 - Data visualization
- **Lucide React** 0.344.0 - Icons
- **Framer Motion** 12.23.12 - Animations
- **Socket.io Client** 4.7.4 - Real-time communication

### Backend
- **Node.js** with **Express.js** 4.18.2 - Server framework
- **MongoDB** with **Mongoose** 8.0.0 - Database
- **Socket.io** 4.7.4 - Real-time updates
- **JWT** 9.0.2 - Authentication
- **bcryptjs** 2.4.3 - Password hashing
- **CORS** 2.8.5 - Cross-origin requests
- **Dotenv** 16.3.1 - Environment variables

### Development Tools
- **Nodemon** 3.0.1 - Auto-restart server
- **Concurrently** 8.2.2 - Run multiple scripts
- **ESLint** 9.9.1 - Code linting
- **PostCSS** 8.4.35 - CSS processing

## 🔄 Project Workflow

### 1. **User Authentication Flow**
```
User Registration/Login
    ↓
Validate credentials
    ↓
Generate JWT token
    ↓
Return token to client
    ↓
Store in localStorage/state
```

### 2. **Tool Management Workflow**
```
Tool Addition (Supervisor/Shopkeeper)
    ↓
Store in database
    ↓
Display on Inventory/Tools List
    ↓
Real-time updates via Socket.io
    ↓
Monitor tool lifecycle (active → low-life → depleted)
```

### 3. **Order Processing Workflow**
```
Supervisor Creates Order
    ↓
Set order details & items
    ↓
Shopkeeper receives notification
    ↓
Shopkeeper updates order status
    ↓
Order tracking & history maintained
```

### 4. **Tool Request Workflow**
```
Operator Submits Tool Request
    ↓
Request stored in database
    ↓
Supervisor reviews requests
    ↓
Approve/Reject decision
    ↓
Notification sent to Operator
```

### 5. **Usage Tracking Workflow**
```
Operator logs tool usage
    ↓
Usage data stored with timestamp
    ↓
Analytics calculated
    ↓
Dashboards display metrics
    ↓
Real-time updates to supervisors
```

### 6. **Dashboard Analytics Workflow**
```
Data aggregation from multiple sources
    ↓
Calculate KPIs & statistics
    ↓
Generate visualizations (charts/graphs)
    ↓
Display role-specific dashboards
    ↓
Real-time refresh via Socket.io
```

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password encryption with bcryptjs
- ✅ Company-based user grouping
- ✅ Automatic token validation

### Tool Management
- ✅ Add/edit/delete tools
- ✅ Track tool lifecycle
- ✅ Low-life tool alerts
- ✅ Tool inventory management
- ✅ Real-time tool status updates

### Order Processing
- ✅ Create and manage orders
- ✅ Order status tracking
- ✅ Order history and analytics
- ✅ Bulk order operations
- ✅ Status notifications

### Usage Analytics
- ✅ Log tool usage
- ✅ Generate usage reports
- ✅ Supervisor analytics dashboard
- ✅ Usage trend visualization
- ✅ Export usage data (CSV)

### Tool Requests
- ✅ Submit tool requests (Operator)
- ✅ Review requests (Supervisor)
- ✅ Approval/rejection workflow
- ✅ Request history tracking

### Real-time Features
- ✅ Socket.io integration for live updates
- ✅ Real-time notifications
- ✅ Live dashboard refresh
- ✅ Concurrent user support

### Dashboards
- ✅ **Operator Dashboard**: View assigned tools, submit requests, log usage
- ✅ **Shopkeeper Dashboard**: Manage inventory, update orders, track tools
- ✅ **Supervisor Dashboard**: Monitor all operations, analytics, approvals

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Clone Repository
```bash
git clone <repository-url>
cd Tool_managemnt
cd project
```

### Install Dependencies
```bash
# Install root dependencies
npm install

# Dependencies are shared for both frontend and backend
```

### Environment Configuration

Create a `.env` file in the `project` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Client Configuration
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000

# Deployment URL (optional)
DEPLOYED_URL=https://tool-managemnt.onrender.com
```

## 🏃 Running the Application

### Development Mode (Concurrent Server + Client)
```bash
npm run dev
```
This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Production Build
```bash
npm run build
```

### Client Only (Vite Dev Server)
```bash
npm run client
```

### Server Only (Nodemon)
```bash
npm run server
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## 📂 Project Structure

```
Tool_managemnt/
├── project/
│   ├── backend/                      # Express.js server
│   │   ├── server.js                # Main server file
│   │   ├── middleware/               # Custom middleware
│   │   │   └── auth.js              # JWT authentication
│   │   ├── models/                  # MongoDB schemas
│   │   │   ├── User.js              # User model
│   │   │   ├── Tool.js              # Tool model
│   │   │   ├── Order.js             # Order model
│   │   │   ├── Usage.js             # Usage tracking model
│   │   │   └── ToolRequest.js       # Tool request model
│   │   └── routes/                  # API endpoints
│   │       ├── auth.js              # Authentication routes
│   │       ├── tools.js             # Tool management
│   │       ├── orders.js            # Order management
│   │       ├── usage.js             # Usage tracking
│   │       ├── toolRequests.js      # Tool requests
│   │       └── dashboard.js         # Dashboard data
│   │
│   ├── src/                         # React frontend
│   │   ├── App.tsx                  # Main App component
│   │   ├── main.tsx                 # Entry point
│   │   ├── index.css                # Global styles
│   │   ├── components/              # Reusable components
│   │   │   ├── auth/                # Login/Register
│   │   │   ├── dashboards/          # Role-specific dashboards
│   │   │   ├── tools/               # Tool management UI
│   │   │   ├── orders/              # Order management UI
│   │   │   ├── usage/               # Usage tracking UI
│   │   │   ├── shops/               # Shop management
│   │   │   ├── charts/              # Data visualization
│   │   │   ├── common/              # Shared components
│   │   │   └── layout/              # Layout components
│   │   └── contexts/                # React contexts
│   │       ├── AuthContext.jsx      # Authentication state
│   │       └── NotificationContext.jsx # Notifications
│   │
│   ├── package.json                 # Dependencies
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   ├── eslint.config.js             # ESLint config
│   └── index.html                   # HTML entry point
│
└── README.md                        # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/companies` - Get all companies
- `GET /api/auth/supervisors/:companyName` - Get supervisors by company
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Tools Management
- `GET /api/tools` - Get all tools
- `GET /api/tools/low-life` - Get low-life tools
- `POST /api/tools` - Create tool
- `PUT /api/tools/:id` - Update tool
- `DELETE /api/tools/:id` - Delete tool

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/:id` - Get specific order

### Usage Tracking
- `GET /api/usage` - Get all usage records
- `GET /api/usage/analytics` - Get usage analytics
- `GET /api/usage/supervisor-analytics` - Supervisor analytics
- `POST /api/usage` - Log tool usage

### Tool Requests
- `POST /api/tool-requests/request` - Submit tool request
- `GET /api/tool-requests/requests` - Get all requests

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 📊 Database Models

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (supervisor | shopkeeper | operator),
  company: String,
  shop: ObjectId (for shopkeepers),
  zone: ObjectId (for operators),
  createdAt: Date,
  updatedAt: Date
}
```

### Tool
```javascript
{
  name: String,
  serialNumber: String (unique),
  category: String,
  status: String (active | low-life | depleted),
  lifespan: Number (in days),
  purchaseDate: Date,
  lastUsed: Date,
  owner: ObjectId (User),
  shop: ObjectId (Shop),
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  orderNumber: String (unique),
  items: Array,
  status: String (pending | processing | completed),
  supervisor: ObjectId (User),
  shopkeeper: ObjectId (User),
  createdAt: Date,
  completedAt: Date,
  updatedAt: Date
}
```

### Usage
```javascript
{
  tool: ObjectId (Tool),
  user: ObjectId (User),
  usageDuration: Number (minutes),
  timestamp: Date,
  notes: String,
  shop: ObjectId (Shop),
  createdAt: Date
}
```

### ToolRequest
```javascript
{
  tool: String,
  description: String,
  status: String (pending | approved | rejected),
  operator: ObjectId (User),
  supervisor: ObjectId (User),
  requestDate: Date,
  responseDate: Date,
  createdAt: Date
}
```

## 👥 User Roles & Permissions

### Supervisor
- ✅ View all tools and inventory
- ✅ Create and manage orders
- ✅ Review tool requests
- ✅ Access comprehensive analytics dashboard
- ✅ Monitor all operations
- ✅ Generate reports
- ❌ Cannot directly manage shops

### Shopkeeper
- ✅ Manage shop-specific tools
- ✅ Update order status
- ✅ Track tool lifecycle
- ✅ View shop analytics
- ✅ Update tool information
- ❌ Cannot create orders (supervisor only)
- ❌ Cannot access supervisor analytics

### Operator
- ✅ View assigned tools
- ✅ Log tool usage
- ✅ Submit tool requests
- ✅ View personal usage history
- ✅ Access operator dashboard
- ❌ Cannot create orders
- ❌ Cannot manage inventory
- ❌ Cannot approve requests

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Request validation with express-validator
- Role-based access control middleware
- Secure credential handling
- Protected routes

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, email support@toolmanagement.com or open an issue in the repository.

## 🔗 Deployment

The application is configured for deployment on:
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, Render, Railway, or any Node.js hosting
- **Database**: MongoDB Atlas

Current deployment URL: `https://tool-managemnt.onrender.com`

---

**Last Updated**: May 23, 2026  
**Version**: 1.0.0  
**Status**: Active Development
