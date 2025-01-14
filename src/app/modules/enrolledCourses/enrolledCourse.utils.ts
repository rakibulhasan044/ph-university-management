export const calculateGradeAndPont = (totalMarks: number) => {
  let result = {
    grade: 'NA',
    gradePoints: 0,
  };

  if (totalMarks >= 0 && totalMarks <= 49) {
    result = {
      grade: 'F',
      gradePoints: 0,
    };
  } else if (totalMarks >= 50 && totalMarks <= 59) {
    result = {
      grade: 'D',
      gradePoints: 2.0,
    };
  } else if (totalMarks >= 60 && totalMarks <= 69) {
    result = {
      grade: 'C',
      gradePoints: 2.5,
    };
  } else if (totalMarks >= 70 && totalMarks <= 79) {
    result = {
      grade: 'B',
      gradePoints: 3.0,
    };
  } else if (totalMarks >= 80 && totalMarks <= 89) {
    result = {
      grade: 'A',
      gradePoints: 3.5,
    };
  } else if (totalMarks >= 90 && totalMarks <= 100) {
    result = {
      grade: 'A+',
      gradePoints: 4.0,
    };
  }

  return result;
};
