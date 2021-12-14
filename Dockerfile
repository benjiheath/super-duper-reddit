FROM postgres
ENV POSTGRES_PASSWORD $LOCAL_DB_PW
ENV POSTGRES_DB srdb
ENV POSTGRES_HOST_AUTH_METHOD trust
COPY srdb.sql /docker-entrypoint-initdb.d/