# Wallet Passes Feature Summary

## Overview

The booking system now supports generating digital wallet passes for both Apple Wallet (iOS) and Google Wallet (Android). Users can add their event tickets directly to their phone's wallet app.

## What's Been Implemented

### 1. API Routes

**`/api/wallet/apple` (POST)**
- Generates Apple Wallet passes (.pkpass files)
- Includes event details, QR code, location-based relevance
- Requires Apple Developer certificates (see setup guide)

**`/api/wallet/google` (POST)**
- Generates Google Wallet passes via JWT token
- Creates "Add to Google Wallet" links
- Requires Google Cloud service account credentials (see setup guide)

### 2. Components

**`AddToWallet` Component**
- Platform detection (iOS, Android, Desktop)
- Shows appropriate wallet icon and text based on platform
- Handles API calls and error states
- Loading indicators during pass generation

### 3. Ticket Integration

- Wallet pass button appears on ticket page
- Automatically detects user's platform
- Desktop users can choose between Apple or Google Wallet
- Graceful fallback if wallet services aren't configured

### 4. Documentation

**Complete Setup Guide:** `docs/WALLET_SETUP.md`
- Step-by-step instructions for Apple Wallet setup
- Step-by-step instructions for Google Wallet setup
- Troubleshooting section
- Security best practices

**Certificate Management:** `certificates/README.md`
- Directory structure requirements
- Quick verification checklist

## User Experience

### On iOS Devices
1. User completes booking
2. On ticket page, clicks "Zu Apple Wallet hinzufügen"
3. Downloads .pkpass file
4. Opens in Apple Wallet
5. Ticket appears in Wallet app with:
   - Event name and date
   - Seat assignments
   - QR code for check-in
   - Location-based reminder when near venue

### On Android Devices
1. User completes booking
2. On ticket page, clicks "Zu Google Wallet hinzufügen"
3. Redirected to Google Wallet
4. Clicks "Save"
5. Ticket appears in Google Wallet with:
   - Event details
   - Seat assignments
   - QR code for check-in
   - Location-based notifications

### On Desktop
1. User completes booking
2. Clicks "Zu Wallet hinzufügen"
3. Chooses between Apple Wallet or Google Wallet
4. Downloads/opens appropriate wallet pass

## Pass Features

### Apple Wallet Pass Includes:
- Event name: "Winterstück 2025: Schicksalfäden"
- Date and time
- Seat assignments (in easy-to-read format: A1, B3, etc.)
- Venue name and address
- QR code linked to ticket URL
- Location-based relevance (shows on lock screen when near venue)
- Important information on back of pass
- Booking ID and customer details

### Google Wallet Pass Includes:
- Event name and hero image
- Date, time, and location
- Seat information
- QR code for ticket validation
- Link to view full ticket online
- Location-based notifications
- Important event information

## Configuration Status

### Without Setup (Default)
- Wallet pass buttons are visible
- Clicking shows friendly error message
- Users informed that feature requires administrator configuration
- All other ticket features work normally (QR code, printing, etc.)

### With Setup (Configured)
- Full wallet pass generation enabled
- Users can add tickets to their phone's wallet
- Location-based reminders work
- Enhanced user experience

## Setup Required

### For Apple Wallet:
1. Apple Developer account ($99/year)
2. Pass Type ID creation
3. Certificate generation and export
4. Certificate files placed in `certificates/apple-wallet/`
5. Pass model with images created

### For Google Wallet:
1. Google Cloud project (free)
2. Google Wallet API enabled
3. Service account created
4. Environment variables configured in `.env.local`

**See `docs/WALLET_SETUP.md` for complete instructions.**

## Technical Details

### Dependencies Added:
- `passkit-generator` - Apple Wallet pass generation
- `jsonwebtoken` - Google Wallet JWT token signing
- `@types/jsonwebtoken` - TypeScript types

### API Runtime:
- Both API routes use Node.js runtime (required for file system access and cryptography)
- Rest of application can still use Edge runtime

### Security:
- Certificates directory excluded from version control
- Environment variables for sensitive credentials
- Proper error handling without exposing credentials
- Service-side pass generation (no client-side secrets)

## Benefits

1. **Enhanced User Experience**
   - Easy access to tickets from lock screen
   - No need to open app or print ticket
   - Location-based reminders

2. **Professional Image**
   - Modern, expected feature for event tickets
   - Consistent with major ticketing platforms
   - Polished user experience

3. **Practical Benefits**
   - Works offline once added to wallet
   - Doesn't require app installation
   - Universal format (works with native OS apps)

4. **Check-in Process**
   - QR codes accessible from lock screen
   - Faster entry at venue
   - Reduced friction for attendees

## Future Enhancements (Optional)

- Pass updates via push notifications
- Real-time seat change notifications
- Event cancellation/rescheduling updates
- Multiple language support
- Custom pass designs per event
- Integration with email confirmation system

## Support

For setup assistance, see:
- Full setup guide: `docs/WALLET_SETUP.md`
- Certificate requirements: `certificates/README.md`
- Apple documentation: https://developer.apple.com/wallet/
- Google documentation: https://developers.google.com/wallet
