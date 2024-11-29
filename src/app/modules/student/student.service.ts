import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {


  if( await  Student.isUserExist(studentData.id)) {
    throw new Error("User Already Exists!")
   }

   
  const result = await Student.create(studentData); //build in static method



  //const student = new Student(studentData); //create an instance

  // if(await student.isUserExist(studentData.id)) {
  //   throw new Error('User Already exists!')
  // }

  // const result = await student.save();
  return result;
};

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
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deletedStudentFromDb
};
