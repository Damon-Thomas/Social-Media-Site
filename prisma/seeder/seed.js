import { faker } from "@faker-js/faker";
import prisma from "./prisma.js";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  // 1. Create 50 users
  const users = [];
  for (let i = 0; i < 50; i++) {
    // Determine gender first
    const gender = Math.random() > 0.5 ? "male" : "female";

    // Generate name and avatar based on the same gender
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    // Generate a random avatar URL
    const avatar =
      gender === "male"
        ? `https://randomuser.me/api/portraits/men/${getRandomInt(1, 99)}.jpg`
        : `https://randomuser.me/api/portraits/women/${getRandomInt(
            1,
            99
          )}.jpg`;

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: faker.internet.email({ firstName, lastName }),
        image: avatar,
        password: faker.internet.password(),
      },
    });
    users.push(user);
  }

  // 2. Each user makes 1-3 posts
  const posts = [];
  for (const user of users) {
    const numPosts = getRandomInt(1, 3);
    for (let i = 0; i < numPosts; i++) {
      const post = await prisma.post.create({
        data: {
          content: faker.lorem.paragraph(),
          author: {
            connect: { id: user.id },
          },
        },
      });
      posts.push(post);
    }
  }

  // 3. Each user makes 3-5 comments on random posts
  const comments = [];
  for (const user of users) {
    const numComments = getRandomInt(3, 5);
    for (let i = 0; i < numComments; i++) {
      const post = posts[getRandomInt(0, posts.length - 1)];
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          author: {
            connect: { id: user.id },
          },
          post: {
            connect: { id: post.id },
          },
        },
      });
      comments.push(comment);
    }
  }

  // 4. Each user makes 5-7 comments on random comments
  const replyComments = [];
  for (const user of users) {
    const numReplies = getRandomInt(5, 7);
    for (let i = 0; i < numReplies; i++) {
      const parentComment = comments[getRandomInt(0, comments.length - 1)];
      const reply = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          author: {
            connect: { id: user.id },
          },
          post: {
            connect: { id: parentComment.postId },
          },
          parent: {
            connect: { id: parentComment.id },
          },
        },
      });
      replyComments.push(reply);
    }
  }

  // 5. Each user likes 3-7 random posts
  for (const user of users) {
    const likedPosts = new Set();
    const numLikes = getRandomInt(3, 7);
    for (let i = 0; i < numLikes; i++) {
      let post;
      do {
        post = posts[getRandomInt(0, posts.length - 1)];
      } while (likedPosts.has(post.id));
      likedPosts.add(post.id);
      await prisma.post.update({
        where: { id: post.id },
        data: { likedBy: { connect: { id: user.id } } },
      });
    }
  }

  // 6. Each user likes 9-12 random comments
  const allComments = comments.concat(replyComments);
  for (const user of users) {
    const likedComments = new Set();
    const numLikes = getRandomInt(9, 12);
    for (let i = 0; i < numLikes; i++) {
      let comment;
      do {
        comment = allComments[getRandomInt(0, allComments.length - 1)];
      } while (likedComments.has(comment.id));
      likedComments.add(comment.id);
      await prisma.comment.update({
        where: { id: comment.id },
        data: { likedBy: { connect: { id: user.id } } },
      });
    }
  }

  // 7. Each user follows 11-18 other users
  for (const user of users) {
    const following = new Set();
    const numFollows = getRandomInt(11, 18);
    while (following.size < numFollows) {
      const other = users[getRandomInt(0, users.length - 1)];
      if (other.id !== user.id && !following.has(other.id)) {
        following.add(other.id);
        await prisma.user.update({
          where: { id: user.id },
          data: { following: { connect: { id: other.id } } },
        });
      }
    }
  }

  // 8. Each user sends 5-10 friend requests
  for (const user of users) {
    const sent = new Set();
    const numRequests = getRandomInt(5, 10);
    while (sent.size < numRequests) {
      const other = users[getRandomInt(0, users.length - 1)];
      if (other.id !== user.id && !sent.has(other.id)) {
        sent.add(other.id);
        await prisma.user.update({
          where: { id: user.id },
          data: { friendRequestsSent: { connect: { id: other.id } } },
        });
      }
    }
  }

  // 9. Each user accepts 66% of their friend requests received
  for (const user of users) {
    const received = await prisma.user.findUnique({
      where: { id: user.id },
      include: { friendRequestsReceived: true },
    });
    if (received && received.friendRequestsReceived.length > 0) {
      const toAccept = received.friendRequestsReceived.slice(
        0,
        Math.floor(received.friendRequestsReceived.length * 0.66)
      );
      for (const requester of toAccept) {
        await prisma.user.update({
          where: { id: user.id },
          data: { friends: { connect: { id: requester.id } } },
        });
      }
    }
  }

  // 10. Each user updates their profile
  for (const user of users) {
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        bio: faker.lorem.sentences(2),
      },
      create: {
        userId: user.id,
        bio: faker.lorem.sentences(2),
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
