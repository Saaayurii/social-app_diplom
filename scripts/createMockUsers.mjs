import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/ru';
import { subHours } from 'date-fns';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

let maleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let femaleAvatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Русские посты
const russianPosts = [
  'Прекрасный день для новых начинаний!',
  'Только что закончил интересный проект. Очень доволен результатом.',
  'Иногда нужно просто остановиться и насладиться моментом.',
  'Делюсь своими мыслями о современных технологиях.',
  'Сегодня был продуктивный день на работе.',
  'Встретил старого друга, было очень приятно пообщаться.',
  'Читаю интересную книгу, рекомендую всем!',
  'Природа всегда вдохновляет на новые идеи.',
  'Работа над собой — это лучшая инвестиция.',
  'Каждый день — это новая возможность стать лучше.',
  'Путешествия расширяют кругозор и дарят незабываемые впечатления.',
  'Спорт — это не только здоровье, но и отличное настроение!',
  'Музыка помогает справиться с любыми трудностями.',
  'Время, проведённое с семьёй — бесценно.',
  'Новый рецепт получился просто потрясающим!',
  'Фильм, который я посмотрел вчера, оставил глубокое впечатление.',
  'Учиться никогда не поздно, главное — желание.',
  'Маленькие победы ведут к большим достижениям.',
  'Благодарен за всё хорошее, что есть в моей жизни.',
  'Иногда лучший отдых — это просто побыть наедине с собой.',
];

// Русские комментарии
const russianComments = [
  'Отличный пост! Полностью согласен.',
  'Спасибо за то, что делишься своими мыслями!',
  'Очень интересно, расскажи подробнее!',
  'Прекрасные слова, вдохновляет!',
  'Как же это верно!',
  'Поддерживаю! Сам так думаю.',
  'Классно сказано!',
  'Это точно! Согласен на все 100%.',
  'Спасибо за позитив!',
  'Очень актуально сейчас.',
  'Вдохновляющие слова!',
  'Полезная информация, благодарю!',
  'Интересный взгляд на вещи.',
  'Молодец! Так держать!',
  'Замечательно написано.',
];

// Русские сообщения для диалогов
const russianMessages = [
  'Привет! Как дела?',
  'Всё отлично, спасибо! А у тебя?',
  'Тоже хорошо. Чем занимаешься?',
  'Работаю над новым проектом, очень интересно.',
  'Звучит здорово! Расскажешь потом?',
  'Конечно! Может встретимся на выходных?',
  'С удовольствием! Давай в субботу?',
  'Отлично, договорились!',
  'Привет! Давно не общались.',
  'Да, надо чаще встречаться!',
  'Как твоя семья?',
  'Все хорошо, спасибо что спросил!',
  'Смотрел вчера интересный фильм.',
  'Какой? Порекомендуешь?',
  'Да, обязательно! Тебе понравится.',
  'Спасибо за совет!',
  'Как прошёл твой день?',
  'Был продуктивный день, много успел.',
  'Это здорово! Рад за тебя.',
  'Спасибо! Ты тоже молодец!',
];

function getRandomPost() {
  return russianPosts[Math.floor(Math.random() * russianPosts.length)];
}

function getRandomComment() {
  return russianComments[Math.floor(Math.random() * russianComments.length)];
}

function getRandomMessage() {
  return russianMessages[Math.floor(Math.random() * russianMessages.length)];
}

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

  // Создание постов
  const fakePosts = Array.from({ length: 3 }).map((item, i) => ({
    userId: id,
    content: getRandomPost(),
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
  console.log('🌱 Начинаем заполнение базы данных...');

  // Шаг 1: Создание пользователей и их постов
  console.log('📝 Создание пользователей и постов...');
  const fakeUsers = Array.from({ length: 10 }, createRandomUser);
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
  console.log(`✅ Создано ${createdUsers.length} пользователей с постами`);

  // Шаг 2: Создание подписок
  console.log('👥 Создание подписок...');
  let followCount = 0;
  for (let i = 0; i < createdUsers.length; i++) {
    // Each user follows 2-5 random other users
    const numberOfFollows = Math.floor(Math.random() * 4) + 2;
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
  console.log(`✅ Создано ${followCount} подписок`);

  // Шаг 3: Создание лайков на посты
  console.log('❤️  Создание лайков на посты...');
  const allPosts = await prisma.post.findMany();
  let postLikeCount = 0;

  for (const post of allPosts) {
    // 10-30% of users will like each post
    const likePercentage = Math.random() * 0.2 + 0.1;
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
  console.log(`✅ Создано ${postLikeCount} лайков на посты`);

  // Шаг 4: Создание комментариев
  console.log('💬 Создание комментариев...');
  let commentCount = 0;

  for (const post of allPosts) {
    // 1-3 comments per post
    const numberOfComments = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numberOfComments; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const comment = await prisma.comment.create({
        data: {
          content: getRandomComment(),
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
  console.log(`✅ Создано ${commentCount} комментариев`);

  // Шаг 5: Создание лайков на комментарии
  console.log('👍 Создание лайков на комментарии...');
  const allComments = await prisma.comment.findMany();
  let commentLikeCount = 0;

  for (const comment of allComments) {
    // 5-20% of users will like each comment
    const likePercentage = Math.random() * 0.15 + 0.05;
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
  console.log(`✅ Создано ${commentLikeCount} лайков на комментарии`);

  // Шаг 6: Создание ответов на комментарии
  console.log('💭 Создание ответов на комментарии...');
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
          content: getRandomComment(),
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
  console.log(`✅ Создано ${replyCount} ответов на комментарии`);

  // Шаг 7: Создание диалогов и сообщений
  console.log('💌 Создание диалогов и сообщений...');
  let conversationCount = 0;
  let messageCount = 0;

  // Create 5 random conversations
  for (let i = 0; i < 5; i++) {
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

    // Create 3-7 messages in each conversation
    const numberOfMessages = Math.floor(Math.random() * 5) + 3;
    for (let j = 0; j < numberOfMessages; j++) {
      const sender = j % 2 === 0 ? user1 : user2;
      await prisma.message.create({
        data: {
          content: getRandomMessage(),
          senderId: sender.id,
          conversationId: conversation.id,
          createdAt: subHours(new Date(), numberOfMessages - j),
        },
      });
      messageCount++;
    }
  }
  console.log(`✅ Создано ${conversationCount} диалогов с ${messageCount} сообщениями`);

  console.log('🎉 Заполнение базы данных успешно завершено!');
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
