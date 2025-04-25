import { faker } from "@faker-js/faker";
import prisma from "./prisma.js";

function createRandomUser() {
  return {
    id: faker.string.uuid(),
    image: faker.image.avatar(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
  };
}

async function seedUsers(count) {
  let usersCreated = 0;

  for (let i = 0; i < count; i++) {
    const user = createRandomUser();
    try {
      await prisma.user.create({
        data: user,
      });

      usersCreated++;
    } catch (error) {
      console.error(`Error creating user ${i + 1}:`, error);
    }
  }

  console.log("Total users created:", usersCreated);
}

// Seed 10 users
seedUsers(10);
