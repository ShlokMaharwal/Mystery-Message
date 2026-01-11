🕵️‍♂️ True Feedback — Anonymous Messaging Platform

True Feedback is a full-stack anonymous messaging web app where users can receive honest, anonymous messages through a unique public link — without revealing the sender’s identity.

Built with Next.js App Router, NextAuth, MongoDB, Zod, and shadcn/ui, this project focuses on security, clean UX, and production-ready architecture.

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

✨ Features

🔐 Authentication & Security
• Email / Username + Password login (NextAuth Credentials)
• Email verification with OTP
• Secure session handling (JWT strategy)
• Protected routes with middleware

📨 Anonymous Messaging
• Each user gets a unique public link
• Anyone can send anonymous messages
• Receiver identity is always hidden

🧠 User Controls
• Toggle Accept Messages ON/OFF
• Delete individual messages securely
• Copy shareable profile link instantly

🎨 UI & UX
• Modern UI using shadcn/ui
• Toast notifications for feedback
• Responsive design
• Confirmation dialogs for destructive actions

🛡 Backend Safety
• Zod validation (frontend + backend)
• Ownership checks for message deletion
• Server-side session verification
• MongoDB atomic updates ($pull)

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

🧱 Tech Stack

Frontend
• Next.js 14+ (App Router)
• React Hook Form
• Zod
• Axios
• shadcn/ui
• Tailwind CSS
• Lucide Icons

Backend
• Next.js API Routes
• NextAuth (Credentials Provider)
• MongoDB + Mongoose
• bcryptjs
• Resend (Email OTP)

Utilities
• Debounced username availability check

⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

🚀 Getting Started

# Install dependencies
npm install

# Run development server
npm run dev

Visit:
👉 http://localhost:3000