
import { Student } from './student.model';


const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

const deletedStudentFromDb = async (id: string) => {
  const result = await Student.updateOne({id}, {isDeleted: true})
  return result;
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deletedStudentFromDb
};
