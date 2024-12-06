# Crypto Price Tracker

Crypto Price Tracker is a web application that allows users to monitor live cryptocurrency prices, view historical trends, and manage a personalized watchlist. Built using **Next.js**, **Ant Design**, **Tailwind CSS**, **Redux Toolkit**, and **TypeScript**, the app is responsive and supports both light and dark themes.

## Features

- Live cryptocurrency price tracking with details like market cap, 24-hour price change, and more.
- User-friendly watchlist functionality to track favorite coins.
- Historical price chart visualization.
- Responsive design for mobile, tablet, and desktop.
- Dark and light theme toggle.

---

## Getting Started

Follow these steps to set up and run the app locally on your machine.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- A terminal or command-line interface

---

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Cyphaar500/Crypto-Price-Tracker.git
   cd crypto-price-tracker

Install the dependencies:

npm install
# or
yarn install
Running the App Locally
Start the development server:

bash
npm run dev
# or
yarn dev
Open your browser and navigate to:
http://localhost:3000

Environment Variables
To fetch data from the cryptocurrency API, set up your environment variables:

Create a .env.local file in the root directory:

bash
touch .env.local
Add the following variables (replace with your actual API keys or values if required):


NEXT_PUBLIC_CRYPTO_API_URL=https://api.coingecko.com/api/v3
Project Structure
