const formatSpaceArticle = (content: string): string => {
  return content
    .replace(/<p><br><\/p><p><br><\/p>/g, 'DOUBLE_SPACE') // First replace multiple consecutive <p><br></p> with a placeholder
    .replace(/<p><br><\/p>/g, '') // Remove all single <p><br></p>
    .replace(/DOUBLE_SPACE/g, '<p><br></p>'); // Convert the placeholder back to a single <p><br></p>
};

export default formatSpaceArticle;
