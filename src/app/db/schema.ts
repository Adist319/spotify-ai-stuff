import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const recommendations = pgTable('recommendations', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  track_id: text('track_id').notNull(),
  track_name: text('track_name').notNull(),
  artist_name: text('artist_name').notNull(),
  reason: text('reason').notNull(),
  mood: text('mood'),
  context: text('context'),
  is_liked: boolean('is_liked').default(false),
  is_hidden: boolean('is_hidden').default(false),
  created_at: timestamp('created_at').defaultNow(),
  interacted_at: timestamp('interacted_at')
});