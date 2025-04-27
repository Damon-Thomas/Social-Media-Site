import { faker } from "@faker-js/faker";
import prisma from "./prisma.js";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper functions for more realistic content generation
function generateTechPost() {
  const techTopics = [
    "React",
    "Next.js",
    "TypeScript",
    "GraphQL",
    "Prisma",
    "Tailwind CSS",
    "AI",
    "Cloud Computing",
  ];
  const techTopic = techTopics[getRandomInt(0, techTopics.length - 1)];

  return `I've been working with ${techTopic} recently. ${faker.lorem.paragraph(
    1
  )}
  
  ${faker.lorem.paragraph(1)}
  
  Has anyone else experienced ${faker.hacker.phrase()} when using ${techTopic}?`;
}

function generateLifeUpdate() {
  const events = [
    "moving to a new city",
    "starting a new job",
    "learning a new skill",
    "adopting a pet",
    "traveling",
  ];
  const event = events[getRandomInt(0, events.length - 1)];

  return `${faker.lorem.sentence()} I've been ${event} lately and ${faker.lorem.paragraph(
    1
  )}
  
  ${faker.lorem.paragraph(getRandomInt(1, 2))}
  
  ${faker.word.words(4)}!`;
}

function generateQuestion() {
  const questionTypes = [
    "What's your take on",
    "How do you handle",
    "Does anyone have advice about",
    "I'm curious about your experience with",
    "What would you recommend for",
  ];
  const topic = faker.company.buzzPhrase();
  const questionType = questionTypes[getRandomInt(0, questionTypes.length - 1)];

  return `${questionType} ${topic}?
  
  ${faker.lorem.paragraph(getRandomInt(1, 2))}
  
  I'd love to hear your thoughts!`;
}

function generateComment() {
  const commentTypes = [
    // Agreement comments
    `Absolutely! ${faker.lorem.sentence()}`,
    `I couldn't agree more. ${faker.lorem.sentence()}`,
    `You're right about that. ${faker.lorem.sentence()}`,

    // Question comments
    `Interesting point. Have you considered ${faker.company.buzzPhrase()}?`,
    `That makes me wonder about ${faker.lorem.sentence()}`,

    // Experience sharing
    `I had a similar experience with ${faker.word.words(
      3
    )}. ${faker.lorem.sentence()}`,
    `This reminds me of when I ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()}. ${faker.lorem.sentence()}`,

    // Opinion
    `I think ${faker.lorem.paragraph(1)}`,
    `In my opinion, ${faker.lorem.paragraph(1)}`,

    // Disagreement (polite)
    `I see your point, but ${faker.lorem.sentence()}`,
    `That's one way to look at it. However, ${faker.lorem.sentence()}`,
  ];

  const commentType = commentTypes[getRandomInt(0, commentTypes.length - 1)];
  return commentType;
}

function generateReply() {
  const replyTypes = [
    // Appreciation
    `Thanks for your input! ${faker.lorem.sentence()}`,
    `I appreciate your perspective. ${faker.lorem.sentence()}`,

    // Follow-up questions
    `That's interesting, but what about ${faker.company.buzzPhrase()}?`,
    `Good point! Do you also think ${faker.lorem.sentence()}`,

    // Agreement
    `Exactly what I was thinking. ${faker.lorem.sentence()}`,
    `You nailed it. ${faker.lorem.sentence()}`,

    // Elaboration
    `To add to that, ${faker.lorem.paragraph(1)}`,
    `Just to clarify, ${faker.lorem.paragraph(1)}`,
  ];

  const replyType = replyTypes[getRandomInt(0, replyTypes.length - 1)];
  return replyType;
}

function createRandomUser() {
  const gender = Math.random() > 0.5 ? "male" : "female";

  // Generate name and avatar based on the same gender
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;

  // Generate a random avatar URL
  const avatar =
    gender === "male"
      ? `https://randomuser.me/api/portraits/men/${getRandomInt(1, 99)}.jpg`
      : `https://randomuser.me/api/portraits/women/${getRandomInt(1, 99)}.jpg`;
  return {
    firstName,
    lastName,
    fullName,
    avatar,
    email: faker.internet.email({ firstName, lastName }),
    password: "12345678",
  };
}

// Add this new function for generating realistic bios
function generateRealisticBio() {
  const templates = [
    // Professional templates
    () => {
      const profession = faker.person.jobTitle();
      const company = faker.company.name();
      const years = getRandomInt(2, 15);
      const interests = [
        faker.word.adjective(),
        faker.word.adjective(),
        faker.word.adjective(),
      ].join(", ");
      const personalNote = faker.lorem.sentences(2);

      return `${profession} at ${company} with ${years} years of experience. Passionate about ${interests} projects. ${personalNote} Currently based in ${faker.location.city()}, ${faker.location.country()}.`;
    },

    // Student/Academic templates
    () => {
      const fields = [
        "Computer Science",
        "Business",
        "Psychology",
        "Engineering",
        "Biology",
        "Literature",
        "Physics",
        "Art History",
        "Mathematics",
        "Law",
        "Medicine",
        "Economics",
      ];
      const field = fields[getRandomInt(0, fields.length - 1)];
      const university = faker.company.name() + " University";
      const year = [
        "freshman",
        "sophomore",
        "junior",
        "senior",
        "graduate student",
        "PhD candidate",
      ][getRandomInt(0, 5)];
      const hobbies = faker.word.words(3);

      return `${
        year.charAt(0).toUpperCase() + year.slice(1)
      } studying ${field} at ${university}. ${faker.lorem.sentences(
        2
      )} When I'm not studying, you'll find me ${faker.hacker.verb()}ing ${hobbies}. Let's connect!`;
    },

    // Creative templates
    () => {
      const creativity = [
        "writer",
        "photographer",
        "designer",
        "artist",
        "musician",
        "filmmaker",
      ][getRandomInt(0, 5)];
      const style = faker.word.adjective();
      const achievement = faker.company.buzzPhrase();

      return `${
        style.charAt(0).toUpperCase() + style.slice(1)
      } ${creativity} with a passion for creating ${faker.word.adjective()} content. ${faker.lorem.sentences(
        1
      )} Recently completed a project on ${achievement}. ${faker.lorem.sentences(
        1
      )} Always looking to collaborate on interesting projects!`;
    },

    // Traveler/Explorer templates
    () => {
      const countries = getRandomInt(3, 25);
      const nextDestination = faker.location.country();
      const philosophy = faker.lorem.sentences(2);

      return `Explorer at heart. Visited ${countries} countries and counting! Next stop: ${nextDestination}. ${philosophy} Passionate about ${faker.word.words(
        3
      )} and ${faker.word.words(2)}. Let's share travel stories!`;
    },
  ];

  // Pick a random template and generate bio
  const templateFn = templates[getRandomInt(0, templates.length - 1)];
  const bio = templateFn();

  // Ensure bio is between 200-500 characters
  if (bio.length < 200) {
    return (
      bio + " " + faker.lorem.sentences(Math.ceil((200 - bio.length) / 70))
    );
  } else if (bio.length > 500) {
    return bio.slice(0, 497) + "...";
  }

  return bio;
}

async function main() {
  // 1. Create 50 users
  const powerUserData = createRandomUser();
  // Create the power user in the database first
  const powerUser = await prisma.user.create({
    data: {
      name: powerUserData.fullName,
      email: powerUserData.email,
      image: powerUserData.avatar,
      password: powerUserData.password,
    },
  });

  const users = [];
  for (let i = 0; i < 50; i++) {
    // Determine gender first
    const person = createRandomUser();

    const user = await prisma.user.create({
      data: {
        name: person.fullName,
        email: person.email,
        image: person.avatar,
        password: person.password,
      },
    });
    users.push(user);
  }

  // 2. Each user makes posts
  const posts = [];
  async function postMaker(id) {
    // Create more realistic post content
    const postType = Math.random();
    let content;

    if (postType < 0.33) {
      content = generateTechPost();
    } else if (postType < 0.66) {
      content = generateLifeUpdate();
    } else {
      content = generateQuestion();
    }

    return await prisma.post.create({
      data: {
        content: content,
        author: {
          connect: { id: id },
        },
      },
    });
  }
  for (let i = 0; i < 20; i++) {
    const post = await postMaker(powerUser.id);
    posts.push(post);
  }

  for (const user of users) {
    const numPosts = getRandomInt(5, 7);
    for (let i = 0; i < numPosts; i++) {
      const post = await postMaker(user.id);
      posts.push(post);
    }
  }

  // 3. Each user makes comments on random posts
  const comments = [];
  for (const user of users) {
    const numComments = getRandomInt(6, 10);
    for (let i = 0; i < numComments; i++) {
      const post = posts[getRandomInt(0, posts.length - 1)];
      const comment = await prisma.comment.create({
        data: {
          content: generateComment(),
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
          content: generateReply(),
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

  // 5. Each user likes 10-17 random posts
  for (const user of users) {
    const likedPosts = new Set();
    const numLikes = getRandomInt(10, 17);
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
    const numLikes = getRandomInt(15, 22);
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

  // 7. Each user follows 23-34 other users
  for (const user of users) {
    const following = new Set();
    const numFollows = getRandomInt(23, 34);
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

  // 8. Each user sends friend requests
  for (const user of users) {
    const sent = new Set();
    const numRequests = getRandomInt(10, 20);
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

  // 10. Each user updates their profile bio (directly on User model)
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        bio: generateRealisticBio(),
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
