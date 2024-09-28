# LMS Platform: Next.js 13, React, Prisma, MySQL, Tailwind

This is a repository for my Master's Thesis Project, titled "Development of an online learning platform for training IT specialists" (2024)

In today's world, where speed and mobility are key factors, the education sector needs new approaches to learning, especially in the field of information technology (IT). Web-based applications fit perfectly into this concept, as they provide access to up-to-date educational materials from any device that has a web browser. In this paper, the project under development is open source, which allows other developers to improve it and higher education institutions to use it absolutely free of charge. It is also a ready-made solution that does not require complex settings and is easy to use.

The project is based on the following course: https://www.youtube.com/watch?v=Big_aFLmekI

### Key Features

- Browse & Filter Courses
- Student & Teacher dashboards
- Progress tracking of each course
- Create and edit courses as a teacher
- Live support chat based on ChatGPT API for the students
- Thumbnails, attachments and videos uploading using UploadThing
- Tests with multiple-choice questions after finishing the course

### App previews

![Screenshot 2024-02-18 at 01 12 42](https://github.com/TionCada/learning-platform/assets/71350925/a3bf449e-187a-462d-8e1b-83ad2ed5c441)

![Screenshot 2024-02-18 at 01 12 28](https://github.com/TionCada/learning-platform/assets/71350925/a524be25-1470-4c3c-8366-a0e1c0ca7f84)

### Prerequisites

**Node version 18.x.x**

### Install packages

```shell
npm i
```

### Setup .env file

```js
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
OPENAI_API_KEY=

NEXT_PUBLIC_TEACHER_ID=
```

### Setup Prisma

Add MySQL Database (I used PlanetScale)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

| command             | description                                            |
| :------------------ | :----------------------------------------------------- |
| `npm run dev`       | Starts a development instance of the app               |
| `npx prisma studio` | Starts a a visual editor for the data in your database |
