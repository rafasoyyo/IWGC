# IWGC Lab Result Processing (NestJS + Hexagonal + BullMQ + Mongo)

This project aims to be a solution to enqueue incoming lab results, process them asynchronously with retries and a dead‑letter queue, and log key actions. Built with NestJS, BullMQ (Redis), and MongoDB, structured with a hexagonal architecture (domain / application / infrastructure / interfaces).

## Run (Docker)

```bash
cp .env.example .env
docker compose up --build
```

API at `http://localhost:3000`

## Run (locally)

Requires: Node 20+, Redis, Mongo

```bash
cp .env.example .env
# Optionally edit to point at your local Redis/Mongo
npm i
npm run start:dev
```

## Endpoints

- `POST /lab-results` – enqueue a lab result
- `GET /status` – simple counts of processed / failed / dead-lettered jobs

## Notes

- Retries: 3 attempts with exponential backoff (500ms base). On final failure, the payload is pushed to a dedicated `dead-letter` queue and the Mongo document is marked `dead-lettered`.
- The worker simulates transient failures randomly (20% chance) and a small processing delay.
- Logging is structured with consistent context tags.


## Extras added
- **Swagger UI** at `/docs` (OpenAPI generated automatically).
- **Health checks** at `/health` using Nest Terminus (checks Mongo + Redis connection).
- **Simple dashboard** at `/` — static single-page app that shows counts from `/status` and a short job activity log.

## Swagger
The OpenAPI UI is available at `http://localhost:3000/docs` after running.

## Health
`GET /health` returns liveness and readiness checks for Mongo and Redis.

## Dashboard
Visit `http://localhost:3000/` to see a minimal dashboard that polls `/status` every 5 seconds.
