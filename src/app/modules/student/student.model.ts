import { model, Schema } from 'mongoose';
import validator from 'validator';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'First name can not be more than 20 characters'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in right format',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    validate: {
      validator: (value) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father name is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father name is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Father name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Father name is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Father name is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
  },
  occupation: {
    type: String,
  },
  contactNo: {
    type: String,
  },
  address: {
    type: String,
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, unique: true },
  name: {
    type: userNameSchema,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    unique: true,
    ref: 'User',
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not valid.',
    },
    required: true,
  },
  dateOfBirth: { type: String },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: '{VALUE} is not an valid email.',
    },
  },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  },
  presentAddress: {
    type: String,
    required: true,
  },
  permanentAddress: { type: String, required: true },
  guardian: {
    type: guardianSchema,
    required: true,
  },
  localGuardian: {
    type: localGuardianSchema,
    required: true,
  },
  profileImage: { type: String },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

//query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('find', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      isDeleted: {
        $ne: true,
      },
    },
  });
  next();
});

//creating a custom static method

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
};

//creating a custom instance method
// studentSchema.methods.isUserExist = async function(id: string) {
//   const existingUser = await Student.findOne({id});

//   return existingUser
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
