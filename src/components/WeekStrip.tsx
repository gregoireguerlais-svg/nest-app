import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, fonts, spacing } from '@/theme';
import { addDays, DAY_LABELS, formatShortDate, isSameDay, startOfWeek } from '@/utils/date';

type Props = {
  selectedDate: Date;
  today: Date;
  onSelect: (date: Date) => void;
};

export function WeekStrip({ selectedDate, today, onSelect }: Props) {
  const monday = startOfWeek(selectedDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const isCurrentWeek = isSameDay(monday, startOfWeek(today));

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Semaine précédente" hitSlop={12} onPress={() => onSelect(addDays(selectedDate, -7))}>
          <ChevronLeft size={22} color={colors.sage} strokeWidth={1.75} />
        </Pressable>
        <AppText variant="caption" muted>
          {isCurrentWeek ? 'Cette semaine' : `Semaine du ${formatShortDate(monday)}`}
        </AppText>
        <Pressable accessibilityLabel="Semaine suivante" hitSlop={12} onPress={() => onSelect(addDays(selectedDate, 7))}>
          <ChevronRight size={22} color={colors.sage} strokeWidth={1.75} />
        </Pressable>
      </View>
      <View style={styles.row}>
        {days.map((day, i) => {
          const selected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelect(day)}
              style={[styles.day, selected && styles.daySelected, !selected && isToday && styles.dayToday]}>
              <Text style={[styles.dayLabel, { color: selected ? colors.surface : colors.muted }]}>{DAY_LABELS[i]}</Text>
              <Text style={[styles.dayNumber, { color: selected ? colors.surface : colors.text }]}>{day.getDate()}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  day: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  daySelected: { backgroundColor: colors.sage, borderColor: colors.sage },
  dayToday: { borderColor: colors.sage, borderWidth: 2 },
  dayLabel: { fontFamily: fonts.semibold, fontSize: 12 },
  dayNumber: { fontFamily: fonts.bold, fontSize: 17, marginTop: 2 },
});
