# Gaming Zone - Booking Platform

A full-stack Next.js application for managing and booking gaming zones. Users can browse available games, book time slots, and manage their bookings. Admins can manage games, zones, menus, and view analytics.

## Features

### User Features
- **Authentication**: Firebase email/password authentication
- **Browse Zones**: View all available gaming zones with locations and details
- **Book Games**: Select games, choose time slots, and specify number of players
- **View Bookings**: See all personal bookings with booking details
- **User Profile**: Track total bookings, hours played, and favorite games
- **Cafe Menu**: Order food and beverages during booking
- **Payment Options**: Pay at zone or online payment support

### Admin Features
- **Manage Games**: Create, edit, and delete games with max player limits
- **Manage Zones**: Edit zone details, opening hours, and capacity
- **Manage Menu**: Add and delete cafe menu items
- **View Bookings**: Monitor all zone bookings
- **Analytics**: View booking statistics and player data
- **Edit Game Details**: Update game pricing and player limits

## Tech Stack

- **Frontend**: Next.js 16.x, React, Tailwind CSS
- **Backend**: Next.js API routes, Firebase
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Email**: Nodemailer (for booking confirmations)

## Project Structure

```
gaming-zone/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── analytics/
│   │   │   ├── dashboard/
│   │   │   ├── games/
│   │   │   ├── menu/
│   │   │   └── zones/
│   │   ├── api/               # API routes
│   │   │   ├── send-booking-email/
│   │   │   └── send-welcome/
│   │   ├── dashboard/         # User dashboard
│   │   │   ├── bookings/
│   │   │   └── profile/
│   │   └── zones/             # User zone pages
│   ├── components/            # React components
│   │   ├── BookingModal.js
│   │   ├── GameCard.js
│   │   ├── ZoneCard.js
│   │   └── ...
│   ├── context/              # React context
│   │   └── AuthContext.js
│   ├── hooks/                # Custom React hooks
│   │   └── useRouteGuard.js
│   ├── lib/                  # Utilities and configs
│   │   ├── firebase.js
│   │   ├── firebase-admin.js
│   │   └── email.js
│   └── services/             # Firestore services
│       ├── bookingService.js
│       ├── gameService.js
│       ├── menuService.js
│       └── zoneService.js
├── firestore.rules           # Firestore security rules
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- Firebase project with Firestore enabled

### 1. Clone the Repository
```bash
git clone <repository-url>
cd gaming-zone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin SDK (for server-side operations)
FIREBASE_ADMIN_SDK_KEY=your_admin_sdk_key
NEXT_PUBLIC_EMAIL_SERVICE_PASSWORD=your_email_password
```

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Database Schema

### Collections

#### `users/{userId}`
```javascript
{
  email: string,
  name: string,
  phone: string,
  createdAt: timestamp
}
```

#### `zones/{zoneId}`
```javascript
{
  name: string,
  location: string,
  description: string,
  image: string,
  capacity: number,
  openingHours: string,
  hasCafe: boolean,
  createdAt: timestamp
}
```

#### `games/{gameId}`
```javascript
{
  name: string,
  zoneId: string,
  pricePerHour: number,
  maxPlayers: number,
  image: string,
  description: string,
  createdAt: timestamp
}
```

#### `bookings/{bookingId}`
```javascript
{
  userId: string,
  userEmail: string,
  gameId: string,
  gameName: string,
  zoneId: string,
  zoneName: string,
  date: string (YYYY-MM-DD),
  slot: string (e.g., "10AM - 11AM"),
  numberOfPlayers: number,
  paymentMethod: string ("pay_at_zone" | "online"),
  status: string ("confirmed" | "cancelled"),
  menuItems: array,
  createdAt: timestamp
}
```

#### `menu/{menuId}`
```javascript
{
  name: string,
  zoneId: string,
  price: number,
  category: string ("Food" | "Beverage" | "Snack" | "Dessert"),
  image: string,
  createdAt: timestamp
}
```

## Authentication

- **Admin Email**: `kongekartikey007@gmail.com` (hardcoded in firestore.rules)
- Only authenticated users can book games
- Admins can manage all zones, games, and bookings

## Firestore Security Rules

Key rules implemented:
- Users can only read/write their own documents
- Admins can manage all game, zone, and menu data
- Bookings require: authenticated user, valid game/zone references, numberOfPlayers within maxPlayers limit
- Player count validation: `numberOfPlayers <= game.maxPlayers`

## API Routes

### Email Notifications
- `POST /api/send-booking-email` - Send booking confirmation email
- `POST /api/send-welcome` - Send welcome email to new users

## Services

### Booking Service
- `createBooking(bookingData)` - Create a new booking
- `getUserBookings(userId)` - Get user's bookings
- `getAllBookings()` - Get all bookings
- `getBookedSlots(gameId, date)` - Get booked slots for a game on a date
- `checkSlotAvailability(gameId, slot, date)` - Check if slot is available
- `cancelBooking(id)` - Cancel a booking
- `updateBooking(bookingId, updateData)` - Update booking with menu items

### Game Service
- `getGamesByZone(zoneId)` - Get games for a zone
- `createGame(game)` - Create a new game
- `deleteGame(gameId)` - Delete a game

### Zone Service
- `getAllZones()` - Get all zones
- `getZoneById(zoneId)` - Get zone details
- `createZone(zone)` - Create a new zone
- `updateZone(zoneId, updateData)` - Update zone details

### Menu Service
- `getMenuByZone(zoneId)` - Get menu items for a zone
- `createMenuItem(item)` - Add menu item
- `deleteMenuItem(id)` - Delete menu item

## Key Pages

### Public Pages
- `/` - Home page
- `/zones` - Browse all zones
- `/zones/[id]` - Zone details with games

### Auth Pages
- `/login` - User login
- `/register` - User registration

### User Dashboard
- `/dashboard` - Main dashboard
- `/dashboard/bookings` - View bookings
- `/dashboard/profile` - User profile and stats

### Admin Pages
- `/admin/dashboard` - Admin overview
- `/admin/games` - Manage games
- `/admin/zones` - Manage zones
- `/admin/zones/[id]` - Edit zone and games
- `/admin/menu` - Manage menu items
- `/admin/analytics` - View analytics

## Features in Detail

### Booking Flow
1. User browses zones and games
2. Clicks "Book Now" on a game
3. Selects date and time slots
4. Specifies number of players (validated against maxPlayers)
5. Chooses payment method
6. Booking is created and email confirmation sent
7. If zone has cafe, user can add menu items

### Game Management
- Admins create games with name, price, max players, and description
- Games are stored in top-level `games` collection
- Each game is linked to a zone via `zoneId`
- Games can be edited inline from zone management page

### Player Limit Validation
- Frontend validates numberOfPlayers <= maxPlayers
- Firestore rules enforce the same check
- User gets clear error if limit is exceeded

## Troubleshooting

### Booking Fails with "Missing Permissions"
- Ensure all required booking fields are populated
- Verify `numberOfPlayers` is a number (not string)
- Check that the game has a valid `maxPlayers` field
- Confirm Firestore rules are deployed

### Games Not Visible
- Ensure zone has games created
- Check that current user is authenticated
- Verify game documents have all required fields

### Email Not Sending
- Verify `NEXT_PUBLIC_EMAIL_SERVICE_PASSWORD` is set correctly
- Check sender email configuration in `src/lib/email.js`
- Ensure Nodemailer dependencies are installed

## Development Tips

### Running in Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## License

MIT License - Feel free to use this project for educational and commercial purposes.
