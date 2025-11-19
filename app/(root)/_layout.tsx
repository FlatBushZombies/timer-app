import { Tabs } from "expo-router";
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import Svg, { Path } from "react-native-svg";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { icons } from "@/constants";

const { width } = Dimensions.get("window");
const TAB_COUNT = 4;
const TAB_WIDTH = width / TAB_COUNT;

/* -------------------------- CURVED BAR SHAPE -------------------------- */
const CurvedBar = ({ activeIndex }: { activeIndex: Animated.SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(activeIndex.value * TAB_WIDTH, { duration: 300 }),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          width: TAB_WIDTH,
          height: 75,
          overflow: "visible",
        },
        animatedStyle,
      ]}
    >
      <Svg width={TAB_WIDTH} height={75}>
        <Path
          d={`
            M0 0 
            Q${TAB_WIDTH / 2} 60 ${TAB_WIDTH} 0 
            L${TAB_WIDTH} 75 
            L0 75 
            Z
          `}
          fill="rgba(255,255,255,0.28)"
        />
      </Svg>
    </Animated.View>
  );
};

/* -------------------------- ICON COMPONENT ---------------------------- */
const TabIcon = ({
  source,
  focused,
}: {
  source: any;
  focused: boolean;
}) => {
  const scale = useSharedValue(focused ? 1.2 : 1);

  const animatedStyle = useAnimatedStyle(() => {
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 200 });

    return {
      transform: [{ scale: scale.value }],
      opacity: withTiming(focused ? 1 : 0.6, { duration: 200 }),
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Image
        source={source}
        style={{ width: 26, height: 26, tintColor: focused ? "#FF6B6B" : "#9CA3AF" }}
      />
    </Animated.View>
  );
};

/* -------------------------- CUSTOM TAB BAR ---------------------------- */
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const activeIndex = useSharedValue(state.index);

  activeIndex.value = state.index;

  return (
    <View style={styles.container}>
      {/* Frosted blur background */}
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />

      {/* Animated curved highlight */}
      <CurvedBar activeIndex={activeIndex} />

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;

          const source =
            options.tabBarIcon &&
            options.tabBarIcon({ focused, color: "", size: 24 });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}
            >
              {source}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function Layout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          ),
        }}
      />

      <Tabs.Screen
        name="task"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.pencil} />
          ),
        }}
      />

      <Tabs.Screen
        name="challenge"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.bag} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.profile} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 40,
    overflow: "visible",
  },
  row: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
