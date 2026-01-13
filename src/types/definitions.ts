import { VisualMediaType, User, Follow, ActivityType, Gender, VisualMedia, RelationshipStatus } from '@prisma/client';

type UserSummary = Pick<User, 'id' | 'username' | 'name' | 'profilePhoto'>;
/**
 * The `User` type from Prisma indicates that the `username` and `name` fields are nullable,
 * however, after the initial user setup upon user's registration, these two fields will be
 * guaranteed to be filled in.
 */
export interface UserSummaryAfterSetUp {
  id: string;
  username: string;
  name: string;
  profilePhoto: string | null;
}

interface UserAfterSetUp extends User {
  username: string;
  name: string;
}

// Use this type when finding a User in prisma.
export interface FindUserResult extends User {
  followers: Follow[];
  _count: {
    following: number;
    followers: number;
  };
}

/**
 * The <FindUserResult> shall be converted to <GetUser>, use
 * the ./src/lib/prisma/toGetUser.ts function to do this.
 * <GetUser> must be the response type of GET users route handlers.
 */
export interface GetUser extends UserAfterSetUp {
  followerCount: number | null;
  followingCount: number | null;
  isFollowing: boolean | null; // true when the authenticated user is following the user being requested
}

export interface GetVisualMedia {
  type: VisualMediaType;
  url: string;
}

export interface VisualMediaModalType {
  visualMedia: GetVisualMedia[];
  initialSlide: number;
}

// Use this type when finding a Post in prisma.
export interface FindPostResult {
  id: number;
  content: string | null;
  createdAt: Date;
  /**
   * Use `postLikes` to store the <PostLike>'s id of the user to the Post.
   * If there is a <PostLike> id, that means the user requesting has
   * liked the Post.
   */
  postLikes: {
    id: number;
  }[];
  user: UserSummary;
  visualMedia: VisualMedia[];
  _count: {
    postLikes: number;
    comments: number;
  };
}

/**
 * The <FindPostResult> shall be converted to <GetPost>, use
 * the ./src/lib/prisma/toGetPost.ts function to do this.
 * <GetPost> must be the response type of GET posts route handlers.
 */
export interface GetPost {
  id: number;
  content: string | null;
  createdAt: Date;
  /**
   * The `isLiked` is used to check whether the authenticated user requesting
   * the post has liked it or not.
   */
  isLiked: boolean;
  user: UserSummaryAfterSetUp;
  visualMedia: GetVisualMedia[];
  _count: {
    postLikes: number;
    comments: number;
  };
}

/**
 * Use `PostIds` when rendering a list of <Post>'s, this type
 * must be passed to <Post>, and <Post> must use the `id` to
 * check for queried post data using this `queryKey` format:
 * ['posts', number] where number is the post's id
 */
export interface PostId {
  id: number;
  commentsShown: boolean;
}

export type PostIds = PostId[];

// Use this type when finding a Comment in prisma.
export interface FindCommentResult {
  id: number;
  content: string;
  createdAt: Date;
  userId: string;
  postId: number;
  parentId: number | null;
  user: UserSummary;
  /**
   * Use `commentLikes` to store the <CommentLike>'s id of the user to the Comment.
   * If there is a <CommentLike> id, that means the user requesting has
   * liked the Comment.
   */
  commentLikes: {
    id: number;
  }[];
  _count: {
    commentLikes: number;
    replies: number;
  };
}

/**
 * The <FindCommentResult> shall be converted to <GetComment>, use
 * the ./src/lib/prisma/toGetComment.ts function to do this.
 * <GetComment> must be the response type of GET comments route handlers.
 */
export interface GetComment {
  id: number;
  postId: number;
  parentId: number | null;
  content: string;
  createdAt: Date;
  user: UserSummaryAfterSetUp;
  isLiked: boolean;
  _count: {
    commentLikes: number;
    replies: number;
  };
  repliesShown?: boolean;
}

export type DiscoverFilterKeys = 'gender' | 'relationship-status';

export interface DiscoverFilters {
  gender?: Gender;
  'relationship-status'?: RelationshipStatus;
}

interface FindActivityResult {
  id: number;
  type: ActivityType;
  sourceId: number;
  targetId: number | null;
  createdAt: Date;
  isNotificationRead: boolean;
  sourceUser: UserSummary & { gender: Gender | null };
  targetUser: UserSummary & { gender: Gender | null };
}
export type FindActivityResults = FindActivityResult[];

export interface GetActivity extends FindActivityResult {
  sourceUser: UserSummaryAfterSetUp & { gender: Gender | null };
  targetUser: UserSummaryAfterSetUp & { gender: Gender | null };
  content?: string | null;
}
export type GetActivities = GetActivity[];

// === Messaging Types ===

type UserSummaryForMessage = Pick<User, 'id' | 'username' | 'name' | 'profilePhoto'>;

// Use this type when finding a Conversation in prisma.
export interface FindConversationResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  participants: {
    userId: string;
    lastReadAt: Date;
    user: UserSummaryForMessage;
  }[];
  messages: {
    id: number;
    content: string;
    createdAt: Date;
    senderId: string;
  }[];
  _count: {
    messages: number;
  };
}

/**
 * The <FindConversationResult> shall be converted to <GetConversation>.
 * <GetConversation> must be the response type of GET conversations route handlers.
 */
export interface GetConversation {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  otherParticipant: UserSummaryAfterSetUp;
  lastMessage: {
    content: string;
    createdAt: Date;
    isOwn: boolean;
  } | null;
  unreadCount: number;
}

// Use this type when finding a Message in prisma.
export interface FindMessageResult {
  id: number;
  content: string;
  createdAt: Date;
  senderId: string;
  conversationId: number;
  sender: UserSummaryForMessage;
}

/**
 * The <FindMessageResult> shall be converted to <GetMessage>.
 * <GetMessage> must be the response type of GET messages route handlers.
 */
export interface GetMessage {
  id: number;
  content: string;
  createdAt: Date;
  conversationId: number;
  sender: UserSummaryAfterSetUp;
  isOwn: boolean;
}
