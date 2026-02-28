import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTasks } from "../TasksContext";

export default function CreateTask() {
  const router = useRouter();
  const { addTask } = useTasks();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // كل مرة الصفحة تظهر، نرجع القيم للـ default
  useFocusEffect(
    useCallback(() => {
      setTaskTitle("");
      setTaskNotes("");
      setSelectedDate(new Date());
    }, [])
  );

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const getDateLabel = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString()
      ? "Today"
      : selectedDate.toDateString();
  };

  const handleSave = () => {
    if (!taskTitle.trim()) {
      Alert.alert("Validation", "Please enter a task title");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      notes: taskNotes,
      date: selectedDate.toDateString(),
      done: false,
    };

    addTask(newTask); 
    router.push("/home"); 
  };

  const handleCancel = () => {
    if (taskTitle.trim() || taskNotes.trim()) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to leave?",
        [
          { text: "Stay", style: "cancel" },
          { text: "Leave", onPress: () => router.push("/home") },
        ]
      );
    } else {
      router.push("/home");
    }
  };

  const handleBackgroundPress = () => {
    Keyboard.dismiss();
    hideDatePicker();
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.newTask}>New Task</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.taskInput}>
            <Text style={styles.label}>Task</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter task..."
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
          </View>

          <View style={styles.dateSelect}>
            <View style={styles.heading}>
              <Image
                source={require("../../assets/images/date.png")}
                style={styles.iconDate}
              />
              <Text style={styles.date}>Date</Text>
            </View>

            <TouchableOpacity style={styles.todayButton} onPress={showDatePicker}>
              <Text style={styles.today}>{getDateLabel()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.taskInput}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.inputBox, { height: 150 }]}
              placeholder="Enter notes..."
              multiline
              value={taskNotes}
              onChangeText={setTaskNotes}
            />
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={selectedDate}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
            <Text style={styles.saveThisTask}>Save This Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: { padding: 16, backgroundColor: "#f8fbff" },
  newTask: { fontSize: 20, fontWeight: "500", color: "#0560FA" },
  scrollContent: { flexGrow: 1, padding: 16, justifyContent: "flex-start" },
  taskInput: { marginBottom: 20 },
  label: { fontSize: 14, color: "#318FFF", marginBottom: 8 },
  inputBox: {
    borderWidth: 1.2,
    borderColor: "#318FFF",
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconDate: { width: 22, height: 22, resizeMode: "contain" },
  heading: { flexDirection: "row", alignItems: "center", columnGap: 10 },
  date: { fontSize: 14, color: "#000" },
  todayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f8fbff",
    borderRadius: 10,
  },
  today: { color: "#318FFF", fontSize: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddecff",
  },
  buttonCancel: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#f8fbff",
    borderRadius: 100,
  },
  cancel: { color: "#318FFF", fontSize: 16, textAlign: "center" },
  buttonSave: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#318FFF",
    borderRadius: 100,
  },
  saveThisTask: { color: "#fff", fontSize: 16, textAlign: "center" },
});