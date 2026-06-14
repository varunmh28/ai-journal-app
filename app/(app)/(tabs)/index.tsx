
import { AppColors } from '@/constants/theme';
import { useStreaks } from '@/hooks/use-streaks';
import { formatUppercaseDate, getTimeOfDayGreeting } from '@/lib/utils/date';
import { getUserFirstName } from '@/lib/utils/user';
import { useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spinner, Text, View } from 'tamagui';

export default function HomeScreen() {

  const { user, isLoaded } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    currentStreak,
    longestStreak,
    isActive,
    statusMessage,
    daysUntilNextMilestone,
    nextMilestone,
    isLoading: streaksLoading,
  } = useStreaks();

  // Format current date and get greeting using utilities
  const now = new Date();
  const formattedDate = formatUppercaseDate(now);
  const greeting = getTimeOfDayGreeting();
  const userName = getUserFirstName(user);


  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Spinner size="large" />
        </View>
      </SafeAreaView>
    );
  }

  
  return (
    
    <View>
      <Text>Home</Text>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.gray500,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderColor: AppColors.gray300,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  todayCircle: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  moodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
  },
  quoteContainer: {
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

