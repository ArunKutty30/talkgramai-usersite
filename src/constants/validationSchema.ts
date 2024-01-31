import * as Yup from "yup";

export const feedbackValidationSchema = Yup.object({
  status: Yup.string().required("This field is required"),
  confidenceRating: Yup.number()
    .min(1, "This field is required")
    .required("This field is required"),
  fluencyRating: Yup.number().min(1, "This field is required").required("This field is required"),
  pronounciationRating: Yup.number()
    .min(1, "This field is required")
    .required("This field is required"),
  vocabulary: Yup.string().required("This field is required"),
  grammer: Yup.object({
    tenses: Yup.string().required("This field is required"),
    articlesAndPrepositions: Yup.string().required("This field is required"),
    subjectVerb: Yup.string().required("This field is required"),
    other: Yup.string(),
  }),
});

export const bookSessionValidationSchema = Yup.object({
  topic: Yup.string().required("Please choose a topic"),
  description: Yup.string().max(250, "maximum 250 characters are allowed"),
  topicInfo: Yup.object().when("topic", (value) => {
    if (value.length && value[0] === "Custom Topic") {
      return Yup.object({
        title: Yup.string().required("This field is required"),
        category: Yup.string().required("This field is required"),
      });
    }
    return Yup.object({
      title: Yup.string(),
      category: Yup.string(),
    });
  }),
});

export const bookDemoSessionValidationSchema = Yup.object({
  topic: Yup.string().required("Please choose a topic"),
  description: Yup.string().max(250, "maximum 250 characters are allowed"),
  topicInfo: Yup.object().when("topic", (value) => {
    if (value.length && value[0] === "Custom Topic") {
      return Yup.object({
        title: Yup.string().required("This field is required"),
        category: Yup.string().required("This field is required"),
      });
    }
    return Yup.object({
      title: Yup.string(),
      category: Yup.string(),
    });
  }),
});
