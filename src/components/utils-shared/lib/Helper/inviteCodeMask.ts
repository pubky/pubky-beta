export const inviteCodeMask = (value: string): string => {
  // Convert to uppercase and remove any characters that aren't alphanumeric or dashes
  const cleaned = value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();

  // If no dashes, apply automatic masking
  if (!cleaned.includes('-')) {
    return applyAutomaticMask(cleaned);
  }

  // Handle cases where user manually types dashes
  const parts = cleaned.split('-').map((part) => part.replace(/[^A-Z0-9]/g, ''));

  return formatWithParts(parts);
};

// Helper function to apply automatic masking
const applyAutomaticMask = (alphanumericOnly: string): string => {
  if (alphanumericOnly.length <= 4) {
    return alphanumericOnly;
  }

  if (alphanumericOnly.length <= 8) {
    return `${alphanumericOnly.slice(0, 4)}-${alphanumericOnly.slice(4)}`;
  }

  return `${alphanumericOnly.slice(0, 4)}-${alphanumericOnly.slice(4, 8)}-${alphanumericOnly.slice(8, 12)}`;
};

// Helper function to format with parts
const formatWithParts = (parts: string[]): string => {
  const combined = parts.join('');

  switch (parts.length) {
    case 1:
      return applyAutomaticMask(parts[0]);

    case 2:
      if (combined.length <= 8) {
        return `${combined.slice(0, 4)}-${combined.slice(4)}`;
      }
      return `${combined.slice(0, 4)}-${combined.slice(4, 8)}-${combined.slice(8, 12)}`;

    case 3:
      return `${combined.slice(0, 4)}-${combined.slice(4, 8)}-${combined.slice(8, 12)}`;

    default:
      return applyAutomaticMask(combined);
  }
};
