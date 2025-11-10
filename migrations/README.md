# D1 Database Setup Instructions

## Step 1: Create the D1 Database

Run this command to create your D1 database:

```bash
pnpm wrangler d1 create theater-bookings
```

This will output something like:

```
✅ Successfully created DB 'theater-bookings'!

[[d1_databases]]
binding = "DB"
database_name = "theater-bookings"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Step 2: Update wrangler.toml

Copy the `database_id` from the output and replace the `"placeholder"` value in `wrangler.toml`.

## Step 3: Run Migrations

Apply the schema to your database:

```bash
# For local development
pnpm wrangler d1 execute theater-bookings --local --file=./migrations/0001_initial_schema.sql

# For production
pnpm wrangler d1 execute theater-bookings --remote --file=./migrations/0001_initial_schema.sql
```

## Step 4: Seed Initial Data (Optional)

Populate with your plays:

```bash
# Local
pnpm wrangler d1 execute theater-bookings --local --file=./migrations/0002_seed_plays.sql

# Production
pnpm wrangler d1 execute theater-bookings --remote --file=./migrations/0002_seed_plays.sql
```

## Useful Commands

```bash
# Query your database locally
pnpm wrangler d1 execute theater-bookings --local --command="SELECT * FROM plays;"

# Query production database
pnpm wrangler d1 execute theater-bookings --remote --command="SELECT * FROM plays;"

# Access interactive SQL console
pnpm wrangler d1 execute theater-bookings --local
```

