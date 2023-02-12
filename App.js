import React, { useState, useEffect } from "react";
import Moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  DatePickerIOS,
  View,
  StyleSheet,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  AsyncStorage,
  Alert,
} from "react-native";

export default function App() {
  const initalState = {
    id: 0,
    text: "",
    date: new Date(),
    active: false,
  };
  const [reminder, setReminder] = useState([]);
  const [newReminder, setNewReminder] = useState(initalState);
  const [showModal, setShowModal] = useState(false);

  const [chosenDate, setChosenDate] = useState(new Date());

  //Moment.locale("en");

  const getReminders = async () => {
    const reminders = await AsyncStorage.getItem("reminder");
    setReminder(JSON.parse(reminders) ? JSON.parse(reminders) : []);
  };

  useEffect(() => {
    getReminders();
  }, []);

  const handleChange = (text, value) =>
    setNewReminder({ ...newReminder, [text]: value });
  const clear = () => setNewReminder(initalState);

  const addReminder = () => {
    if (!newReminder.text) {
      alert("Invalid Reminder");
      return;
    }
    newReminder.id += reminder.length + 1;
    newReminder.date =
      chosenDate.toLocaleDateString() + " " + chosenDate.toLocaleTimeString();
    const updatedReminder = [newReminder, ...reminder];
    setReminder(updatedReminder);
    AsyncStorage.setItem("reminder", JSON.stringify(updatedReminder));
    setShowModal(false);
  };

  const updateReminder = (item) => {
    const ReminderToUpdate = reminder.filter(
      (reminderItem) => reminderItem.id == item.id
    );
    ReminderToUpdate[0].active = !ReminderToUpdate[0].active;

    const remainingReminders = reminder.filter(
      (reminderItem) => reminderItem.id != item.id
    );
    const updatedReminder = [...ReminderToUpdate, ...remainingReminders];

    setReminder(updatedReminder);
    AsyncStorage.setItem("reminder", JSON.stringify(updatedReminder));
  };

  const displayReminder = (item) => (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",

        paddingHorizontal: 20,
        borderBottomColor: "black",
        borderBottomWidth: 1,
      }}
      onPress={() =>
        Alert.alert(`${item.text}`, `${item.date}`, [
          {
            text: item.active ? "Completed" : "Set Reminder",
            onPress: () => updateReminder(item),
          },
          {
            text: "Ok",
            style: "cancel",
          },
        ])
      }
    >
      <Text style={{ color: "black", fontSize: 20, marginLeft: 1 }}>
        {item.text + " "}
        {item.date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginHorizontal: 20 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 100,
        }}
      >
        <View>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Reminders App
          </Text>
          <Text style={{ fontSize: 20, marginTop: 20 }}>
            {reminder.length} Reminders are there!
          </Text>
        </View>
        <Image
          source={require("./assets/remindersicon.png")}
          style={{ height: 100, width: 100, marginTop: -30 }}
        />
      </View>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "blue",
          marginTop: -80,
        }}
      >
        Reminder List 🗓️
      </Text>
      <KeyboardAwareScrollView>
        <View style={{ height: 200 }}>
          {reminder.map((item) =>
            !item.active ? displayReminder(item) : null
          )}
        </View>
      </KeyboardAwareScrollView>
      <Text style={{ color: "red", fontSize: 25, fontWeight: "bold" }}>
        Active Reminders ✏️
      </Text>
      <ScrollView>
        <View style={{ height: 200 }}>
          {reminder.map((item) => (item.active ? displayReminder(item) : null))}
        </View>
      </ScrollView>
      <View
        style={{
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "green",
            borderRadius: 50,
            width: 350,
            marginTop: 50,
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: "bold", color: "yellow" }}>
            Add Reminder
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 100,
            }}
          >
            <View>
              <Text
                style={{ fontSize: 30, fontWeight: "bold", marginLeft: 30 }}
              >
                Reminders App
              </Text>
            </View>
            <Image
              source={require("./assets/remindersicon.png")}
              style={{ height: 100, width: 100, marginTop: -30 }}
            />
          </View>
          <Text
            style={{
              marginVertical: -50,
              color: "black",
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 30,
            }}
          >
            Add a reminder
          </Text>
          <TextInput
            placeholder="Type Reminder Here"
            value={newReminder.text}
            onChangeText={(text) => handleChange("text", text)}
            multiline={true}
            numberOfLines={2}
            style={{
              backgroundColor: "#fff0ff",
              borderRadius: 60,
              paddingVertical: 20,
              paddingHorizontal: 20,
              marginTop: 80,
            }}
          />
          <DatePickerIOS
            date={chosenDate}
            onDateChange={setChosenDate}
            mode="datetime"
          />
          <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableOpacity
              onPress={addReminder}
              style={{
                backgroundColor: "orange",
                width: 100,
                borderRadius: 10,
                alignItems: "center",
                padding: 10,
              }}
            >
              <Text
                style={{ color: "black", fontWeight: "bold", fontSize: 25 }}
              >
                Add
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                backgroundColor: "#f43423",
                width: 100,
                borderRadius: 10,
                alignItems: "center",
                padding: 10,
                marginTop: 80,
              }}
            >
              <Text
                style={{ color: "black", fontWeight: "bold", fontSize: 25 }}
              >
                Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
