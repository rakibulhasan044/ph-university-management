import { academicSemesterCodeMapper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {

    //semester name -> semester code validation

    if(academicSemesterCodeMapper[payload.name] !== payload.code) {
        throw new Error("Invalid semester code !!")
    }
    const result = await AcademicSemester.create(payload);

    return result;
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB
}