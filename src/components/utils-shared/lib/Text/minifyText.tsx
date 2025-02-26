export const minifyText = (text: string, maxLength: number = 12) => {
  if (!text) return '';

  const lines = text.split('\n');
  const minifiedLines = lines.map((line) => (line.length > maxLength ? `${line.substring(0, maxLength)}...` : line));

  return (
    <>
      {minifiedLines.map((line) => (
        <span key={line}>
          {line}
          {minifiedLines.length > 1 && <br />}
        </span>
      ))}
    </>
  );
};

export default minifyText;
