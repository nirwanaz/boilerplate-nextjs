import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	role: text("role").notNull().default("user"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt"),
});

// --- Project Tables ---

export const posts = pgTable("posts", {
	id: text("id").primaryKey(), // Using text to match user.id ref
	title: text("title").notNull(),
	content: text("content").notNull(),
	slug: text("slug").unique(),
	excerpt: text("excerpt"),
	featuredImage: text("featured_image"),
	status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
	authorId: text("author_id")
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const postCategories = pgTable("post_categories", {
	postId: text("post_id")
		.notNull()
		.references(() => posts.id, { onDelete: 'cascade' }),
	categoryId: text("category_id")
		.notNull()
		.references(() => categories.id, { onDelete: 'cascade' }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
	pk: { type: 'primary', columns: [table.postId, table.categoryId] },
}));

export const appSettings = pgTable("app_settings", {
	id: text("id").primaryKey(),
	key: text("key").notNull().unique(),
	value: text("value").notNull().default(""),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userSettings = pgTable("user_settings", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	theme: text("theme", { enum: ["light", "dark", "system"] }).notNull().default("system"),
	language: text("language").notNull().default("en"),
	emailNotifications: boolean("email_notifications").notNull().default(true),
	pushNotifications: boolean("push_notifications").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	amount: integer("amount").notNull(),
	currency: text("currency").notNull().default("usd"),
	status: text("status", { enum: ["pending", "paid", "failed", "refunded"] }).notNull().default("pending"),
	stripeSessionId: text("stripe_session_id").unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
	id: text("id").primaryKey(),
	orderId: text("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	name: text("name").notNull(),
	quantity: integer("quantity").notNull().default(1),
	unitPrice: integer("unit_price").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	price: integer("price").notNull(),
	currency: text("currency").notNull().default("usd"),
	status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	action: text("action").notNull(), // e.g., 'CREATE_PRODUCT', 'UPDATE_POST'
	entityType: text("entity_type").notNull(), // e.g., 'product', 'post'
	entityId: text("entity_id"),
	details: text("details"), // JSON string for metadata
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Marketing Engine Tables ---

export const landingContent = pgTable("landing_content", {
	id: text("id").primaryKey(),
	section: text("section").notNull(), // e.g., 'hero', 'features', 'cta'
	key: text("key").notNull(), // e.g., 'title', 'subtitle', 'badge_text'
	value: text("value").notNull().default(""),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	title: text("title").notNull(), // e.g., 'CTO, Luminary AI'
	quote: text("quote").notNull(),
	avatarUrl: text("avatar_url"),
	rating: integer("rating").notNull().default(5),
	sortOrder: integer("sort_order").notNull().default(0),
	isPublished: boolean("is_published").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const seoSettings = pgTable("seo_settings", {
	id: text("id").primaryKey(),
	pagePath: text("page_path").notNull().unique(), // e.g., '/', '/blog', '/about'
	metaTitle: text("meta_title"),
	metaDescription: text("meta_description"),
	ogImage: text("og_image"),
	keywords: text("keywords"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	name: text("name"),
	status: text("status", { enum: ["active", "unsubscribed"] }).notNull().default("active"),
	source: text("source").default("website"), // where they signed up
	subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
	unsubscribedAt: timestamp("unsubscribed_at"),
});

export const newsletters = pgTable("newsletters", {
	id: text("id").primaryKey(),
	subject: text("subject").notNull(),
	body: text("body").notNull(), // HTML content
	status: text("status", { enum: ["draft", "sending", "sent", "failed"] }).notNull().default("draft"),
	sentCount: integer("sent_count").notNull().default(0),
	sentAt: timestamp("sent_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Relations ---

import { relations } from "drizzle-orm";

export const userRelations = relations(user, ({ many }) => ({
	posts: many(posts),
	orders: many(orders),
	settings: many(userSettings),
	activityLogs: many(activityLogs),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(user, {
		fields: [posts.authorId],
		references: [user.id],
	}),
	categories: many(postCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	posts: many(postCategories),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
	post: one(posts, {
		fields: [postCategories.postId],
		references: [posts.id],
	}),
	category: one(categories, {
		fields: [postCategories.categoryId],
		references: [categories.id],
	}),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
	user: one(user, {
		fields: [orders.userId],
		references: [user.id],
	}),
	items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
	}),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
	user: one(user, {
		fields: [userSettings.userId],
		references: [user.id],
	}),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
	user: one(user, {
		fields: [activityLogs.userId],
		references: [user.id],
	}),
}));
