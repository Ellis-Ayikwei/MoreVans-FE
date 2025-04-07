import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  contactName: Yup.string().required('Name is required'),
  contactPhone: Yup.string().required('Phone number is required'),
  contactEmail: Yup.string().email('Invalid email').required('Email required'),
  pickupLocation: Yup.string().required('Pickup location required'),
  dropoffLocation: Yup.string().required('Dropoff location required'),
  itemType: Yup.string().required('Service type required'),
  itemSize: Yup.string().required('Item size required'),
  preferredDate: Yup.string().required('Date required'),
  preferredTime: Yup.string().required('Time required'),
  estimatedValue: Yup.string().required('Value estimate required'),
  pickupNumberOfFloors: Yup.number()
    .when('itemType', {
      is: (itemType: string) => ['Residential Moving', 'Office Relocation'].includes(itemType),
      then: Yup.number().required('Pickup floors required').min(1, 'At least 1 floor'),
    }),
  dropoffNumberOfFloors: Yup.number()
    .when('itemType', {
      is: (itemType: string) => ['Residential Moving', 'Office Relocation'].includes(itemType),
      then: Yup.number().required('Dropoff floors required').min(1, 'At least 1 floor'),
    }),
});