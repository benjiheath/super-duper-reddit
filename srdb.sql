BEGIN;

CREATE EXTENSION "uuid-ossp";

CREATE TYPE normal_or_removed AS ENUM ('normal', 'removed');

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reset_pw_token VARCHAR(255),
    points SMALLINT
);

CREATE TABLE threads(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    title VARCHAR(100),
    body VARCHAR(5000),
    creator_user_id uuid,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_status normal_or_removed  NOT NULL DEFAULT 'normal',
    CONSTRAINT creator_user_id FOREIGN KEY(creator_user_id) REFERENCES users(id)
);

CREATE TABLE posts(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    thread_id uuid,
    creator_user_id uuid,
    parent_post_id uuid,
    body VARCHAR(5000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_status normal_or_removed NOT NULL DEFAULT 'normal',
    CONSTRAINT thread_id FOREIGN KEY(thread_id ) REFERENCES threads(id),
    CONSTRAINT creator_user_id FOREIGN KEY(creator_user_id) REFERENCES users(id),
    CONSTRAINT parent_post_id FOREIGN KEY(parent_post_id) REFERENCES posts(id)
);

CREATE TABLE threads_votes (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    thread_id uuid,
    user_id uuid,
    vote_status INT CHECK (vote_status = 1 OR vote_status = -1) NOT NULL,
    CONSTRAINT thread_id FOREIGN KEY(thread_id) REFERENCES threads(id),
    CONSTRAINT user_id FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE posts_votes (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    posts_id uuid,
    user_id uuid,
    vote_status INT CHECK (vote_status = 1 OR vote_status = -1) NOT NULL,
    CONSTRAINT posts_id FOREIGN KEY(posts_id) REFERENCES posts(id),
    CONSTRAINT user_id FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON threads
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

COMMIT;

ANALYZE users;
ANALYZE posts;
ANALYZE session;