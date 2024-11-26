FROM ghcr.io/vadosware/pg_idkit:0.2.4-pg15.8-alpine3.20.3-amd64

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

CMD ["postgres"]
