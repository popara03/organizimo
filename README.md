# Organizimo - a knowledge sharing platform for internal company communication

A full-stack web application built with React (frontend) and Laravel 12 (backend), designed to centralize knowledge, improve collaboration, and streamline problem-solving within an organization. The platform allows employees to create, organize, and search posts by sector, significantly reducing duplicated effort and making it easier to find solutions to recurring issues.

## Table of Contents
- [Overview](#overview)
- [Technologies](#technologies)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Setup .env file](#setup-env-file)
  - [Database setup](#database-setup)
- [Running the application](#running-the-application)
  - [Test as admin](#test-as-admin)

# Overview

Users can register, edit their profiles, and access sectors relevant to their department. Within each sector, users can publish posts (including title, text, images, and file attachments), engage in discussions, save posts, and follow topics of interest. While admins can manage sectors, users, and posts.

A robust search and filtering system ensures quick retrieval of relevant content, helping teams save time and focus on real work.

# Technologies
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
  - FakerPHP

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

Generate an application key (required for Laravel sessions and encryption):
```bash
php artisan key:generate
```

Then configure your database in ```.env```:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=organizimo
DB_USERNAME=root
DB_PASSWORD=
```

## Database setup
Before running migrations, create a database and ensure its name matches the ```DB_DATABASE``` value defined in your ```.env``` file.

Run the migrations and seeders to populate the database:
```bash
php artisan migrate --seed
```

# Running the application
Use the Composer script that runs backend (Laravel), frontend (Vite), and queue worker together:
```bash
composer dev
```
Or run Laravel and Vite in separate terminals:
```bash
php artisan serve
npm run dev
```

## Test as admin
You can use the admin account created with migrations to access all features of the app:
```bash
admin@admin.com
Admin123!
```
