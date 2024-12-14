import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

// const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
//   const { preRequisiteCourses, ...courseRemainingData } = payload;

//   //step-1: basic course info update

//   const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
//     id,
//     courseRemainingData,
//     {
//       new: true,
//       runValidators: true,
//     },
//   );

//   //check if there is any pre-requisite courses to update
//   if (preRequisiteCourses && preRequisiteCourses.length > 0) {
//     //filter out the deleted fields
//     const deletedPreRequisites = preRequisiteCourses
//       .filter((el) => el.course && el.isDeleted)
//       .map((el) => el.course);

//     const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(id, {
//       $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } },
//     });

//       //filter out the new course fields
//   const newPreRequisite = preRequisiteCourses?.filter(el => el.course && !el.isDeleted)

//   const newPreRequisiteCourses = await Course.findByIdAndUpdate(
//     id,
//     {
//       $addToSet: { preRequisiteCourses: { $each: newPreRequisite}}
//     }
//   )
//   }

//   const result = await Course.findById(id).populate('preRequisiteCourses.course')

//   return result
// };

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  // Step 1: Update basic course information
  const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
    id,
    courseRemainingData,
    {
      new: true,
      runValidators: true,
    },
  );

  // Step 2: Handle pre-requisite courses
  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    // Filter out deleted fields
    const deletedPreRequisites = preRequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course);

    await Course.findByIdAndUpdate(id, {
      $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } },
    });

    // Filter out the new courses
    const newPreRequisite = preRequisiteCourses.filter(
      (el) => el.course && !el.isDeleted,
    );

    if (newPreRequisite.length > 0) {
      // Fetch the current prerequisite courses from the database
      const existingCourse = await Course.findById(id, {
        preRequisiteCourses: 1,
      });
      const existingPreRequisiteIds = existingCourse?.preRequisiteCourses.map(
        (prereq: any) => prereq.course.toString(),
      );

      // Filter out any new prerequisites that already exist
      const filteredNewPreRequisites = newPreRequisite.filter(
        (el) => !existingPreRequisiteIds?.includes(el.course),
      );

      if (filteredNewPreRequisites.length > 0) {
        await Course.findByIdAndUpdate(id, {
          $addToSet: {
            preRequisiteCourses: { $each: filteredNewPreRequisites },
          },
        });
      }
    }
  }

  // Step 3: Fetch and return the updated course with populated prerequisites
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );

  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
};
