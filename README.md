# E-commerce Web Application with AI Chatbot

This project is a modern e-commerce web application featuring product listings, deals, user authentication (Sign In/Sign Up), and an integrated AI-powered chatbot. The frontend is built with React and Tailwind CSS, while the backend is powered by Flask, handling API requests and integrating with the Google Gemini API for the chatbot's intelligence.

## ✨ Features

* **Product Listings:** Browse a variety of products on the dedicated products page.
* **Deals Page:** Discover special offers and discounted items.
* **User Authentication:**
    * **Sign Up:** Create a new user account.
    * **Sign In:** Log in to access protected content.
    * **Protected Routes:** Only authenticated users can access the `/products` and `/deals` pages.
    * **Session Management:** Users remain logged in across sessions (simulated via `localStorage`).
* **AI Chatbot:**
    * An interactive chatbot powered by Google Gemini API.
    * Assists users with product queries, store policies, and general questions.
    * Customizable welcome messages and adjustable window size.
* **Responsive Design:** Built with Tailwind CSS for a modern and mobile-friendly user interface.
* **Client-Side Routing:** Seamless navigation using `react-router-dom`.
* **Authentication Context:** Global state management for user authentication using React Context API.

## 🚀 Technologies Used

**Frontend:**
* **React:** A JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **React Router DOM:** For declarative routing in React applications.
* **Lucide React:** A beautiful icon library for React.
* **Framer Motion:** A production-ready motion library for React.

**Backend:**
* **Flask:** A micro web framework for Python.
* **Flask-CORS:** A Flask extension for handling Cross Origin Resource Sharing (CORS), making API calls from frontend to backend possible.
* **python-dotenv:** For loading environment variables from a `.env` file.
* **Google Generative AI (google-generativeai):** Python client for interacting with the Google Gemini API.

## ⚙️ Setup and Installation

Follow these steps to get your project up and running locally.

### Prerequisites

Make sure you have the following installed on your machine:
* Node.js (LTS version recommended) & npm (or yarn)
* Python (3.8+) & pip

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install Flask Flask-CORS python-dotenv google-generativeai
    ```

4.  **Set up Environment Variables:**
    Create a `.env` file in the `backend` directory and add your Google Gemini API key:
    ```
    GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
    ```
    (Replace `"YOUR_GOOGLE_GEMINI_API_KEY"` with your actual API key obtained from Google AI Studio or Google Cloud.)

5.  **Run the Flask backend server:**
    ```bash
    python app.py
    ```
    The backend server will typically run on `http://127.0.0.1:5000`.

### Frontend Setup

1.  **Navigate to the frontend (root) directory:**
    ```bash
    cd ../ # If you are still in the backend directory, or navigate to your project root
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the React development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The frontend application will open in your browser, typically at `http://localhost:3000`.

## 🖥️ Usage

1.  Upon launching the application, you will be redirected to the **Sign In** page (`/signin`).
2.  **Sign Up:** If you don't have an account, click "Sign Up" to create one.
    * For simulated sign-up, use any email/password.
3.  **Sign In:** Use the following credentials for simulated login:
    * **Email:** `user@example.com`
    * **Password:** `password123`
4.  After successful sign-in, you will be redirected to the `/products` page. From here, you can navigate to the `/deals` page as well.
5.  The **Chatbot** icon will be available on the bottom right corner of the screen. Click it to open the chat window and start interacting with the AI assistant.

---

**Note:** This project uses client-side simulated authentication for demonstration purposes. For a production application, you would need to implement robust backend authentication with secure token management (e.g., JWT) and encrypted password storage.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or want to improve the project, feel free to fork the repository and submit a pull request.
