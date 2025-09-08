# Anonymous Feedback Platform

This is a full-stack web application built with Next.js that allows users to register and receive anonymous feedback from others.

## Features

- **User Authentication:** Secure sign-up and sign-in functionality.
- **Username Uniqueness Check:** Real-time check to ensure usernames are unique.
- **Anonymous Messaging:** Users can send anonymous messages to registered users.
- **Dashboard:** Registered users can view and manage the messages they have received.
- **Email Verification:** OTP-based email verification for new user sign-ups.

## Tech Stack

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/tailwind%20css-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextauth.js&logoColor=white) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![Axios](https://img.shields.io/badge/axios-671ddf?style=for-the-badge&logo=axios&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white) ![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white) ![Nodemailer](https://img.shields.io/badge/Nodemailer-228be6?style=for-the-badge&logo=nodemailer&logoColor=white) ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Email (Production):** [Resend](https://resend.com/)
- **Email (Development):** [Nodemailer](https://nodemailer.com/)
- **AI Integration:** [Google Gemini](https://gemini.google.com/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- A MongoDB database instance (local or cloud-based like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd my-next-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a new file named `.env.local` in the root of your project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```

    Now, open `.env.local` and fill in the required values:

    - `MONGODB_URI`: Your MongoDB connection string.
    - `MAIL_USER`: The Gmail address you want to send verification emails from.
    - `MAIL_PASS`: A 16-character Google App Password for the account specified in `MAIL_USER`.
    - `GEMINI_API_KEY`: Your API key for Google Gemini.
    - `NEXTAUTH_SECRET`: A secret key for NextAuth.js. You can generate one using `openssl rand -base64 32`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application:**

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.