import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTasks } from "../TasksContext";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 44;

const generateDates = () => {
  const today = new Date();
  const dates: { id: string; date: Date; isToday: boolean }[] = [];
  for (let i = -365; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      id: d.toISOString(),
      date: d,
      isToday:
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear(),
    });
  }
  return dates;
};

export default function HomeScreen() {
  const { tasks, toggleTask, deleteTask } = useTasks();
  const dates = React.useMemo(() => generateDates(), []);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const todayIndex = dates.findIndex((d) => d.isToday);
  const [selectedIndex, setSelectedIndex] = useState(todayIndex);
  const [selectedDate, setSelectedDate] = useState(dates[todayIndex].date);
  const [showPicker, setShowPicker] = useState(false);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (todayIndex >= 0 && flatListRef.current) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: todayIndex,
          animated: false,
          viewPosition: 0.5,
        });
        setSelectedIndex(todayIndex);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [todayIndex]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setSelectedDate(dates[index].date);
    const offset = index * (ITEM_WIDTH + 10) - width / 2 + ITEM_WIDTH / 2;
    flatListRef.current?.scrollToOffset({ offset, animated: true });
  };

  const handleBackgroundPress = () => {
    Keyboard.dismiss();
    setShowPicker(false);
  };

  const tasksForSelectedDate = tasks.filter(
    (t) => t.date === selectedDate.toDateString()
  );

  const handleClearDateTasks = () => {
    if (tasksForSelectedDate.length === 0) return;

    Alert.alert(
      "Clear Tasks",
      `Are you sure you want to delete all tasks for ${selectedDate.toDateString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            tasksForSelectedDate.forEach((task) => deleteTask(task.id));
          },
        },
      ]
    );
  };
  const handleDelete = (taskId: string) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTask(taskId),
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.leftTitleContainer}>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Image
                source={require("../../assets/images/date.png")}
                style={styles.leftIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>
              {selectedDate.toDateString() === new Date().toDateString()
                ? "Today"
                : selectedDate.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleClearDateTasks}>
              <Image
                source={require("../../assets/images/clear.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* DATE PICKER */}
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowPicker(false);
              if (event.type === "set" && date) {
                setSelectedDate(date);
                const newIndex = dates.findIndex(
                  (d) => d.date.toDateString() === date.toDateString()
                );
                if (newIndex !== -1) handleSelect(newIndex);
              }
            }}
          />
        )}

        {/* DATE SCROLLER */}
        <FlatList
          ref={flatListRef}
          horizontal
          data={dates}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 10, flexGrow: 0 }}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH + 10,
            offset: (ITEM_WIDTH + 10) * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const isSelected = index === selectedIndex;
            return (
              <TouchableOpacity
                onPress={() => handleSelect(index)}
                style={[styles.dateBox, isSelected && styles.activeDateBox]}
              >
                <View style={styles.dayContainer}>
                  <Text
                    style={[styles.dayText, isSelected && styles.activeDayText]}
                  >
                    {dayNames[item.date.getDay()]}
                  </Text>
                </View>
                <View
                  style={[
                    styles.dateContainer,
                    isSelected && styles.activeDateContainer,
                  ]}
                >
                  <Text
                    style={[styles.dateText, isSelected && styles.activeDateText]}
                  >
                    {item.date.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* TASKS LIST */}
        {tasksForSelectedDate.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/images/empty.png")}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>No to-dos</Text>
          </View>
        ) : (
          <FlatList
            data={tasksForSelectedDate}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 20 }}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <TouchableOpacity
                  style={[styles.checkBox, item.done && styles.checkedBox]}
                  onPress={() => toggleTask(item.id)}
                >
                  {item.done && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1, marginLeft: 12 }}
                  onPress={() =>
                    router.push(`/edit-task?id=${item.id}`)
                  }
                >
                  <Text
                    style={[styles.taskTitle, item.done && styles.doneText]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Image
                    source={require("../../assets/images/delete.png")}
                    style={{ width: 24, height: 24, tintColor: "red" }}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* FLOAT BUTTON */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/create-task")}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>

        <StatusBar style="dark" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { height: 70, backgroundColor: "#F8FBFF", justifyContent: "center" },
  leftTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  title: { fontSize: 22, fontWeight: "600", color: "#0560FA", marginLeft: 8 },
  leftIcon: { width: 24, height: 24 },
  headerIcons: { position: "absolute", right: 20, flexDirection: "row", alignItems: "center" },
  icon: { width: 24, height: 24, marginLeft: 15, resizeMode: "contain" },
  dateBox: {
    width: ITEM_WIDTH,
    borderRadius: 12,
    backgroundColor: "#EEF5FF",
    marginRight: 10,
    overflow: "hidden",
  },
  dayContainer: { paddingVertical: 4, justifyContent: "center", alignItems: "center" },
  dateContainer: { paddingVertical: 6, justifyContent: "center", alignItems: "center", backgroundColor: "#DDECFF" },
  activeDateContainer: { backgroundColor: "#318FFF" },
  activeDateBox: { backgroundColor: "#0560FA", borderColor: "#0560FA" },
  dayText: { fontSize: 10, color: "#76B5FF" },
  dateText: { fontSize: 16, fontWeight: "500", color: "#76B5FF" },
  activeDayText: { color: "#fff" },
  activeDateText: { color: "#fff", fontWeight: "500" },
  emptyContainer: { position: "absolute", top: "50%", left: 0, right: 0, transform: [{ translateY: -55 }], justifyContent: "center", alignItems: "center" },
  emptyIcon: { width: 110, height: 110, marginBottom: 10 },
  emptyText: { fontSize: 16, color: "#54A2FF" },
  fab: { position: "absolute", right: 20, bottom: 40, width: 55, height: 55, borderRadius: 14, backgroundColor: "#0560FA", justifyContent: "center", alignItems: "center", elevation: 6 },
  plus: { color: "#fff", fontSize: 30, fontWeight: "bold" },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
  },
  taskTitle: { fontSize: 16, fontWeight: "600", color: "#0560FA" },
  taskNotes: { fontSize: 14, color: "#318FFF", marginTop: 4 },
  checkBox: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: "#0560FA",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkedBox: {
    backgroundColor: "#0560FA",
  },
  check: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  doneText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});