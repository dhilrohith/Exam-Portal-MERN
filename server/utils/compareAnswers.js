// helpers/gradeUtils.js
export function compareAnswers(studentAnswer, correctAnswer) {
  // If both values are booleans, compare directly
  if (typeof studentAnswer === 'boolean' && typeof correctAnswer === 'boolean') {
    return studentAnswer === correctAnswer;
  }
  
  // Normalize values: convert to strings, trim, and convert to lowercase
  const normalize = (val) => String(val).trim().toLowerCase();

  // Attempt numeric conversion
  const numStudent = Number(studentAnswer);
  const numCorrect = Number(correctAnswer);

  if (!isNaN(numStudent) && !isNaN(numCorrect)) {
    return numStudent === numCorrect;
  } else {
    return normalize(studentAnswer) === normalize(correctAnswer);
  }
}
