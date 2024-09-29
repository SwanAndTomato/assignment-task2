import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { saveEvent } from '../services/api'; // Import the save function
import { EventDetails } from '../types/Event'; // Import the EventDetails interface

export default function CreateEvents(props: StackScreenProps<any>) {
    const { navigation } = props;
    const handleNavigateToEventsMap = () => {
        navigation.navigate('EventsMap');
    };

    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventLocation, setEventLocation] = useState({ latitude: 51.04112, longitude: -114.069325 });
    const [eventImageUrl, setEventImageUrl] = useState('');
    const [eventVolunteersNeeded, setEventVolunteersNeeded] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleCreateEvent = async () => {
        if (!eventName || !eventDescription || !eventLocation || !eventImageUrl || !eventVolunteersNeeded) {
            Alert.alert('Validation Error', 'Please complete all fields.');
            return;
        }

        const newEvent: EventDetails = {
            id: Date.now().toString(), // Unique ID for the event (timestamp-based)
            name: eventName,
            dateTime: eventDate.toISOString(),
            description: eventDescription,
            imageUrl: eventImageUrl,
            organizerId: '', // Set this to the logged-in user's ID
            volunteersNeeded: eventVolunteersNeeded,
            volunteersIds: [],
            position: eventLocation,
        };

        try {
            await saveEvent(newEvent); // Save the event to db.json
            Alert.alert('Success', 'Event created successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('EventsMap') },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to create event.');
        }
    };

    const handleMapPress = (e: any) => {
        setEventLocation(e.nativeEvent.coordinate);
    };

    return (
        <ScrollView>
        <View style={styles.container}>
            <Text style={styles.label}>Event Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter event name"
                value={eventName}
                onChangeText={setEventName}
            />
            <Text style={styles.label}>Event Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter event description"
                value={eventDescription}
                onChangeText={setEventDescription}
                multiline={true}
                numberOfLines={4}
            />
            <Text style={styles.label}>Event Date</Text>
            <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={eventDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || eventDate;
                        setShowDatePicker(false);
                        setEventDate(currentDate);
                    }}
                />
            )}
            <Text style={styles.label}>Event Image URL</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter event image URL"
                value={eventImageUrl}
                onChangeText={setEventImageUrl}
            />
            <Text style={styles.label}>Volunteers Needed</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter number of volunteers needed"
                value={eventVolunteersNeeded.toString()}
                onChangeText={(text) => setEventVolunteersNeeded(Number(text))}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Select Event Location</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: eventLocation.latitude,
                    longitude: eventLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
            >
                <Marker coordinate={eventLocation} />
            </MapView>
            <RectButton
                style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
                onPress={handleCreateEvent}
            >
                <Feather name="check" size={20} color="#FFF" />
            </RectButton>
            <RectButton
                style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
                onPress={handleNavigateToEventsMap}
            >
                <Feather name="arrow-left" size={20} color="#FFF" />
            </RectButton>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    textArea: {
        height: 80,
    },
    map: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    smallButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
});