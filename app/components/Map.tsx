import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MapUser {
  id: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
  status: 'active' | 'idle' | 'offline';
  activity: string;
  completedGoals: number;
}

const mockUsers: MapUser[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: '👨‍💻',
    x: 20,
    y: 30,
    status: 'active',
    activity: 'Deep Coding Session',
    completedGoals: 12,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '🏃‍♀️',
    x: 75,
    y: 25,
    status: 'active',
    activity: 'Morning Run',
    completedGoals: 18,
  },
  {
    id: '3',
    name: 'Mike Davis',
    avatar: '📚',
    x: 45,
    y: 60,
    status: 'idle',
    activity: 'Reading Session',
    completedGoals: 8,
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar: '🎨',
    x: 80,
    y: 70,
    status: 'active',
    activity: 'Design Sprint',
    completedGoals: 15,
  },
  {
    id: '5',
    name: 'James Brown',
    avatar: '💪',
    x: 30,
    y: 80,
    status: 'offline',
    activity: 'Workout Complete',
    completedGoals: 10,
  },
  {
    id: '6',
    name: 'Lisa Chen',
    avatar: '🧘‍♀️',
    x: 60,
    y: 45,
    status: 'active',
    activity: 'Meditation Practice',
    completedGoals: 22,
  },
];

export default function MapScreen() {
  const { width, height } = Dimensions.get('window');
  const pulseAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    mockUsers.forEach((user) => {
      if (!pulseAnims[user.id]) {
        pulseAnims[user.id] = new Animated.Value(0);
      }

      if (user.status === 'active') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnims[user.id], {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnims[user.id], {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    });
  }, []);

  const UserPin = ({ user }: { user: MapUser }) => {
    const scaleAnim = pulseAnims[user.id]?.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1.2],
    }) || 1;

    const opacityAnim = pulseAnims[user.id]?.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }) || 0;

    const statusColor =
      user.status === 'active'
        ? '#10B981'
        : user.status === 'idle'
          ? '#F59E0B'
          : '#D1D5DB';

    return (
      <View
        key={user.id}
        style={{
          position: 'absolute',
          left: `${user.x}%`,
          top: `${user.y}%`,
          transform: [{ translateX: -20 }, { translateY: -20 }],
        }}
      >
        {/* Pulse Ring */}
        {user.status === 'active' && (
          <Animated.View
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#3B82F6',
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              left: -10,
              top: -10,
            }}
          />
        )}

        {/* User Avatar Card */}
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
            borderWidth: 3,
            borderColor: statusColor,
          }}
        >
          <Text style={{ fontSize: 28 }}>{user.avatar}</Text>
        </TouchableOpacity>

        {/* Status Badge */}
        <View
          style={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: statusColor,
            borderWidth: 2,
            borderColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {user.status === 'active' && (
            <MaterialCommunityIcons name="check" size={12} color="white" />
          )}
          {user.status === 'idle' && (
            <MaterialCommunityIcons name="clock" size={12} color="white" />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#1F2937' }}>
            Community Map
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
            See what your community is working on
          </Text>
        </View>

        {/* Stats Row */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginBottom: 16,
            gap: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#DBEAFE',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <MaterialCommunityIcons
                name="account-multiple"
                size={18}
                color="#3B82F6"
              />
            </View>
            <Text
              style={{ fontSize: 20, fontWeight: '700', color: '#1F2937' }}
            >
              {mockUsers.length}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
              Active Users
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#DBEAFE',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={18}
                color="#3B82F6"
              />
            </View>
            <Text
              style={{ fontSize: 20, fontWeight: '700', color: '#1F2937' }}
            >
              {mockUsers.reduce((sum, u) => sum + u.completedGoals, 0)}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
              Total Goals
            </Text>
          </View>
        </View>

        {/* Map Container */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 24,
            height: 400,
            backgroundColor: 'white',
            borderRadius: 24,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Map Background with Grid */}
          <View
            style={{
              flex: 1,
              backgroundColor: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
              overflow: 'hidden',
            }}
          >
            {/* Grid Pattern */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <View
                  key={`h-${i}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: '#E5E7EB',
                    top: `${(i + 1) * 25}%`,
                  }}
                />
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <View
                  key={`v-${i}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: '#E5E7EB',
                    left: `${(i + 1) * 25}%`,
                  }}
                />
              ))}
            </View>

            {/* User Pins */}
            {mockUsers.map((user) => (
              <UserPin key={user.id} user={user} />
            ))}
          </View>
        </View>

        {/* User List */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: 12,
            }}
          >
            Active Users
          </Text>

          {mockUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                  position: 'relative',
                }}
              >
                <Text style={{ fontSize: 24 }}>{user.avatar}</Text>
                <View
                  style={{
                    position: 'absolute',
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor:
                      user.status === 'active'
                        ? '#10B981'
                        : user.status === 'idle'
                          ? '#F59E0B'
                          : '#D1D5DB',
                    borderWidth: 2,
                    borderColor: 'white',
                    bottom: -2,
                    right: -2,
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}
                >
                  {user.name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#6B7280',
                    marginTop: 2,
                  }}
                >
                  {user.activity}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#F0F9FF',
                  borderRadius: 8,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="star" size={12} color="#3B82F6" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#3B82F6',
                      marginLeft: 4,
                    }}
                  >
                    {user.completedGoals}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 30,
            backgroundColor: '#F0F9FF',
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#BFDBFE',
          }}
        >
          <Text
            style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}
          >
            Status Guide
          </Text>

          <View style={{ marginTop: 12, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#10B981',
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                Active - Currently working
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#F59E0B',
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                Idle - Taking a break
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#D1D5DB',
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                Offline - Not available
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}