postgres=# create TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);
postgres=# insert into blogs (author, url, title, likes) values ('Bob Smith', 'www.url.com', 'test-blog-2', 7);
postgres=# insert into blogs (author, url, title, likes) values ('Joe Doe', 'www.example.com', 'test-blog-1', 12);

postgres=# select * from blogs;
 id |  author   |       url       |    title    | likes
----+-----------+-----------------+-------------+-------
  1 | Bob Smith | www.url.com     | test-blog-2 |     7
  2 | Joe Doe   | www.example.com | test-blog-1 |    12
(2 rows)