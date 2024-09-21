import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EventsDetail({ route }) {
    const { eventId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Event Details for {eventId}</Text>
            {/* Add more details about the event here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
