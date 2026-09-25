CREATE TYPE "public"."conversion_attribution_type" AS ENUM('direct_conversion','follow_up_conversion','reactivation_conversion','manual_conversion','unknown');
--> statement-breakpoint
CREATE TYPE "public"."revenue_status" AS ENUM('recorded','received');
--> statement-breakpoint
CREATE TYPE "public"."revenue_source" AS ENUM('manual','appointment','conversion','other');
--> statement-breakpoint
ALTER TABLE "conversions" RENAME COLUMN "type" TO "attribution_type";
--> statement-breakpoint
ALTER TABLE "conversions" ALTER COLUMN "attribution_type" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "conversions" ALTER COLUMN "attribution_type" TYPE "public"."conversion_attribution_type" USING "attribution_type"::"public"."conversion_attribution_type";
--> statement-breakpoint
ALTER TABLE "conversions" ALTER COLUMN "attribution_type" SET DEFAULT 'unknown';
--> statement-breakpoint
ALTER TABLE "conversions" ALTER COLUMN "attribution_type" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "conversions" ADD COLUMN "amount" numeric(12, 2) NOT NULL;
--> statement-breakpoint
ALTER TABLE "conversions" ADD COLUMN "converted_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "conversions" ADD COLUMN "notes" text;
--> statement-breakpoint
ALTER TABLE "revenue" RENAME COLUMN "paid_at" TO "occurred_at";
--> statement-breakpoint
ALTER TABLE "revenue" ADD COLUMN "currency" text DEFAULT 'BRL' NOT NULL;
--> statement-breakpoint
ALTER TABLE "revenue" ADD COLUMN "source" "public"."revenue_source" DEFAULT 'manual' NOT NULL;
--> statement-breakpoint
ALTER TABLE "revenue" ADD COLUMN "status" "public"."revenue_status" DEFAULT 'recorded' NOT NULL;
--> statement-breakpoint
ALTER TABLE "revenue" ADD COLUMN "conversion_id" text;
--> statement-breakpoint
ALTER TABLE "revenue" ADD CONSTRAINT "revenue_conversion_id_conversions_id_fk" FOREIGN KEY ("conversion_id") REFERENCES "public"."conversions"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
DROP INDEX IF EXISTS "revenue_org_paid_idx";
--> statement-breakpoint
CREATE INDEX "revenue_org_occurred_idx" ON "revenue" USING btree ("organization_id","occurred_at");
--> statement-breakpoint
CREATE INDEX "revenue_conversion_idx" ON "revenue" USING btree ("conversion_id");
