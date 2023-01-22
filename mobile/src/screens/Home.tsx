import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();
const minimunSummarizedDatesSize = 18 * 5;
const amountOfDatesToFill =
  minimunSummarizedDatesSize - datesFromYearStart.length + 1;

type Summary = Array<{
  id: string;
  date: string;
  completed: number;
  amount: number;
}>;

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<Summary>([]);
  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setIsLoading(true);

      const { data } = await api.get("/summary");
      setSummary(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Ops...", "Não foi possível carregar o sumário de hábitos.");
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isLoading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary.length > 0 && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayWithHabit = summary.find((day) =>
                dayjs(date).isSame(day.date, "day")
              );

              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  completed={dayWithHabit?.completed}
                  amount={dayWithHabit?.amount}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                />
              );
            })}

            {amountOfDatesToFill > 0 &&
              Array.from({ length: amountOfDatesToFill }).map((_, index) => (
                <View
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  key={index}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
