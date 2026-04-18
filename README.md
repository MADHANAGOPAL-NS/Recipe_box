# 🍲 RecipeBox

> **A Collaborative Recipe Sharing Platform (Instagram for Foodies)**

## 📖 Project Overview

RecipeBox is a full-stack MERN application designed for food enthusiasts. It allows users to actively create, discover, and share their favorite recipes with a community. Beyond just a recipe repository, RecipeBox incorporates interactive social features—like personalized feeds, following other chefs, comments, and ratings—alongside practical utilities like a personal Cookbook and a handy Meal Planner. Whether you're hunting for a quick weeknight dinner or aiming to build a massive following for your culinary creations, RecipeBox offers an immersive and delightful experience.

## ✨ Features

### 🔐 Authentication & Accounts
- **Secure Login/Registration:** Fully authenticated user sessions powered by JSON Web Tokens (JWT).

### 🍳 Recipe Management (CRUD)
- **Comprehensive Recipe Creation:** Add recipes with structured data, including required ingredients, step-by-step instructions, and categorical tags.
- **Image Uploading:** Seamless image processing and storage leveraging Cloudinary for fast, reliable media delivery.

### 🔍 Advanced Search & Discovery
- **Title Search:** Quickly find recipes by their name.
- **Ingredient Filtering:** Include what you have in the fridge, or exclude what you're allergic to.
- **Time-Based Filtering:** Find meals that fit your schedule by filtering by cook time.

### 🤝 Social Features
- **Follow System:** Follow (and unfollow) your favorite recipe creators.
- **Personalized Feed:** Explore a dynamic, tailored feed featuring the latest posts from users you follow.
- **Interactive Community:** Review recipes using a 1–5 star rating system (with computed averages) and leave comments to share tips or feedback.

### 🍱 Utilities
- **The Cookbook:** Save your favorite discoveries and easily jump back into them whenever you need.
- **Meal Planner:** Organize your week by assigning your saved recipes to specific dates.
- **Mobile-Friendly:** A sleek, responsive design ensuring a premium experience on both desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express.js

**Database & Storage:**
- MongoDB (Mongoose)
- Cloudinary (Image Hosting)

**Security:**
- JWT (JSON Web Tokens)
- bcrypt.js (Password Hashing)

## 🌐 API Examples

Here are some sample endpoints you'll find within the RecipeBox API:

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate a user and receive a JWT

### Recipes
- `GET /api/recipes` - Get a paginated list of recipes
- `GET /api/recipes?search=chicken&time=30&ingredients=rice&exclude=onion` - Advanced search and filtering by time and ingredients
- `POST /api/recipes` - Create a new recipe (requires auth)
- `PUT /api/recipes/:id` - Update an existing recipe (requires auth & ownership)

### Social & Utilities
- `POST /api/users/:id/follow` - Follow a user (requires auth)
- `POST /api/recipes/:id/save` - Save a recipe to Cookbook (requires auth)
- `GET /api/planner` - Get saved meals organized by date (requires auth)

## ⚙️ Installation & Setup

If you wish to run the project locally, follow these steps:

### Prerequisites
- Node.js installed on your machine
- A MongoDB cluster (Atlas) or local MongoDB instance
- A Cloudinary account for managing recipe image uploads

### 1. Clone the Repository
```bash
git clone https://github.com/MADHANAGOPAL-NS/Recipe_box.git
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm start
```

## 🔐 Environment Variables

Create a `.env` file in the **backend** directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```


## 🚀 Live Demo

frontend: https://recipe-box-tawny.vercel.app
backend: https://recipebox-backend-h3x4.onrender.com

## 🧪 Testing

- API testing performed using Postman
- Verified all core features:
  - Authentication
  - Recipe CRUD
  - Feed & Follow system
  - Comments & Ratings
  - Cookbook
  - Meal Planner

## 🧑‍💻 Author

**N S MADHANAGOPAL**

---

