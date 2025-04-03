import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { TContent } from '@/types';

const icons = {
  all: <Icon.Stack />,
  posts: <Icon.NoteBlank />,
  articles: <Icon.Newspaper />,
  images: <Icon.ImageSquare />,
  videos: <Icon.Play />,
  links: <Icon.LinkSimple />,
  files: <Icon.DownloadSimple size="24" />,
  loading: <Icon.LoadingSpin className="animate-spin" />
};

interface ContentProps {
  content: TContent;
  setContent: (content: TContent) => void;
  setDropdownValue: any;
  setOpenDropdown: any;
}

export default function ContentType({ content, setContent, setDropdownValue, setOpenDropdown }: ContentProps) {
  return (
    <>
      <DropDownUI.Item
        label="All"
        value="All"
        selected={content === 'all'}
        icon={<Icon.Stack />}
        onClick={() => {
          setDropdownValue({
            value: 'all',
            textOption: 'All',
            iconOption: icons.all
          });
          setContent('all');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Posts"
        value="Posts"
        selected={content === 'posts'}
        icon={<Icon.NoteBlank />}
        onClick={() => {
          setDropdownValue({
            value: 'posts',
            textOption: 'Posts',
            iconOption: icons.posts
          });
          setContent('posts');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Articles"
        value="Articles"
        selected={content === 'articles'}
        icon={<Icon.Newspaper />}
        onClick={() => {
          setDropdownValue({
            value: 'articles',
            textOption: 'Articles',
            iconOption: icons.articles
          });
          setContent('articles');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Images"
        value="Images"
        selected={content === 'images'}
        icon={<Icon.ImageSquare />}
        onClick={() => {
          setDropdownValue({
            value: 'images',
            textOption: 'Images',
            iconOption: icons.images
          });
          setContent('images');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Videos"
        value="Videos"
        selected={content === 'videos'}
        icon={<Icon.Play />}
        onClick={() => {
          setDropdownValue({
            value: 'videos',
            textOption: 'Videos',
            iconOption: icons.videos
          });
          setContent('videos');
          setOpenDropdown(false);
        }}
      />

      <DropDownUI.Item
        label="Links"
        value="Links"
        selected={content === 'links'}
        icon={<Icon.LinkSimple />}
        onClick={() => {
          setDropdownValue({
            value: 'links',
            textOption: 'Links',
            iconOption: icons.links
          });
          setContent('links');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Files"
        value="Files"
        selected={content === 'files'}
        icon={<Icon.DownloadSimple />}
        onClick={() => {
          setDropdownValue({
            value: 'files',
            textOption: 'Files',
            iconOption: icons.files
          });
          setContent('files');
          setOpenDropdown(false);
        }}
      />
    </>
  );
}
