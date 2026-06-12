CREATE TABLE "answerStats" (
	"userId" text NOT NULL,
	"questionId" integer NOT NULL,
	"Qcategory" text NOT NULL,
	"correctCount" integer DEFAULT 0 NOT NULL,
	"incorrectCount" integer DEFAULT 0 NOT NULL,
	"lastIsCorrect" boolean NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "answerStats_userId_questionId_pk" PRIMARY KEY("userId","questionId")
);
--> statement-breakpoint
ALTER TABLE "answerStats" ADD CONSTRAINT "answerStats_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answerStats" ADD CONSTRAINT "answerStats_questionId_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;