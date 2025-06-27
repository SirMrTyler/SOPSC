import * as Yup from "yup";

const basicForumSchema = Yup.object().shape({
    name: Yup.string()
        .required("Forum Name is required"),
    description: Yup.string()
        .max(50)
        .required("Description is required"),
    forumCategoryId: Yup.number()
        .required("Forum Category is required"),
    privacySettings: Yup.boolean()
        .required("Privacy Settings is required"),
    openOrClosed: Yup.boolean()
        .required("Open or Closed is required")
});

export default basicForumSchema