
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="images/logo.png" alt="Logo" width="340" height="80">

  <h3 align="center">Only Foods - Back End</h3>

  <p align="center">
    This is the back end of the Only Foods project, a web application that allows users to share thoughts, recipes, and chat with each other about food.
    <br />
    <a href="https://github.com/TiagoRibeiro25/Only-Foods-Docs"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://onlyfoods.netlify.app/">View Demo</a>
    ·
    <a href="https://github.com/TiagoRibeiro25/Only-Foods-BE/issues">Report Bug</a>
    ·
    <a href="https://github.com/TiagoRibeiro25/Only-Foods-BE/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
       <li><a href="#prepare-for-production">Prepare for production</a></li>
      </ul>
    </li>
   <li><a href="#documentation">Documentation</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://onlyfoods.netlify.app/)

Only Foods is a web application that allows users to share thoughts, recipes, and chat with each other about food.

This project was made as a side project to elevate my skills in Prisma and Typescript. It was made fully alone, from the design to the deployment.

### Built With

* [Nodejs](https://nodejs.org/en)
* [Express](https://expressjs.com/)
* [Typescript](https://www.typescriptlang.org/)
* [Prisma](https://www.prisma.io/)
* [Socket.io](https://socket.io/)
* [Cloudinary](https://cloudinary.com/)
* [Mailjet](https://www.mailjet.com/)
* [PostgreSQL](https://www.postgresql.org/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

In order to run this project, you need to have installed

* Nodejs
* npm

You also need to have access to the a:

* PostgreSQL database
* MongoDB database
* Redis database
* Cloudinary account
* Mailjet account

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/TiagoRibeiro25/Only-Foods-BE.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Create a .env file, add the variables in the .env.sample file and fill them with your own values. The .env file should have the following variables:

   ```js
   PORT
   ENABLE_LOGGING
   JWT_SECRET
   JWT_EXPIRES_IN
   JWT_EXPIRES_IN_REMEMBER_ME
   JWT_GENERATE_TOKEN_IN
   MAILJET_URL
   MAILJET_PUBLIC_KEY
   MAILJET_SECRET_KEY
   MAILJET_FROM_EMAIL
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   DATABASE_URL
   MONGO_DB_URL
   MONGO_DB_NAME
   REDIS_URL
   ```

4. Run the migrations

   ```sh
   npx prisma migrate dev --name init
   ```

5. Generate the Prisma client

   ```sh
   npx prisma generate
   ```

6. Run the project

   ```sh
   npm run dev
   ```

<!-- Production -->
## Prepare for production

1. Install NPM packages (if you haven't already)

   ```sh
   npm install
   ```

2. Build the project

   ```sh
   npm run build
   ```

3. Set the NODE_ENV variable to production and the rest of the variables in the .env file

4. Run the project

   ```sh
   npm start
   ```

<!-- Documentation -->
## Documentation

All the documentation can be found [here](https://github.com/TiagoRibeiro25/Only-Foods-Docs).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Contact section of my personal website:
[tiagoribeiro.tech](https://tiagoribeiro.tech/)

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/TiagoRibeiro25/Only-Foods-BE.svg?style=for-the-badge
[contributors-url]: https://github.com/TiagoRibeiro25/Only-Foods-BE/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/TiagoRibeiro25/Only-Foods-BE.svg?style=for-the-badge
[forks-url]: https://github.com/TiagoRibeiro25/Only-Foods-BE/network/members
[stars-shield]: https://img.shields.io/github/stars/TiagoRibeiro25/Only-Foods-BE.svg?style=for-the-badge
[stars-url]: https://github.com/TiagoRibeiro25/Only-Foods-BE/stargazers
[issues-shield]: https://img.shields.io/github/issues/TiagoRibeiro25/Only-Foods-BE.svg?style=for-the-badge
[issues-url]: https://github.com/TiagoRibeiro25/Only-Foods-BE/issues
[license-shield]: https://img.shields.io/github/license/TiagoRibeiro25/Only-Foods-BE.svg?style=for-the-badge
[license-url]: https://github.com/TiagoRibeiro25/Only-Foods-BE/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
