

# Schema Forge CMS - Implementation Plan

A dark-mode focused CMS tool for admins to visually edit JSON content and manage API access tokens.

---

## 1. Authentication Pages

### Login Page (`/login`)
- Email and password input fields
- Login button that calls your backend authentication API
- Link to signup page
- Error handling for invalid credentials
- Dark theme styling

### Signup Page (`/signup`)
- Registration form (email, password, confirm password)
- Submit button connecting to your backend
- Link back to login
- Validation feedback

---

## 2. Main Layout & Navigation

### Dashboard Shell
- Dark-themed sidebar navigation with:
  - **Content Editor** - JSON editing page
  - **API Tokens** - Token management dashboard
  - **Logout** button
- Header with user info/avatar
- Collapsible sidebar for more workspace

---

## 3. Content Editor Page (`/editor`)

### Visual Form Editor for New JSON Schema
Organized into collapsible sections matching your JSON structure:

**Header Section**
- Logo management (add/edit/remove logo entries with URL and alt text)
- Navigation items (dynamic list - add/edit/remove nav links with label and href)
- Action buttons (add/edit/remove CTA buttons)

**Banner Section**
- Headline text field
- Subtext field
- Hero media (image URL with type selector)
- Primary CTA (label + href)
- Secondary CTA (label + href)

**Main Content Section**
- Introduction text area
- Cards list (dynamic - add multiple cards with title/description)
- Carousel items (add multiple images)
- Highlights list (add multiple highlight texts)

**Footer Section**
- Links management (add privacy policy, terms, etc.)
- Social icons (platform selector + URL for each)
- Contact info (email, phone, etc.)
- Copyright text

### Key Features
- Add/remove items from any array field (cards, carousel, nav items, etc.)
- Inline editing with immediate visual feedback
- Save button to push changes to your backend API
- Reset/Cancel to discard changes
- Loading states and success/error notifications

---

## 4. API Tokens Dashboard (`/tokens`)

### Token List View
- Table/cards showing all created tokens
- Columns: Token name, Created date, Last used, Status
- Search and filter functionality
- Delete token option

### Create Token Modal
- Token name/description input
- Generate button
- **One-time display**: Show the generated token clearly with copy-to-clipboard button
- Warning that token won't be shown again
- Confirmation before closing

### Token Management
- Revoke/delete tokens
- View token creation history

---

## 5. Technical Implementation

### API Integration Layer
- API service module to connect to your existing backend
- Endpoints for:
  - Authentication (login/signup/logout)
  - Fetch current JSON content
  - Save updated JSON content
  - Create new API token
  - List all tokens
  - Delete/revoke tokens
- Error handling and loading states

### State Management
- React Query for server state (JSON content, tokens list)
- Local state for form editing

### Form Handling
- Zod validation schemas for the JSON structure
- React Hook Form for form management
- Dynamic field arrays for adding/removing items

---

## Pages Summary

| Page | Purpose |
|------|---------|
| `/login` | User authentication |
| `/signup` | New user registration |
| `/editor` | Visual form editor for JSON content |
| `/tokens` | API token creation and management |

---

## Design Notes

- **Dark mode throughout** - optimized for developer/power user experience
- Clean, professional dashboard aesthetic
- Clear visual hierarchy for nested JSON sections
- Toast notifications for save success/errors
- Confirmation dialogs for destructive actions (delete token, etc.)

