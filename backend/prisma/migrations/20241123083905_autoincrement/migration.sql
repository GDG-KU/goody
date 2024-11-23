-- AlterTable
CREATE SEQUENCE activity_activity_id_seq;
ALTER TABLE "activity" ALTER COLUMN "activity_id" SET DEFAULT nextval('activity_activity_id_seq');
ALTER SEQUENCE activity_activity_id_seq OWNED BY "activity"."activity_id";

-- AlterTable
CREATE SEQUENCE activity_location_location_id_seq;
ALTER TABLE "activity_location" ALTER COLUMN "location_id" SET DEFAULT nextval('activity_location_location_id_seq');
ALTER SEQUENCE activity_location_location_id_seq OWNED BY "activity_location"."location_id";

-- AlterTable
CREATE SEQUENCE keyword_keyword_id_seq;
ALTER TABLE "keyword" ALTER COLUMN "keyword_id" SET DEFAULT nextval('keyword_keyword_id_seq');
ALTER SEQUENCE keyword_keyword_id_seq OWNED BY "keyword"."keyword_id";

-- AlterTable
CREATE SEQUENCE recent_activity_recent_activity_id_seq;
ALTER TABLE "recent_activity" ALTER COLUMN "recent_activity_id" SET DEFAULT nextval('recent_activity_recent_activity_id_seq');
ALTER SEQUENCE recent_activity_recent_activity_id_seq OWNED BY "recent_activity"."recent_activity_id";

-- AlterTable
CREATE SEQUENCE user_user_id_seq;
ALTER TABLE "user" ALTER COLUMN "user_id" SET DEFAULT nextval('user_user_id_seq');
ALTER SEQUENCE user_user_id_seq OWNED BY "user"."user_id";

-- AlterTable
CREATE SEQUENCE user_location_user_location_id_seq;
ALTER TABLE "user_location" ALTER COLUMN "user_location_id" SET DEFAULT nextval('user_location_user_location_id_seq');
ALTER SEQUENCE user_location_user_location_id_seq OWNED BY "user_location"."user_location_id";
