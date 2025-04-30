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

// Modify the generateSuperUserBio function to limit bio to 500 characters
function generateSuperUserBio() {
  const profession = faker.person.jobTitle();
  const mainCompany = faker.company.name();
  const previousCompany = faker.company.name();
  const techSkills = Array(5)
    .fill()
    .map(() => faker.hacker.noun())
    .join(", ");
  // const hobbies = Array(4)
  //   .fill()
  //   .map(() => faker.word.words(2))
  //   .join(", ");
  const countries = getRandomInt(15, 30);

  let bio = `Senior ${profession} at ${mainCompany} with over 15 years of experience in the industry. Previously led teams at ${previousCompany} where I developed expertise in ${techSkills}. 
  
  I've traveled to ${countries} countries across 6 continents, documenting my experiences through writing and photography. I'm passionate about mentoring junior developers and regularly speak at industry conferences about emerging technologies and career growth.`;

  //  I publish weekly articles on modern development practices and maintain several popular open-source projects with over 10k stars on GitHub. Let's connect if you're interested in collaboration or just want to chat about ${faker.hacker.noun()} or ${faker.hacker.noun()}!`;

  // Enforce bio length to be at most 500 characters
  if (bio.length > 500) {
    bio = bio.slice(0, 497) + "...";
  }
  return bio;
}

async function main() {
  // 1. Create super user with custom data
  const superUserData = {
    firstName: "Super",
    lastName: "User",
    fullName: "Super User",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    email: "super.user@example.com",
    password: "superuser",
  };

  // Create the super user in the database
  const superUser = await prisma.user.create({
    data: {
      name: superUserData.fullName,
      email: superUserData.email,
      image: superUserData.avatar,
      password: superUserData.password,
    },
  });

  // Create regular users as before
  const users = [];
  for (let i = 0; i < 50; i++) {
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

  // 2. Super user creates 50 posts (increased from 20)
  const posts = [];
  for (let i = 0; i < 50; i++) {
    // Mix of different post types for variety
    let content;
    const postType = i % 3;

    if (postType === 0) {
      content = generateTechPost();
    } else if (postType === 1) {
      content = generateLifeUpdate();
    } else {
      content = generateQuestion();
    }

    const post = await prisma.post.create({
      data: {
        content: content,
        author: { connect: { id: superUser.id } },
      },
    });
    posts.push(post);
  }

  // Regular users also create posts
  for (const user of users) {
    const numPosts = getRandomInt(5, 7);
    for (let i = 0; i < numPosts; i++) {
      const postType = Math.random();
      let content;

      if (postType < 0.33) {
        content = generateTechPost();
      } else if (postType < 0.66) {
        content = generateLifeUpdate();
      } else {
        content = generateQuestion();
      }

      const post = await prisma.post.create({
        data: {
          content: content,
          author: { connect: { id: user.id } },
        },
      });
      posts.push(post);
    }
  }

  // 3. Super user makes 100 comments on various posts
  const comments = [];
  const superUserComments = [];

  // Super user makes 100 comments
  for (let i = 0; i < 100; i++) {
    const post = posts[getRandomInt(0, posts.length - 1)];
    const comment = await prisma.comment.create({
      data: {
        content: generateComment(),
        author: { connect: { id: superUser.id } },
        post: { connect: { id: post.id } },
      },
    });
    superUserComments.push(comment);
    comments.push(comment);
  }

  // Regular users make comments
  for (const user of users) {
    const numComments = getRandomInt(10, 13);
    for (let i = 0; i < numComments; i++) {
      // 50% chance of commenting on a super user's post for higher engagement
      const postPool =
        Math.random() < 0.5
          ? posts.filter((post) => post.authorId === superUser.id)
          : posts;

      const post = postPool[getRandomInt(0, postPool.length - 1)];
      const comment = await prisma.comment.create({
        data: {
          content: generateComment(),
          author: { connect: { id: user.id } },
          post: { connect: { id: post.id } },
        },
      });
      comments.push(comment);
    }
  }

  // 4. Add replies to comments, with higher engagement on super user content
  const replyComments = [];

  // Each user replies to super user comments more frequently
  for (const user of users) {
    const numReplies = getRandomInt(10, 13);
    for (let i = 0; i < numReplies; i++) {
      // 60% chance of replying to a super user's comment
      const commentPool = Math.random() < 0.6 ? superUserComments : comments;

      const parentComment =
        commentPool[getRandomInt(0, commentPool.length - 1)];

      const reply = await prisma.comment.create({
        data: {
          content: generateReply(),
          author: { connect: { id: user.id } },
          post: { connect: { id: parentComment.postId } },
          parent: { connect: { id: parentComment.id } },
        },
      });
      replyComments.push(reply);
    }
  }

  // 5. Ensure super user's posts get more likes
  const allComments = comments.concat(replyComments);

  // All users like more of super user's posts
  for (const user of users) {
    // Get super user's posts
    const superUserPosts = posts.filter(
      (post) => post.authorId === superUser.id
    );

    // Like 70-90% of super user's posts
    const numSuperLikes = getRandomInt(
      Math.floor(superUserPosts.length * 0.7),
      Math.floor(superUserPosts.length * 0.9)
    );

    const likedPosts = new Set();

    // Like super user posts first
    for (let i = 0; i < numSuperLikes && i < superUserPosts.length; i++) {
      const post = superUserPosts[i];
      likedPosts.add(post.id);
      await prisma.post.update({
        where: { id: post.id },
        data: { likedBy: { connect: { id: user.id } } },
      });
    }

    // Then like some other random posts
    const totalLikes = getRandomInt(15, 22);
    for (let i = 0; i < totalLikes - numSuperLikes; i++) {
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

  // 5B. Super user likes some posts from others
  const nonSuperUserPosts = posts.filter(
    (post) => post.authorId !== superUser.id
  );
  const numLikesForSuperUser = getRandomInt(
    Math.floor(nonSuperUserPosts.length * 0.3),
    Math.floor(nonSuperUserPosts.length * 0.5)
  );
  const superUserLiked = new Set();
  for (let i = 0; i < numLikesForSuperUser; i++) {
    let post;
    do {
      post = nonSuperUserPosts[getRandomInt(0, nonSuperUserPosts.length - 1)];
    } while (superUserLiked.has(post.id));
    superUserLiked.add(post.id);
    await prisma.post.update({
      where: { id: post.id },
      data: { likedBy: { connect: { id: superUser.id } } },
    });
  }

  // 5C. Everyone likes some comments
  const allUsers = [...users, superUser];
  for (const user of allUsers) {
    // Each user likes between 3 and 7 comments
    const numCommentsToLike = getRandomInt(3, 7);
    const likedComments = new Set();
    for (let j = 0; j < numCommentsToLike; j++) {
      let comment;
      do {
        comment = comments[getRandomInt(0, comments.length - 1)];
      } while (likedComments.has(comment.id) || comment.authorId === user.id);
      likedComments.add(comment.id);
      await prisma.comment.update({
        where: { id: comment.id },
        data: { likedBy: { connect: { id: user.id } } },
      });
    }
  }

  // 6. Create following relationships (80-90% of users follow the super user)
  for (const user of users) {
    // 85% chance a user follows the super user
    if (Math.random() < 0.85) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          following: { connect: { id: superUser.id } },
        },
      });
    }

    // Each user also follows 10-20 random other users
    const numToFollow = getRandomInt(10, 20);
    const followedUsers = new Set();

    for (let i = 0; i < numToFollow; i++) {
      const potentialFollow = users[getRandomInt(0, users.length - 1)];

      // Don't follow yourself or the same person twice
      if (
        potentialFollow.id !== user.id &&
        !followedUsers.has(potentialFollow.id)
      ) {
        followedUsers.add(potentialFollow.id);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            following: { connect: { id: potentialFollow.id } },
          },
        });
      }
    }
  }

  // Super user follows back 30-40% of their followers
  const superUserFollowers = await prisma.user.findUnique({
    where: { id: superUser.id },
    include: { followers: true },
  });

  const numToFollowBack = getRandomInt(
    Math.floor(superUserFollowers.followers.length * 0.3),
    Math.floor(superUserFollowers.followers.length * 0.4)
  );

  const shuffledFollowers = [...superUserFollowers.followers].sort(
    () => 0.5 - Math.random()
  );

  for (let i = 0; i < numToFollowBack; i++) {
    await prisma.user.update({
      where: { id: superUser.id },
      data: {
        following: { connect: { id: shuffledFollowers[i].id } },
      },
    });
  }

  // 7. Create friend requests and friendships

  // 70% of users send friend requests to the super user
  const friendRequestUsers = [];
  for (const user of users) {
    if (Math.random() < 0.7) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          friendRequestsSent: { connect: { id: superUser.id } },
        },
      });
      friendRequestUsers.push(user);
    }
  }

  // Super user accepts 40-60% of friend requests
  const numToAccept = getRandomInt(
    Math.floor(friendRequestUsers.length * 0.4),
    Math.floor(friendRequestUsers.length * 0.6)
  );

  const shuffledRequests = [...friendRequestUsers].sort(
    () => 0.5 - Math.random()
  );

  for (let i = 0; i < numToAccept; i++) {
    // Remove friend request
    await prisma.user.update({
      where: { id: shuffledRequests[i].id },
      data: {
        friendRequestsSent: { disconnect: { id: superUser.id } },
      },
    });

    // Create mutual friendship
    await prisma.user.update({
      where: { id: superUser.id },
      data: {
        friends: { connect: { id: shuffledRequests[i].id } },
      },
    });

    await prisma.user.update({
      where: { id: shuffledRequests[i].id },
      data: {
        friends: { connect: { id: superUser.id } },
      },
    });
  }

  // Regular users also send friend requests to each other
  for (const user of users) {
    // Each user sends 5-10 friend requests
    const numRequests = getRandomInt(5, 10);
    const requestedUsers = new Set();

    for (let i = 0; i < numRequests; i++) {
      const potentialFriend = users[getRandomInt(0, users.length - 1)];

      // Don't request yourself, super user (handled separately), or duplicate requests
      if (
        potentialFriend.id !== user.id &&
        potentialFriend.id !== superUser.id &&
        !requestedUsers.has(potentialFriend.id)
      ) {
        requestedUsers.add(potentialFriend.id);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            friendRequestsSent: { connect: { id: potentialFriend.id } },
          },
        });

        // 60% chance the request gets accepted
        if (Math.random() < 0.6) {
          // Remove friend request
          await prisma.user.update({
            where: { id: user.id },
            data: {
              friendRequestsSent: { disconnect: { id: potentialFriend.id } },
            },
          });

          // Create mutual friendship
          await prisma.user.update({
            where: { id: user.id },
            data: {
              friends: { connect: { id: potentialFriend.id } },
            },
          });

          await prisma.user.update({
            where: { id: potentialFriend.id },
            data: {
              friends: { connect: { id: user.id } },
            },
          });
        }
      }
    }
  }

  console.log("Seeding complete with super user!");

  // Finally, set a special longer bio for the super user
  await prisma.user.update({
    where: { id: superUser.id },
    data: {
      bio: generateSuperUserBio(),
    },
  });

  // Regular user bios
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        bio: generateRealisticBio(),
      },
    });
  }
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
