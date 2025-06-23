// Function to apply mask to invite code input
export const inviteCodeMask = (value: string): string => {
  // Convert to uppercase and remove any characters that aren't alphanumeric or dashes
  const cleaned = value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();

  // If user is manually typing dashes, try to preserve them
  if (cleaned.includes('-')) {
    // Split by dashes and clean each part
    const parts = cleaned.split('-').map((part) => part.replace(/[^A-Z0-9]/g, ''));

    // Reconstruct with proper formatting
    if (parts.length === 1) {
      // Only one part, apply automatic masking
      const part = parts[0];
      if (part.length <= 4) {
        return part;
      } else if (part.length <= 8) {
        return `${part.slice(0, 4)}-${part.slice(4)}`;
      } else {
        return `${part.slice(0, 4)}-${part.slice(4, 8)}-${part.slice(8, 12)}`;
      }
    } else if (parts.length === 2) {
      // Two parts, format as XXXX-XXXX
      const [part1, part2] = parts;
      const combined = part1 + part2;
      if (combined.length <= 8) {
        return `${combined.slice(0, 4)}-${combined.slice(4)}`;
      } else {
        return `${combined.slice(0, 4)}-${combined.slice(4, 8)}-${combined.slice(8, 12)}`;
      }
    } else if (parts.length === 3) {
      // Three parts, format as XXXX-XXXX-XXXX
      const [part1, part2, part3] = parts;
      const combined = part1 + part2 + part3;
      return `${combined.slice(0, 4)}-${combined.slice(4, 8)}-${combined.slice(8, 12)}`;
    }
  }

  // If no dashes or invalid format, apply automatic masking
  const alphanumericOnly = cleaned.replace(/-/g, '');

  if (alphanumericOnly.length <= 4) {
    return alphanumericOnly;
  } else if (alphanumericOnly.length <= 8) {
    return `${alphanumericOnly.slice(0, 4)}-${alphanumericOnly.slice(4)}`;
  } else {
    return `${alphanumericOnly.slice(0, 4)}-${alphanumericOnly.slice(4, 8)}-${alphanumericOnly.slice(8, 12)}`;
  }
};
