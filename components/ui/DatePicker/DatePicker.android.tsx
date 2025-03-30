import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import {
  AndroidNativeProps,
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { ButtonType, ThemedButton } from '../ThemedButton';
import { useThemeProperty } from '@/hooks/useTheme';

const DatePicker = (props: AndroidNativeProps) => {
  const [date, setDate] = useState<Date>(new Date());

  const onChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setDate(currentDate ?? new Date());
  };
  const showMode = (currentMode: 'date' | 'time') => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={styles.androidDateTime}>
      <ThemedButton
        {...props}
        type={ButtonType.Secondary}
        onPress={showDatepicker}
        title={date.toLocaleDateString([], {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
        style={styles.androidButton}
      />
      <ThemedButton
        {...props}
        type={ButtonType.Secondary}
        onPress={showTimepicker}
        title={date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
        style={styles.androidButton}
      />
    </View>
  );
};

const smallSpacing = useThemeProperty('smallSpacing');

const styles = StyleSheet.create({
  androidDateTime: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: smallSpacing,
  },
  androidButton: {
    paddingHorizontal: smallSpacing,
  },
});
export default DatePicker;
