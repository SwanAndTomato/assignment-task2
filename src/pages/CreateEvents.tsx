import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';

export default function CreateEvents(props: StackScreenProps<any>) {
    const { navigation } = props;
    const handleNavigateToEventsMap = () => {
        navigation.navigate('EventsMap')
        };    
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventLocation, setEventLocation] = useState({ latitude: 51.04112, longitude: -114.069325 });
    
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleCreateEvent = () => {
        if (!eventName || !eventDescription || !eventLocation) {
            Alert.alert('Validation Error', 'Please complete all fields.');
            return;
        }

        const newEvent = {
            id: Date.now().toString(), // Unique ID for the event (timestamp-based)
            name: eventName,
            description: eventDescription,
            date: eventDate,
            location: eventLocation,
        };

        // Save to storage, API call, or navigation back to the EventsMap with the new event
        console.log('Event Created:', newEvent);

        Alert.alert('Success', 'Event created successfully!', [
            { text: 'OK', onPress: () => navigation.navigate('EventsMap') },
        ]);

        // You would typically send this event to a backend or local storage
    };

    const handleMapPress = (e: any) => {
        setEventLocation(e.nativeEvent.coordinate);
    };

    return (
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
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
        alignItems: 'center',
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
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    textArea: {
        height: 80,
    },
    map: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    mapStyle: {
        ...StyleSheet.absoluteFillObject,
    },

    logoutButton: {
        position: 'absolute',
        top: 70,
        right: 24,

        elevation: 3,
    },

    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,

        backgroundColor: '#FFF',
        borderRadius: 16,
        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3,
    },

    footerText: {
        fontFamily: 'Nunito_700Bold',
        color: '#8fa7b3',
    },

    smallButton: {
        width: 56,
        height: 56,
        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',
    },
});

/*<View style={styles.footer}>
                <Text style={styles.footerText}>{events.length} found</Text>
                <RectButton
                    style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
                    onPress={handleNavigateToCreateEvent}
                >
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
            */