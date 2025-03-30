import { useState } from 'react';
import DateTimePicker, {
  IOSNativeProps,
} from '@react-native-community/datetimepicker';

const DatePicker = (props: IOSNativeProps) => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <DateTimePicker
      {...props}
      value={date}
      mode="datetime"
      onChange={(_, selectedDate) => setDate(selectedDate ?? new Date())}      
    />
  );
};

export default DatePicker;
