# Order Tracking System

A professional order tracking application built for **Hamster | Jacques le Papetier** to manage and monitor orders in real-time.

<img width="236" height="116" alt="image" src="https://github.com/user-attachments/assets/4ded1151-1c2c-478f-8487-6924ca400838" />


## Features

- **Order Creation & Management** - Create, edit, and manage orders with detailed information
- **Real-time Order Status Updates** - Track order progress with live status updates
- **Professional UI** - Clean, business-focused interface styled with company branding (#633493)
- **Firebase Integration** - Secure authentication and real-time database with Firestore

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **Language**: JavaScript
- **Styling**: CSS
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Hosting**: Vercel (recommended)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Firebase account with a project set up

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd order-tracking-system
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** and choose your sign-in methods (Email/Password recommended)
4. Create a **Firestore Database** in your Firebase project
5. Get your Firebase configuration from Project Settings > General > Your apps > Web app

### 4. Environment Variables

Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note**: Never commit your `.env.local` file to version control. It's already included in `.gitignore`.

### 5. Firestore Security Rules

Set up your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    /* ================================
       USERS
       ================================ */
    match /users/{userId} {
      // Only the owner can read/write their user doc
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
      
      /* ================================
         SETTINGS
         ================================ */
      match /settings/{settingDoc} {
        // Only the owner can read/write their settings
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }
      
      /* ================================
         COMPANY ORDERS
         ================================ */
      match /comOrders/{orderId} {
        // READ: get + list
        allow read: if request.auth != null
                    && request.auth.uid == userId;
        // CREATE
        allow create: if request.auth != null
                      && request.auth.uid == userId
                      && request.resource.data.creationDate == request.time;
        // UPDATE
        allow update: if request.auth != null
                      && request.auth.uid == userId
                      && request.resource.data.creationDate == resource.data.creationDate;
        // DELETE
        allow delete: if request.auth != null
                      && request.auth.uid == userId;
      }
      
      /* ================================
         INDIVIDUAL ORDERS
         ================================ */
      match /indOrders/{orderId} {
        // READ: get + list
        allow read: if request.auth != null
                    && request.auth.uid == userId;
        // CREATE
        allow create: if request.auth != null
                      && request.auth.uid == userId
                      && request.resource.data.creationDate == request.time;
        // UPDATE
        allow update: if request.auth != null
                      && request.auth.uid == userId
                      && request.resource.data.creationDate == resource.data.creationDate;
        // DELETE
        allow delete: if request.auth != null
                      && request.auth.uid == userId;
      }
    }
  }
}
```

Adjust these rules based on your security requirements.

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
order-tracking-system/
├── public/              # Static files (images, icons, etc.)
├── src/
│   ├── app/            # Next.js app directory (pages and routing)
│   │   ├── page.js     # Home page
│   │   ├── layout.js   # Root layout
│   │   └── ...
│   ├── components/     # Reusable React components
│   │   ├── OrderForm/
│   │   ├── OrderList/
│   │   ├── OrderStatus/
│   │   └── ...
│   ├── lib/            # Utility functions and configurations
│   │   ├── firebase.js # Firebase configuration
│   │   └── ...
├── .env.local          # Environment variables (not in git)
├── .gitignore
├── next.config.js      # Next.js configuration
├── package.json
└── README.md
```

## Architecture Overview

### Data Flow

1. **Authentication Layer**: Firebase Authentication manages user login/logout
2. **Application Layer**: Next.js pages and components handle UI and business logic
3. **Data Layer**: Cloud Firestore stores and syncs order data in real-time
4. **Real-time Updates**: Firestore listeners provide live order status updates

### Key Components

- **OrderForm**: Create and edit orders
- **OrderList**: Display all orders with filtering and sorting
- **OrderStatus**: Visual status indicator component
- **AuthProvider**: Context provider for authentication state

### Firestore Collections

#### `orders`
```javascript
{
  id: string,
  orderNumber: string,
  customerName: string,
  customerEmail: string,
  status: string, // 'waiting', 'ready', 'delivered'
  items: array,
  totalAmount: number,
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string // user UID
}
```

## Available Scripts

- `npm run dev` - Start development server

## Deployment

### Deploy to Vercel (Recommended for Next.js)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Customization

### Updating Brand Colors

The primary brand color (#633493) is used throughout the application. To update:

1. Modify CSS variables in `src/styles/globals.css`:
```css
:root {
  --primary-color: #633493;
  --primary-hover: #4d2873;
  --primary-light: #8b4fc4;
}
```

## Troubleshooting

### Firebase Connection Issues
- Verify all environment variables are set correctly in `.env.local`
- Check Firebase project settings and ensure the web app is properly configured
- Confirm Firestore database is created and security rules are set

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for any missing dependencies

## Support

For issues or questions about this application, please contact the development team or create an issue in the repository.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built for **Hamster | Jacques le Papetier** with Next.js and Firebase.

---

**Version**: 1.0.0  
**Last Updated**: 2026
