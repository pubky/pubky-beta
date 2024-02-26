import { Header, Content, Input, Icon, Button } from '@social/ui-shared';
import { Menu } from '../components/Menu';
import { FilterSection } from '../components/FilterSection';
import { PostsSection } from '../components/PostsSection';
import { WhoFollow } from '../components/WhoFollow';
import { HotTags } from '../components/HotTags';
import { ActiveFriends } from '../components/ActiveFriends';

type Tag = {
  value: string;
  color: string;
};

export default function Index() {
  const tags: Tag[] = [];
  return (
    <>
      <Content.Main>
        <Header.Root>
          <Header.Logo />
          <Header.Title title={'Streams'} />
          <Input.Search className="w-[854px]">
            {tags && (
              <Input.SearchTags>
                {tags.map((tag, index) => (
                  <Input.SearchTag
                    color={tag.color}
                    key={index}
                    actions={[<Icon.X key={index} />]}
                    value={tag.value}
                  />
                ))}
              </Input.SearchTags>
            )}
            <Input.SearchInput />
            <Input.SearchActions>
              {tags.length > 0 && <Icon.GridFour />}
              <Icon.MagnifyingGlass />
            </Input.SearchActions>
          </Input.Search>
          <Menu />
        </Header.Root>
        <div className="border-t border-b border-white border-opacity-10">
          <Content.Grid className="flex justify-between">
            <FilterSection />
          </Content.Grid>
        </div>
        <Content.Grid className="gap-6 flex justify-between">
          <PostsSection />
          <div className="flex-col justify-start items-start gap-6 inline-flex">
            <WhoFollow />
            <HotTags />
            <ActiveFriends />
          </div>
          <div className="fixed bottom-10 right-10 max-w-[50%] max-h-[50%]">
            <Button.Create />
          </div>
        </Content.Grid>
      </Content.Main>
    </>
  );
}
