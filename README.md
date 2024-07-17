<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Name

# Social Auth - Nest.js Backend

## Description

This project serves as the backend for a social media application built using Nest.js. It provides robust authentication functionalities, including social authentication via Google and Facebook, JWT-based authentication, account linking, and user profile management.

## Project Structure

```
src
├── enums
│ ├── dependency-tokens.enum.ts
│ ├── email-subject-keys.enum.ts
│ ├── error-messages.enum.ts
│ ├── response-messages.enum.ts
│ └── roles.enum.ts
├── filters
│ └── all-exceptions.filter.ts
├── helper
│ └── auth.helper.ts
├── i18n
│ ├── en
│ │ └── en.json
│ ├── fr
│ │ └── fr.json
│ └── i18n.module.ts
├── interceptors
│ ├── i18n.interceptor.ts
│ ├── logging.interceptor.ts
│ └── transaction.interceptor.ts
├── interfaces
│ ├── email.interface.ts
│ ├── mongoose.interface.ts
│ ├── pagination.interface.ts
│ └── response.interface.ts
├── modules
│ ├── auth
│ │ ├── decorators
│ │ │ ├── roles.decorator.ts
│ │ │ └── user.decorator.ts
│ │ ├── dtos
│ │ │ ├── forgot-password.dto.ts
│ │ │ ├── identify.dto.ts
│ │ │ ├── login.dto.ts
│ │ │ ├── register.dto.ts
│ │ │ ├── reset-password.dto.ts
│ │ │ └── verify-email.dto.ts
│ │ ├── interface
│ │ │ ├── auth-token.interface.ts
│ │ │ ├── auth-user.interface.ts
│ │ │ └── login.interface.ts
│ │ ├── auth.controller.ts
│ │ ├── auth.guard.ts
│ │ ├── auth.module.ts
│ │ └── auth.service.ts
│ ├── common
│ │ ├── services
│ │ │ ├── email.service.ts
│ │ │ └── s3.service.ts
│ │ └── common.module.ts
│ ├── database
│ │ ├── database.module.ts
│ │ └── database.provider.ts
│ ├── social-auth
│ │ ├── dtos
│ │ │ └── link-account.dto.ts
│ │ ├── enums
│ │ │ ├── providers.enum.ts
│ │ │ └── steps.enum.ts
│ │ ├── guards
│ │ │ └── google-auth.guard.ts
│ │ ├── strategies
│ │ │ └── google.strategy.ts
│ │ ├── social-auth.controller.ts
│ │ ├── social-auth.module.ts
│ │ └── social-auth.service.ts
│ ├── user
│ │ ├── dtos
│ │ │ ├── file-upload.dto.ts
│ │ │ ├── update-password.dto.ts
│ │ │ └── update-profile.dto.ts
│ │ ├── user.controller.ts
│ │ ├── user.model.ts
│ │ ├── user.module.ts
│ │ └── user.service.ts
├── templates
│ ├── forgot-password.ts
│ ├── password-reset-confirmation.ts
│ ├── registration.ts
│ ├── resendOTP.ts
│ ├── template.ts
│ └── welcome.ts
├── transformers
│ ├── model.transformer.ts
│ ├── mongoose.transformer.ts
│ └── validation.transformer.ts
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## Features

- **User Authentication**: Register, login, and manage user sessions using JWT.
- **Password Management**: Allow users to reset and update their passwords securely.
- **Email Verification**: Verify user emails using OTP for enhanced security.
- **Social Authentication with Google**: Authenticate users using their Google accounts.
- **Link-Account Feature with OTP**: Enable users to link multiple accounts with OTP verification.
- **Send Email via HTML Jinja Template**: Send formatted emails using HTML templates rendered with Jinja2.
- **User Update Profile**: Allow users to update their profile information.
- **User Update Password**: Provide functionality for users to update their passwords.
- **Get Authenticated User via User Decorator**: Retrieve authenticated user details using a custom decorator.

## Installation

To get started with the Social Auth backend, follow these steps:

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Renesis-Tech-Inc/nest-sso-auth.git
   cd nest-sso-auth
   yarn
   yarn start:dev
   ```

## API Documentation

API documentation is available at /docs.

## Technologies Used

The Social Auth backend is built using the following technologies:

- **Nest.js**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB**: A document-based NoSQL database for storing application data.

These technologies were chosen for their flexibility, scalability, and performance, allowing the Social Auth backend to efficiently handle text extraction tasks and manage user data.

## System Overview

## Docker commands:
- Build the Docker image:
        ```sh
        make docker-build
        ```
    - Run the Docker container:
        ```sh
        make docker-run
        ```
    - Stop the Docker container:
        ```sh
        make docker-stop
        ```
    - Remove the Docker container:
        ```sh
        make docker-remove
        ```
    - Clean up Docker images:
        ```sh
        make docker-clean
        ```
    - Rebuild and run the Docker container:
        ```sh
        make docker-rebuild
        ```


## Usage

Social Authentication: Visit the /auth/google or /auth/facebook endpoints to initiate the authentication flow with Google or Facebook.
JWT Authentication: Use the /auth/login endpoint with valid credentials to obtain a JWT token for subsequent requests.
Account Linking: Implement endpoints to link additional social accounts to a user's main account using the provided functionality.
User Profile Management: Utilize the /users/profile endpoint to update user profile information as needed.

### Roles

- **End User**: user can login/signup with custom email, password and also social auth like google, facebook.

## System Architecture

Our system architecture is designed for scalability, reliability, and performance. We follow a monolithic-based architecture for modular development and easy maintenance.

## Contributing

Contributions to Social Auth are welcome! Please refer to the [contribution guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
