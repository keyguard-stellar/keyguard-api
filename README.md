# keyguard-api

> The REST API powering KeyGuard — a multi-sig key management and account recovery platform built on the Stellar blockchain.

---

## Overview

`keyguard-api` is the backend service for KeyGuard. It handles all business logic between the frontend and the Stellar blockchain — including SEP-10 authentication, key record management, multi-signature configuration, guardian management, account recovery orchestration, and immutable audit logging. It communicates with `keyguard-contract` on-chain for trustless enforcement of key ownership and recovery rules.

This repo is part of the KeyGuard monorepo ecosystem:

| Repo | Description |
|---|---|
| [keyguard-app](https://github.com/keyguard-stellar/keyguard-app) | Next.js frontend |
| **keyguard-api** | NestJS REST API (this repo) |
| [keyguard-contract](https://github.com/keyguard-stellar/keyguard-contract) | Soroban smart contract |

---

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** Stellar SEP-10 + JWT (access + refresh tokens)
- **Validation:** class-validator, class-transformer
- **Security:** Helmet, @nestjs/throttler (rate limiting)

---

## Features

- SEP-10 challenge generation and signature verification
- JWT issuance and refresh token rotation
- Key record CRUD — store, label, and soft-delete Stellar key metadata
- Multi-signature configuration — store co-signer lists and threshold settings
- Guardian management — designate trusted recovery accounts per user
- Account recovery orchestration — request, approve, and auto-expire recovery flows
- Stellar transaction building — construct SetOptions transactions for on-chain submission
- Immutable audit logging — track all sensitive operations with actor, action, and IP
- Rate limiting on auth endpoints, security headers on all responses

---

## Project Structure

```
keyguard-api/
├── src/
│   ├── app.module.ts               # Root application module
│   ├── main.ts                     # Bootstrap with Helmet, pipes, filters
│   ├── config/
│   │   ├── database.config.ts      # TypeORM PostgreSQL configuration
│   │   └── env.validation.ts       # Environment variable validation schema
│   ├── auth/                       # SEP-10 auth module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts         # Challenge generation + JWT issuance
│   │   ├── auth.controller.ts      # POST /auth/challenge, /auth/verify
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts     # Passport JWT strategy
│   │   └── dto/
│   ├── keys/                       # Key record management
│   │   ├── keys.module.ts
│   │   ├── keys.service.ts
│   │   ├── keys.controller.ts      # GET/POST/PATCH/DELETE /keys
│   │   ├── keys.repository.ts
│   │   └── entities/
│   │       └── key-record.entity.ts
│   ├── multisig/                   # Multi-sig configuration
│   │   ├── multisig.module.ts
│   │   ├── multisig.service.ts
│   │   ├── multisig.controller.ts  # GET/POST /multisig/config
│   │   └── entities/
│   ├── recovery/                   # Account recovery flow
│   │   ├── recovery.module.ts
│   │   ├── recovery.service.ts
│   │   ├── recovery.controller.ts  # POST /recovery/request, /recovery/:id/approve
│   │   ├── recovery.scheduler.ts   # Cron: auto-expire pending requests
│   │   └── entities/
│   ├── stellar/                    # Stellar SDK wrapper
│   │   ├── stellar.module.ts
│   │   ├── stellar.service.ts      # Transaction builders + submission
│   │   ├── stellar.types.ts
│   │   └── stellar.errors.ts
│   ├── audit/                      # Audit logging
│   │   ├── audit.module.ts
│   │   ├── audit.service.ts
│   │   ├── audit.controller.ts     # GET /audit-logs
│   │   ├── interceptors/
│   │   │   └── audit.interceptor.ts
│   │   └── entities/
│   └── common/                     # Shared utilities
│       ├── filters/
│       │   └── http-exception.filter.ts
│       └── pipes/
│           └── validation.pipe.ts
├── migrations/                     # TypeORM migrations
├── test/                           # E2E test suites
│   ├── auth.e2e-spec.ts
│   ├── keys.e2e-spec.ts
│   ├── recovery.e2e-spec.ts
│   └── fixtures/
├── .env.example
└── jest-e2e.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally or via Docker
- A Stellar keypair for the server (generate one on [Stellar Laboratory](https://laboratory.stellar.org))

### Installation

```bash
git clone https://github.com/keyguard-stellar/keyguard-api.git
cd keyguard-api
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

```env
# App
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=keyguard

# JWT
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Stellar
STELLAR_NETWORK=testnet
STELLAR_SERVER_PUBLIC_KEY=G...
STELLAR_SERVER_SECRET_KEY=S...
```

### Database Setup

```bash
# Start PostgreSQL via Docker
docker run --name keyguard-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=keyguard -p 5432:5432 -d postgres:14

# Run migrations
npm run migration:run
```

### Development

```bash
npm run start:dev
```

API will be available at `http://localhost:3001`. Health check: `GET /health`.

### Build

```bash
npm run build
npm run start:prod
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/challenge` | Generate SEP-10 challenge XDR | No |
| POST | `/auth/verify` | Verify signed XDR, receive JWT | No |

### Keys

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/keys` | List all keys for authenticated user | Yes |
| POST | `/keys` | Register a new key record | Yes |
| PATCH | `/keys/:id` | Update key label | Yes |
| DELETE | `/keys/:id` | Soft-delete a key record | Yes |

### Multi-Sig

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/multisig/config/:accountId` | Get multi-sig config for an account | Yes |
| POST | `/multisig/config` | Save multi-sig configuration | Yes |

### Recovery

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/recovery/request` | Initiate a recovery request | No |
| POST | `/recovery/:id/approve` | Approve a recovery request | Yes |
| POST | `/recovery/:id/reject` | Reject a recovery request | Yes |

### Audit

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/audit-logs` | Get paginated audit log for user | Yes |

---

## Running Tests

```bash
# Unit tests
npm run test

# E2E integration tests (requires running Postgres)
npm run test:e2e

# Coverage report
npm run test:cov
```

---

## Contributing

This repository participates in the **Stellar Wave Program** on Drips Wave. Contributors can pick up scoped issues during active Wave cycles and earn points for merged work.

### How to contribute

1. Browse open issues labeled `Stellar Wave` in this repository.
2. Apply to work on an issue via the [Drips Wave app](https://wave.drips.network).
3. Wait for the maintainer to assign you.
4. Fork the repo, create a branch named `feat/KG-API-XXX-short-description`, and open a PR against `main`.

### Branch naming

```
feat/KG-API-002-sep10-auth
fix/KG-API-006-recovery-expiry-cron
docs/KG-API-008-audit-log-readme
```

### Pull Request checklist

- [ ] TypeScript compiles with zero errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Unit tests pass (`npm run test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] New endpoints have DTO validation and Swagger decorators
- [ ] PR description references the issue number (e.g. `Closes KG-API-003`)

---

## Issue Complexity & Points

| Label | Complexity | Points |
|---|---|---|
| `complexity: trivial` | Config, security headers, scaffolding | 100 pts |
| `complexity: medium` | CRUD endpoints, entities, migrations | 150 pts |
| `complexity: high` | SEP-10, Stellar tx building, recovery flow | 200 pts |

---

## License

MIT — see [LICENSE](./LICENSE) for details.