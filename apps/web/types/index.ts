export interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repost?: boolean;
  bookmark?: boolean;
  size?: 'full' | 'normal';
  post: IPost;
  layout: 'sidebar' | 'grid' | 'columns' | 'list';
}

export interface User {
  bio: string;
  image: string;
  links: {
    url: string;
    value: string;
  }[];
  name: string;
}

export interface UserLink {
  url: string;
  title: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  image: string;
  links: UserLink[];
}

export interface Author {
  id: string;
  uri: string;
  profile: UserProfile;
}

export interface PostPayload {
  content: string;
}

export interface IPost {
  id: string;
  uri: string;
  author: Author;
  post: {
    payload: PostPayload;
  };
  tags: string[];
  createdAt: number;
  indexedAt: number;
}

export type Layouts = {
  [key in 'sidebar' | 'grid' | 'columns' | 'list']: {
    layout: string;
    posts: string;
  };
};
