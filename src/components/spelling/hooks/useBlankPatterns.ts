
export const useBlankPatterns = () => {
  const generateBlankPattern = (text: string): number[] => {
    const pattern = Math.floor(Math.random() * 5); 
    const indices: number[] = [];
    const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
    
    switch (pattern) {
      case 0: // More frequent alternating pattern (every other character)
        for (let i = 1; i < text.length; i += 2) {
          indices.push(i);
        }
        break;
      case 1: // Clustered blanks (consecutive characters)
        const startPoint = Math.max(1, Math.floor(Math.random() * (text.length - 2)));
        const clusterSize = Math.min(
          Math.max(2, Math.floor(text.length * 0.4)), 
          Math.floor(text.length / 2)
        );
        
        for (let i = startPoint; i < startPoint + clusterSize && i < text.length; i++) {
          indices.push(i);
        }
        break;
      case 2: // Random blanks with higher percentage (50-70%)
        const blankCount = Math.floor(text.length * (0.5 + Math.random() * 0.2));
        const possibleIndices = Array.from({ length: text.length }, (_, i) => i)
          .filter(i => i > 0);
        
        for (let i = possibleIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [possibleIndices[i], possibleIndices[j]] = [possibleIndices[j], possibleIndices[i]];
        }
        
        indices.push(...possibleIndices.slice(0, blankCount).sort((a, b) => a - b));
        break;
      case 3: // Blank all vowels
        text.split('').forEach((char, index) => {
          if (vowels.includes(char) && index > 0) {
            indices.push(index);
          }
        });
        break;
      case 4: // Blank all consonants (except first character)
        text.split('').forEach((char, index) => {
          if (!vowels.includes(char) && char.match(/[a-zA-Z]/) && index > 0) {
            indices.push(index);
          }
        });
        break;
    }
    
    if (indices.length === 0 && text.length > 1) {
      indices.push(1);
    } else if (indices.length > text.length * 0.75) {
      while (indices.length > Math.ceil(text.length * 0.75) && indices.length > 2) {
        const removeIndex = Math.floor(Math.random() * indices.length);
        indices.splice(removeIndex, 1);
      }
    }
    
    return indices;
  };

  return {
    generateBlankPattern
  };
};
