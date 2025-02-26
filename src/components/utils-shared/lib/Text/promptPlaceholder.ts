const promptCreatePost = [
  "What's on your mind?",
  'What did you do today?',
  'Share your latest achievement!',
  'Got something to say?'
];

const promptCreateReply = [
  'What are your thoughts on this?',
  'What do you think?',
  'Do you agree?',
  'Any additional insights?',
  'How would you respond?'
];

const promptCreateArticle = [
  'What topic are you passionate about?',
  'Start with a compelling introduction!',
  'Why is this topic important to you?',
  'What are the key points you want to cover?',
  'How would you summarize your article?',
  'What conclusion can you draw from your research?',
  'What questions do you want to leave your readers with?',
  'What kind of impact do you hope your article will have?',
  'What are your personal experiences with this topic?',
  'How can this topic help others?'
];

type PromptType = 'post' | 'reply' | 'article';

const promptPlaceholder = (type: PromptType = 'post'): string => {
  const promptMap = {
    post: promptCreatePost,
    reply: promptCreateReply,
    article: promptCreateArticle
  };

  const prompts = promptMap[type] || promptMap.post;
  const randomIndex = Math.floor(Math.random() * prompts.length);

  return prompts[randomIndex];
};

export default promptPlaceholder;
