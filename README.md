# Organizimo - a knowledge sharing platform for internal company communication

A full-stack web application built with React (frontend) and Laravel 12 (backend), designed to centralize knowledge, improve collaboration, and streamline problem-solving within an organization. The platform allows employees to create, organize, and search posts by sector, significantly reducing duplicated effort and making it easier to find solutions to recurring issues.

# Overview

Users can register, edit their profiles, and access sectors relevant to their department. Within each sector, users can publish posts (including title, text, images, and file attachments), engage in discussions, save posts, and follow topics of interest. While admins can manage sectors, users, and posts.

A robust search and filtering system ensures quick retrieval of relevant content, helping teams save time and focus on real work.

# Key Features

### Post creation
- Title, text content, images, and attachments (PDF, DOCX, ZIP, etc.)  
- Tags and sector assignment for better organization

### Post interaction
- Commenting
- Saving post  
- Subscription to posts — users can follow topics and receive updates (notification delivery system prepared at the prototype level)  

### Discussion status
- Authors can change the status of a post (*active* / *closed*)  
- Closed posts are archived and locked from new comments  

### Search and filters
- Full-text search by title, content, tags, or author  
- Post filters by sector, status, date, and author  

### User profile
- Name, position, and profile image edit
- Password reset form

### Admin & Moderator Panel
- Create and manage sectors (name, description, color, members)
- Choose between seeing all sectors or the ones they work in = via sidebar toggle button  
- Manage users, edit their details, and assign roles  
- Edit and remove posts

### Responsive UI
- Clean, modern, and intuitive interface optimized for both desktop and mobile devices  

# Technologies used:
- React 19
- TypeScript
- Inertia.js
- Tailwind CSS
- Laravel 12
- MySQL

- **Libraries**
  - Axios
  - Shadcn
  - Sonner

# Requirements
- PHP 8.2+
- Composer
- Node.js + npm
- MySQL (or other compatible databases)

# Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/popara03/organizimo.git
cd organizimo

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

## Setup .env file
Copy the example environment file and adjust the settings:
```bash
cp .env.example .env
```
Make sure to configure your database in .env:
```bash
DB_DATABASE=organizimo
DB_USERNAME=root
DB_PASSWORD=
```

## Database setup
Run the migrations and seeders to prepare the database:
```bash
php artisan migrate --seed
```

## Running the application
Use the Composer script that runs backend (Laravel), frontend (Vite), and queue worker together:
```bash
composer dev
```
Run Laravel and Vite in separate terminals:
```bash
php artisan serve
npm run dev
```
