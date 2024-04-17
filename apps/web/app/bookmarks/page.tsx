import { Content } from '@social/ui-shared';
import { CreatePost, Header, Post, PostsLayout } from '../components';
import { DropDown } from '../components/DropDown';
import { IPost } from '../../types/index';

export default function Index() {
  const Item = {} as IPost;
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Bookmarks">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.Content />
          <DropDown.Reach />
          <DropDown.SortPosts />
          <DropDown.Layout />
        </div>
      </Header>
      <Content.Grid className={''}>
        <PostsLayout className="flex flex-col">
          <Post bookmark post={Item} size="full" />
          <Post bookmark post={Item} size="full" />
        </PostsLayout>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
