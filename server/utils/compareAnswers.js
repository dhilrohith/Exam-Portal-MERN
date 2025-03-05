// helpers/gradeUtils.js
export function compareAnswers(studentAnswer, correctAnswer) {
    // Normalize string values
    const normalizeString = (str) =>
      String(str).trim().toLowerCase();
  
    // Try converting both answers to numbers
    const numStudent = Number(studentAnswer);
    const numCorrect = Number(correctAnswer);
  
    // If both conversions are valid, compare as numbers
    if (!isNaN(numStudent) && !isNaN(numCorrect)) {
      return numStudent === numCorrect;
    } else {
      // Otherwise, compare as strings (case-insensitive)
      return normalizeString(studentAnswer) === normalizeString(correctAnswer);
    }
  }
  