'use client';

import { useState } from 'react';
import { Icon, Button, Post as PostUI, Alert } from '@social/ui-shared';

import { Modal } from '../Modal';
import Repost from '../_Repost';
import { useClientContext } from '../../contexts/client';
import { IPost } from '../../types';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
}

export default function Actions({ post }: PostProps) {
  const { pubky, deletePost, deleteBookmark, createBookmark } =
    useClientContext();
  const [showModalRepost, setShowModalRepost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  const handleDeletePost = async (postId: string) => {
    setShowDeleteMessage(true);
    setTimeout(() => setShowDeleteMessage(false), 2000);
    await deletePost(postId);
  };

  const handleAddBookmark = async (postId: string, uri: string) => {
    await createBookmark(postId, uri);
  };

  const handleDeleteBookmark = async (
    postId: string,
    postUri: string,
    bookmarkId: string
  ) => {
    await deleteBookmark(postId, postUri, bookmarkId);
  };

  return (
    <div>
      <PostUI.Actions>
        {post?.author?.id === pubky && (
          <Button.Action
            size="small"
            variant="custom"
            className="bg-red-500 hover:bg-red-400 bg-opacity-100"
            icon={<Icon.Trash size="16" />}
            onClick={(event) => {
              event.stopPropagation();
              setShowModalDeletePost(true);
            }}
          />
        )}
        <Button.Action
          size="small"
          variant="custom"
          icon={<Icon.Tag size="16" />}
          counter={post?.tags?.length}
          onClick={(event) => {
            event.stopPropagation();
            setShowModalTag(true);
          }}
        />
        <Button.Action
          size="small"
          variant="custom"
          icon={<Icon.ChatCircleText size="16" />}
          counter={0}
        />
        {/* <Button.Action
          size="small"
          variant="custom"
          icon={<Icon.Repost size="16" />}
          counter={0}
          onClick={(event) => {
            event.stopPropagation();
            setShowModalRepost(true);
          }}
        /> */}
        <Button.Action
          size="small"
          variant="custom"
          icon={
            <Icon.BookmarkSimple
              opacity={post?.bookmark?.id ? '1' : '0.2'}
              size="16"
            />
          }
          onClick={(event) => {
            event.stopPropagation();
            post?.bookmark?.id
              ? handleDeleteBookmark(post.id, post.uri, post.bookmark.id)
              : handleAddBookmark(post.id, post.uri);
          }}
        />
      </PostUI.Actions>
      {showDeleteMessage && (
        <Alert.Message icon={<Icon.CheckCircle size="20" />}>
          Post successfully deleted!
        </Alert.Message>
      )}
      <Repost
        post={post}
        showModalRepost={showModalRepost}
        setShowModalRepost={setShowModalRepost}
      />
      <Modal.Tag
        post={post}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
      />
      <Modal.DeletePost
        showModalDeletePost={showModalDeletePost}
        setShowModalDeletePost={setShowModalDeletePost}
        handleDeletePost={handleDeletePost}
        postId={post.id}
      />
    </div>
  );
}
