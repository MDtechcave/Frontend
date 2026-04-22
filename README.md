# Healthy Habits App

## Features
- Purchase weekly meal plans
- Track your order and status
- See hiking and running routes around Cape Town

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MDtechcave/Frontend.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
- Run the app:
   ```bash
   npm run serve
   ```
- Open your browser and go to `http://localhost:5173` to view the application.

## Development
- To start development, use:
   ```bash
   npm run dev
   ```
- This will enable hot-reloading for a smoother development experience.

## Project Structure
```
Frontend/
├── src/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── stores/
│   └── App.vue
└── public/
|__ .env/
```
##Add this .env file to your root
VITE_API_URL=https://health-habits-backend-production.up.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51T29Y7DMo7XbVmJRvsltySuJAMfNbdx29fEt5wVeg24omyCcpKfGAUAiJX4JCcgNwmbV9mZXTCaTceyL49mAc3Im00gKjIzV54

## Technologies Used
- Vue.js
- Stripe

## Contributing
If you would like to contribute to this project, please fork the repository and create a pull request. Keep your changes clean and well-documented.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
