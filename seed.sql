INSERT INTO users (username, email, password) VALUES ('testuser', 'test@gmail.com', 'password');

INSERT INTO threads (title, body, creator_user_id) VALUES ('title', 'body', 1);

INSERT INTO posts (thread_id, body, creator_user_id) VALUES (1, 'testreply', 1);

INSERT INTO posts (thread_id, body, creator_user_id, parent_post_id) VALUES (1, 'test-child-reply', 1, 1);

SELECT * FROM posts;