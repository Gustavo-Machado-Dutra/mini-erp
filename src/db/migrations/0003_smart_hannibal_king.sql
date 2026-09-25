CREATE TYPE "public"."follow_up_channel" AS ENUM('manual', 'phone', 'email', 'whatsapp', 'other');--> statement-breakpoint
CREATE TYPE "public"."follow_up_status" AS ENUM('pending', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."follow_up_type" AS ENUM('price_follow_up', 'quote_follow_up', 'reactivation', 'appointment_follow_up', 'general');--> statement-breakpoint
CREATE TABLE "follow_ups" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"customer_id" text,
	"lead_id" text,
	"type" "follow_up_type" DEFAULT 'general' NOT NULL,
	"status" "follow_up_status" DEFAULT 'pending' NOT NULL,
	"channel" "follow_up_channel" DEFAULT 'manual' NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"executed_at" timestamp with time zone,
	"outcome" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text
);
--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "follow_ups_org_idx" ON "follow_ups" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "follow_ups_org_status_idx" ON "follow_ups" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "follow_ups_org_scheduled_idx" ON "follow_ups" USING btree ("organization_id","scheduled_at");--> statement-breakpoint
CREATE INDEX "follow_ups_customer_idx" ON "follow_ups" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "follow_ups_lead_idx" ON "follow_ups" USING btree ("lead_id");