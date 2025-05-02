# Custom Note Service

A minimal Supabase backend for a personal notes service with authentication and basic CRUD operations.

## Setup & Deployment

1. Create a new Supabase project
2. Enable the "pg_net" extension in your database
3. Run the `schema.sql` script in your SQL editor
4. Create two Edge Functions:
   - `post_notes` (using post_notes.js)
   - `get_notes` (using get_notes.js)
5. Set required environment variables:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

## Design Choices

### Schema
- Used UUID primary keys for better security and distribution
- Added RLS policies to ensure users can only access their own notes
- Included timestamps for tracking note lifecycle
- Added `is_public` flag for potential future sharing features

### Endpoints
- POST /notes: Chose POST for resource creation with data in body
- GET /notes: Chose GET for data retrieval with RLS handling filtering

## Demo

### Create a note
```bash
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/notes' \
  -H 'Authorization: Bearer YOUR_SUPABASE_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title": "My first note", "content": "This is a test note"}'