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

CREATE TABLE posts(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    title VARCHAR(100),
    content_url VARCHAR(200),
    body VARCHAR(5000),
    creator_user_id uuid,
    creator_username VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_status normal_or_removed  NOT NULL DEFAULT 'normal',
    url_slugs VARCHAR(100) UNIQUE,
    CONSTRAINT creator_user_id FOREIGN KEY(creator_user_id) REFERENCES users(id),
    CONSTRAINT creator_username FOREIGN KEY(creator_username) REFERENCES users(username)
);

CREATE TABLE comments(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    post_id uuid,
    creator_user_id uuid,
    creator_username VARCHAR(80) NOT NULL,
    parent_comment_id uuid,
    body VARCHAR(5000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_status normal_or_removed NOT NULL DEFAULT 'normal',
    CONSTRAINT post_id FOREIGN KEY(post_id ) REFERENCES posts(id),
    CONSTRAINT creator_user_id FOREIGN KEY(creator_user_id) REFERENCES users(id),
    CONSTRAINT creator_username FOREIGN KEY(creator_username) REFERENCES users(username),
    CONSTRAINT parent_comment_id FOREIGN KEY(parent_comment_id) REFERENCES comments(id)
);

CREATE TABLE posts_votes (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    post_id uuid,
    user_id uuid,
    vote_status INT CHECK (vote_status = 1 OR vote_status = -1) NOT NULL,
    CONSTRAINT post_id FOREIGN KEY(post_id) REFERENCES posts(id),
    CONSTRAINT user_id FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE comments_votes (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    comment_id uuid,
    user_id uuid,
    vote_status INT CHECK (vote_status = 1 OR vote_status = -1) NOT NULL,
    CONSTRAINT comment_id FOREIGN KEY(comment_id) REFERENCES comments(id),
    CONSTRAINT user_id FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON comments
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