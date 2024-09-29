import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import customMapStyle from '../../map-style.json';
import * as MapSettings from '../constants/MapSettings';
import { AuthenticationContext } from '../context/AuthenticationContext';
import mapMarkerImg from '../images/map-marker.png';
import mapMarkerBlueImg from '../images/map-marker-blue.png';
import mapMarkerGreyImg from '../images/map-marker-grey.png';
import { EventDetails } from '../types/Event';
import { fetchEvent } from '../services/api';

export default function EventsMap(props: StackScreenProps<any>) {
    const { navigation } = props;
    const authenticationContext = useContext(AuthenticationContext);
    const mapViewRef = useRef<MapView>(null);
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the logged-in user's ID
        const fetchUserId = async () => {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (userInfo) {
                const user = JSON.parse(userInfo);
                setUserId(user.id);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
 
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://192.168.0.18:3333/events');
                const data = await response.json();
                const eventPromises = data.map((event: { id: string }) => fetchEvent(event.id));
                const eventResponses = await Promise.all(eventPromises);
                const eventsData = eventResponses.map((response) => response.data);
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);
    
    const handleNavigateToCreateEvent = () => {
    navigation.navigate('CreateEvents')
    };

    const handleNavigateToEventDetails = (eventId: string) => {
        navigation.navigate('EventsDetail',{eventId});
    };

    const handleLogout = async () => {
        AsyncStorage.multiRemove(['userInfo', 'accessToken']).then(() => {
            authenticationContext?.setValue(undefined);
            navigation.navigate('Login');
        });
    };

    const getMarkerImage = (event: EventDetails) => {
        if (userId && event.volunteersIds.includes(userId)) {
            return mapMarkerBlueImg;
        } else if (event.volunteersIds.length >= event.volunteersNeeded) {
            return mapMarkerGreyImg;
        } else {
            return mapMarkerImg;
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapViewRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={MapSettings.DEFAULT_REGION}
                style={styles.mapStyle}
                customMapStyle={customMapStyle}
                showsMyLocationButton={false}
                showsUserLocation={true}
                rotateEnabled={false}
                toolbarEnabled={false}
                moveOnMarkerPress={false}
                mapPadding={MapSettings.EDGE_PADDING}
                onLayout={() =>
                    mapViewRef.current?.fitToCoordinates(
                        events.map(({ position }) => ({
                            latitude: position.latitude,
                            longitude: position.longitude,
                        })),
                        { edgePadding: MapSettings.EDGE_PADDING }
                    )
                }
            >
                {events.map((event) => {
                    return (
                        <Marker
                            key={event.id}
                            coordinate={{
                                latitude: event.position.latitude,
                                longitude: event.position.longitude,
                            }}
                            onPress={() => handleNavigateToEventDetails(event.id)}
                        >
                            <Image resizeMode="contain" style={{ width: 48, height: 54 }} source={getMarkerImage(event)} />
                        </Marker>
                    );
                })}
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>{events.length} found</Text>
                <RectButton
                    style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
                    onPress={handleNavigateToCreateEvent}
                >
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
            <RectButton
                style={[styles.logoutButton, styles.smallButton, { backgroundColor: '#4D6F80' }]}
                onPress={handleLogout}
            >
                <Feather name="log-out" size={20} color="#FFF" />
            </RectButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
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

interface event {
    id: string;
    position: {
        latitude: number;
        longitude: number;
    };
}

