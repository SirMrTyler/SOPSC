import * as Yup from 'yup'; 

const analyticsDatePickSchema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
  });

  export default analyticsDatePickSchema;