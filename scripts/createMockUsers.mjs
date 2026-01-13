import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { subHours } from 'date-fns';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

let maleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let femaleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function getRandomItemAndRemove(array) {
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * array.length);

  // Get the item at the random index
  const item = array[randomIndex];

  // Remove the item from the array
  array.splice(randomIndex, 1);

  // Return the removed item
  return item;
}

function generateRandomBoolean(probability) {
  // Generate a random number between 0 and 1
  const random = Math.random();

  // Calculate the threshold based on the probability rate
  const threshold = probability / 100;

  // Return true if the random number is less than the threshold, otherwise false
  return random < threshold;
}

function createRandomUser() {
  const gender = faker.person.sexType();
  const isGenderNonBinary = generateRandomBoolean(15); // 15% chance of being NONBINARY
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const id = createId();
  const username = faker.internet
    .userName({ firstName, lastName })
    .replace(/[.-]/g, '_')
    .toLowerCase();
  const email = faker.internet.email({ firstName, lastName });
  const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  const bio = faker.person.bio();
  const website = faker.internet.domainName();
  const phoneNumber = faker.phone.number();
  const address = faker.location.streetAddress({ useFullAddress: true });
  const relationshipStatus = faker.helpers.arrayElement([
    'SINGLE',
    'IN_A_RELATIONSHIP',
    'ENGAGED',
    'MARRIED',
  ]);

  // Get a random profile picture from maleAvatars or femaleAvatars
  // depending on gender, then, remove the returned profile picture
  const randomProfilePhoto = `${getRandomItemAndRemove(
    gender === 'male' ? maleAvatars : femaleAvatars,
  )}.png`;
  // Reset avatars array when all values are consumed
  if (maleAvatars.length === 0) maleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if (femaleAvatars.length === 0)
    femaleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const profilePhotoPath = `seed-${gender}-avatars/${randomProfilePhoto}`;

  // Create fake posts
  const fakePosts = Array.from({ length: 3 }).map((item, i) => ({
    userId: id,
    content: faker.lorem.sentence(),
    createdAt: subHours(new Date(), i),
  }));

  return {
    user: {
      id,
      username,
      name: fullName,
      email,
      gender: isGenderNonBinary ? 'NONBINARY' : gender.toUpperCase(),
      birthDate,
      bio,
      website,
      phoneNumber,
      address,
      profilePhoto: profilePhotoPath,
      relationshipStatus,
    },
    posts: fakePosts,
  };
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Step 1: Create users and their posts
  console.log('📝 Creating users and posts...');
  const fakeUsers = Array.from({ length: 100 }, createRandomUser);
  const createdUsers = [];

  for (const fakeUser of fakeUsers) {
    const user = await prisma.user.create({
      data: fakeUser.user,
    });
    await prisma.post.createMany({
      data: fakeUser.posts,
    });
    createdUsers.push(user);
  }
  console.log(`✅ Created ${createdUsers.length} users with posts`);

  // Step 2: Create follows (подписки)
  console.log('👥 Creating follow relationships...');
  let followCount = 0;
  for (let i = 0; i < createdUsers.length; i++) {
    // Each user follows 5-15 random other users
    const numberOfFollows = Math.floor(Math.random() * 11) + 5;
    const usersToFollow = createdUsers
      .filter((u) => u.id !== createdUsers[i].id)
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfFollows);

    for (const userToFollow of usersToFollow) {
      try {
        await prisma.follow.create({
          data: {
            followerId: createdUsers[i].id,
            followingId: userToFollow.id,
          },
        });

        // Create activity for follow
        await prisma.activity.create({
          data: {
            type: 'CREATE_FOLLOW',
            sourceId: 0, // Follow activities don't use sourceId
            sourceUserId: createdUsers[i].id,
            targetUserId: userToFollow.id,
          },
        });
        followCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }
  console.log(`✅ Created ${followCount} follow relationships`);

  // Step 3: Create post likes
  console.log('❤️  Creating post likes...');
  const allPosts = await prisma.post.findMany();
  let postLikeCount = 0;

  for (const post of allPosts) {
    // 30-70% of users will like each post
    const likePercentage = Math.random() * 0.4 + 0.3;
    const numberOfLikes = Math.floor(createdUsers.length * likePercentage);
    const usersWhoLike = createdUsers
      .filter((u) => u.id !== post.userId)
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfLikes);

    for (const user of usersWhoLike) {
      try {
        const postLike = await prisma.postLike.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        });

        // Create activity for post like
        await prisma.activity.create({
          data: {
            type: 'POST_LIKE',
            sourceId: postLike.id,
            targetId: post.id,
            sourceUserId: user.id,
            targetUserId: post.userId,
          },
        });
        postLikeCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }
  console.log(`✅ Created ${postLikeCount} post likes`);

  // Step 4: Create comments
  console.log('💬 Creating comments...');
  let commentCount = 0;

  for (const post of allPosts) {
    // 2-8 comments per post
    const numberOfComments = Math.floor(Math.random() * 7) + 2;

    for (let i = 0; i < numberOfComments; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          userId: randomUser.id,
          postId: post.id,
          createdAt: subHours(new Date(), Math.floor(Math.random() * 24)),
        },
      });

      // Create activity for comment
      await prisma.activity.create({
        data: {
          type: 'CREATE_COMMENT',
          sourceId: comment.id,
          targetId: post.id,
          sourceUserId: randomUser.id,
          targetUserId: post.userId,
        },
      });
      commentCount++;
    }
  }
  console.log(`✅ Created ${commentCount} comments`);

  // Step 5: Create comment likes
  console.log('👍 Creating comment likes...');
  const allComments = await prisma.comment.findMany();
  let commentLikeCount = 0;

  for (const comment of allComments) {
    // 10-40% of users will like each comment
    const likePercentage = Math.random() * 0.3 + 0.1;
    const numberOfLikes = Math.floor(createdUsers.length * likePercentage);
    const usersWhoLike = createdUsers
      .filter((u) => u.id !== comment.userId)
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfLikes);

    for (const user of usersWhoLike) {
      try {
        const commentLike = await prisma.commentLike.create({
          data: {
            userId: user.id,
            commentId: comment.id,
          },
        });

        // Create activity for comment like
        await prisma.activity.create({
          data: {
            type: 'COMMENT_LIKE',
            sourceId: commentLike.id,
            targetId: comment.id,
            sourceUserId: user.id,
            targetUserId: comment.userId,
          },
        });
        commentLikeCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }
  console.log(`✅ Created ${commentLikeCount} comment likes`);

  // Step 6: Create replies to comments
  console.log('💭 Creating comment replies...');
  let replyCount = 0;

  // Create replies for 30% of comments
  const commentsWithReplies = allComments
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(allComments.length * 0.3));

  for (const comment of commentsWithReplies) {
    const numberOfReplies = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numberOfReplies; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const reply = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          userId: randomUser.id,
          postId: comment.postId,
          parentId: comment.id,
          createdAt: subHours(new Date(), Math.floor(Math.random() * 12)),
        },
      });

      // Create activity for reply
      await prisma.activity.create({
        data: {
          type: 'CREATE_REPLY',
          sourceId: reply.id,
          targetId: comment.id,
          sourceUserId: randomUser.id,
          targetUserId: comment.userId,
        },
      });
      replyCount++;
    }
  }
  console.log(`✅ Created ${replyCount} comment replies`);

  // Step 7: Create conversations and messages
  console.log('💌 Creating conversations and messages...');
  let conversationCount = 0;
  let messageCount = 0;

  // Create 30 random conversations
  for (let i = 0; i < 30; i++) {
    const user1 = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    let user2 = createdUsers[Math.floor(Math.random() * createdUsers.length)];

    // Make sure users are different
    while (user2.id === user1.id) {
      user2 = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: user1.id },
            { userId: user2.id },
          ],
        },
      },
    });
    conversationCount++;

    // Create 5-15 messages in each conversation
    const numberOfMessages = Math.floor(Math.random() * 11) + 5;
    for (let j = 0; j < numberOfMessages; j++) {
      const sender = j % 2 === 0 ? user1 : user2;
      await prisma.message.create({
        data: {
          content: faker.lorem.sentences(Math.floor(Math.random() * 2) + 1),
          senderId: sender.id,
          conversationId: conversation.id,
          createdAt: subHours(new Date(), numberOfMessages - j),
        },
      });
      messageCount++;
    }
  }
  console.log(`✅ Created ${conversationCount} conversations with ${messageCount} messages`);

  console.log('🎉 Database seeding completed successfully!');
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
