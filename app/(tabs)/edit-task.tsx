import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { Task, useTasks } from "../TasksContext";

export default function EditTask() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { tasks, updateTask, deleteTask } = useTasks();
  const task = tasks.find((t) => t.id === id);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
  const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (task) {
            setTaskTitle(task.title);
            setTaskNotes(task.notes);
            setSelectedDate(new Date(task.date));
        } else {
            router.replace("/home");
        }
    }, [task, mounted]);

  const handleSave = () => {
    if (!taskTitle.trim()) {
      Alert.alert("Validation", "Enter a task title");
      return;
    }

    const updatedTask: Task = {
      id: task!.id,
      title: taskTitle,
      notes: taskNotes,
      date: selectedDate.toDateString(),
      done: task!.done,
    };

    updateTask(updatedTask);
    router.replace("/home");
  };

  const handleDelete = () => {
    Alert.alert("Delete Task?", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTask(task!.id);
          router.push("/home"); 
        },
      },
    ]);
  };

  const handleBackgroundPress = () => {
    Keyboard.dismiss();
    setDatePickerVisibility(false);
  };

  if (!task) return null;

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <Text style={styles.editTask}>Edit Task</Text>
          <TouchableOpacity onPress={handleDelete}>
            <Image
              source={require("../../assets/images/delete.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>

        {/* SCROLL CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter task..."
            value={taskTitle}
            onChangeText={setTaskTitle}
          />

          {/* Date Row */}
          <View style={styles.dateRow}>
            <View style={styles.heading}>
              <Image
                source={require("../../assets/images/date.png")}
                style={styles.iconDate}
              />
              <Text style={styles.date}>Date</Text>
            </View>            
            <TouchableOpacity
                style={styles.todayButtonRow}
                onPress={() => setDatePickerVisibility(true)}
            >
                <Text style={styles.today}>
                    {isToday(selectedDate) ? "Today" : selectedDate.toDateString()}
                </Text>          
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.inputBox, { height: 120 }]}
            placeholder="Enter notes..."
            multiline
            value={taskNotes}
            onChangeText={setTaskNotes}
          />

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={selectedDate}
            onConfirm={(date) => {
              setSelectedDate(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </ScrollView>

        {/* SAVE & CANCEL BUTTONS */}
        <View style={styles.footer}>
            {/* Cancel Button */}
            <TouchableOpacity
                style={[styles.buttonSave, styles.buttonCancel]}
                onPress={() => router.back()} 
            >
                <Text style={[styles.saveThisTask, { color: "#318FFF" }]}>Cancel</Text>
            </TouchableOpacity>

            {/* Save Changes Button */}
            <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
                <Text style={styles.saveThisTask}>Save Changes</Text>
            </TouchableOpacity>
        </View>
            
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    padding: 16,
    backgroundColor: "#f8fbff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editTask: { fontSize: 20, fontWeight: "500", color: "#0560FA" },
  scrollContent: { flexGrow: 1, padding: 16 },
  label: { fontSize: 14, color: "#318FFF", marginBottom: 8, marginTop: 16 },
  inputBox: {
    borderWidth: 1.2,
    borderColor: "#318FFF",
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#fff",
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
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginTop: 16,
    marginBottom: 8,
 },
  todayButtonRow: {
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
saveThisTask: { 
    color: "#fff", 
    fontSize: 16, 
    textAlign: "center" 
},
  buttonSave: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#318FFF",
    borderRadius: 100,
  },
});