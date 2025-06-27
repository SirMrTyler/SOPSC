import * as Yup from "yup";

const testsSchema = {};

testsSchema.testSearchSchema = () => {
    return (Yup.object().shape({
        search: Yup.string()
          .min(1, "Search must have at least 1 character")
          .required("Search is required"),
        }));
} 

testsSchema.testUpdateSchema = () => {
    return (Yup.object().shape({
        name: Yup.string()
          .min(1, "Name must have at least 1 character")
          .max(100, "Cannot exeed 100 characters")
          .required("Name is required"),
        description: Yup.string()
          .min(1, "Name must have at least 1 character")
          .max(100, "Cannot exeed 100 characters")
          .required("Description is required"),
        statusId: Yup.number().min(1).max(5).required("You must make a selection"),
        testTypeId: Yup.number().min(1).max(5).required("You must make a selection"),
      }));
}
testsSchema.testQuerySchema = () => {
  return (Yup.object({
    title: Yup.string()
      .min(1, "Search must have at least 1 character")
      .required("Search is required"),
  }));
}

export default testsSchema;