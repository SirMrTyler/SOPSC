
import * as Yup from "yup";

const validBlogSchema = Yup.object().shape({
  blogTypeId: Yup.number().min(1, "Please select a valid blog type").required("Blog Type is required"),
  authorId: Yup.number().required("You must be logged in to create a blog"),
  title: Yup.string().max(100).required("Blog Title is required"),
  subject: Yup.string().max(50).required("Blog Subject is required"),
  content: Yup.string().max(4000).required("Blog Content is required"),
  isPublished: Yup.boolean().required(),
  imageUrl: Yup.string().max(255)
})

export default validBlogSchema;