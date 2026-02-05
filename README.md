# Dumbways Batch 65 Stage 1

Tugas hari ke-8 - A simple web application built with Node.js, Express, and Handlebars.

## Description

This project is a basic web application that includes pages for home, my projects, project details, contact me, and a 404 error page. It demonstrates the use of Express.js with Handlebars templating engine for server-side rendering.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/udenbaguse/dumbways-batch65-stage1.git
   ```

2. Navigate to the project directory:

   ```bash
   cd dumbways-batch65-stage1
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To run the application in development mode:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## Project Structure

```
dumbways-batch65-stage1/
├── app.js                 # Main application file
├── package.json           # Project dependencies and scripts
├── public/                # Static files (CSS, JS)
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── actions/
│       ├── components/
│       ├── forms/
│       ├── pages/
│       └── utils/
├── src/
│   ├── controllers/
│   │   └── pageController.js
│   ├── routes/
│   │   └── pageRoutes.js
│   └── views/
│       ├── layouts/
│       │   └── main.hbs
│       ├── partials/
│       │   └── navbar.hbs
│       └── *.hbs (page templates)
└── README.md
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Handlebars** - Templating engine
- **express-handlebars** - Handlebars view engine for Express

## Scripts

- `npm run dev` - Start the development server with nodemon

## License

All Rights Reserved

## Author

Syam
