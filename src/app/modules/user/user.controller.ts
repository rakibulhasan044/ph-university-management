

  const createStudent = async (req: Request, res: Response) => {
    try {
  
      const { student: studentData } = req.body;
  
      //data validation using joi
      // const {error, value} = studentValidationSchema.validate(studentData);
  
      //data validation using zod
  
      const zodParseData = studentValidationSchema.parse(studentData)
      
      const result = await StudentServices.createStudentIntoDB(zodParseData);
  
      // if(error) {
      //   res.status(500).json({
      //     success: false,
      //     message: 'Something wen wrong',
      //     error: error.details
      //   });
      // }
  
      res.status(200).json({
        success: true,
        message: 'Student is created successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Something wen wrong',
        error: error
      });
    }
  };