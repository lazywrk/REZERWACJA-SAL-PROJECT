FROM clojure:temurin-21-lein

WORKDIR /app

COPY . .

RUN lein deps

EXPOSE 5001

CMD ["lein", "run"]