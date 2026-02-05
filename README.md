# InfluencerReach

A powerful tool for managing influencer outreach campaigns, sending personalized emails, and tracking results.

## Features

- **Email Templates**: Create, edit, and manage email templates with variables support
- **Contact Management**: Import and manage influencer contacts
- **Test Emails**: Send test emails to verify template formatting
- **Campaign Tracking**: Monitor email send status and response rates

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Resend account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend
RESEND_API_KEY=your_resend_api_key
```

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

### Database Setup

Run the following command to initialize the database schema:

```bash
npm run init-db
```

## CSV Import Format

When importing contacts via CSV, use the following format:

```csv
name,username,email
John Doe,johndoe,john@example.com
Jane Smith,janesmith,jane@example.com
```

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add the environment variables in the Vercel dashboard
3. Deploy the project

### Important Note

If using Resend Free plan, ensure you have verified your sending domain in the Resend dashboard. Otherwise, you can only send emails to your registered Resend email address.

## Usage

1. **Templates**: Create and manage email templates with variables
2. **Contacts**: Import and manage influencer contacts
3. **Campaigns**: Create and run outreach campaigns
4. **Analytics**: Track campaign performance

## Technologies Used

- Next.js 14
- React
- TypeScript
- Supabase
- Resend
- Tailwind CSS
- Shadcn UI

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
