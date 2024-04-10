export type TLayouts = 'grid' | 'columns' | 'list' | 'sidebar';
export type TSize = 'full' | 'normal';
export type TSort = 'recent' | 'tags' | 'activity';
export type TReach = 'following' | 'followers' | 'friends' | 'all';
export type TContent = 'all' | 'posts' | 'images' | 'videos' | 'links';
export type TTimeframe = 'today' | 'month' | 'all';

export interface ILink {
  url: string;
  title: string;
}

export interface IProfile {
  name: string;
  bio: string;
  image: string;
  links: ILink[];
}

export interface IAuthor {
  id: string;
  uri: string;
  profile: IProfile;
}

export interface IPost {
  id: string;
  uri: string;
  author: IAuthor;
  post: { content: string };
  tags: {
    count: number;
    from: {
      author: IAuthor;
      createdAt: number;
      id: string;
      indexedAt: number;
    }[];
    tag: string;
  }[];
  createdAt: number;
  indexedAt: number;
}

export interface ITag {
  tag: string;
  count: number;
  from: {
    image: string;
  }[];
}

export interface IFollowed {
  profile: {
    image: string;
    name: string;
  };
  id: string;
}

interface IViewer {}

export interface IUserProfile {
  profile: IProfile;
  tagsCount: number;
  postsCount: number;
  taggedAs: string[];
  viewer: IViewer;
}
