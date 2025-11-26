"use client"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function TeamScreen() {
  const windowHeight = Dimensions.get("window").height

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.hero, { minHeight: windowHeight * 0.6 }]}>
          <View style={styles.heroContent}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name="meditation" size={64} color="#3B82F6" />
            </View>
            <Text style={styles.heroTitle}>Shared Focus</Text>
            <Text style={styles.heroSubtitle}>Focus together, achieve more</Text>
            <Text style={styles.heroDescription}>
              Join collaborative focus sessions with your team. Real-time synced timers, live reactions, and
              accountability features.
            </Text>

            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Get Started</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Shared Focus?</Text>

          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="sync" size={32} color="#3B82F6" />
              </View>
              <Text style={styles.featureTitle}>Real-time Sync</Text>
              <Text style={styles.featureDescription}>
                Keep everyone on the same page with real-time timer synchronization
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="account-multiple" size={32} color="#8B5CF6" />
              </View>
              <Text style={styles.featureTitle}>Live Presence</Text>
              <Text style={styles.featureDescription}>
                See your team members orbiting in real-time with status indicators
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="fire" size={32} color="#EF4444" />
              </View>
              <Text style={styles.featureTitle}>Build Streaks</Text>
              <Text style={styles.featureDescription}>Maintain focus streaks and track your progress over time</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="chat-outline" size={32} color="#10B981" />
              </View>
              <Text style={styles.featureTitle}>Session Chat</Text>
              <Text style={styles.featureDescription}>Communicate with your team during focus sessions</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="party-popper" size={32} color="#F59E0B" />
              </View>
              <Text style={styles.featureTitle}>Reactions</Text>
              <Text style={styles.featureDescription}>Celebrate milestones with floating reactions and emojis</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="chart-line" size={32} color="#EC4899" />
              </View>
              <Text style={styles.featureTitle}>Analytics</Text>
              <Text style={styles.featureDescription}>Track focus time and see detailed post-session summaries</Text>
            </View>
          </View>
        </View>

        {/* Views Section */}
        <View style={styles.viewsSection}>
          <Text style={styles.sectionTitle}>Two Focus Modes</Text>

          <View style={styles.viewCard}>
            <View style={styles.viewHeader}>
              <MaterialCommunityIcons name="meditation" size={28} color="#3B82F6" />
              <Text style={styles.viewName}>Zen Mode</Text>
            </View>
            <Text style={styles.viewDescription}>
              Minimal, distraction-free interface focused on your timer and quick reactions. Perfect for deep focus.
            </Text>
          </View>

          <View style={styles.viewCard}>
            <View style={styles.viewHeader}>
              <MaterialCommunityIcons name="account-multiple" size={28} color="#8B5CF6" />
              <Text style={styles.viewName}>Team Mode</Text>
            </View>
            <Text style={styles.viewDescription}>
              Social focus experience with orbiting avatars, live chat, and collaborative energy. Perfect for
              accountability.
            </Text>
          </View>
        </View>

        {/* Tech Stack */}
        <View style={styles.techSection}>
          <Text style={styles.sectionTitle}>Built With</Text>
          <View style={styles.techStack}>
            <View style={styles.techBadge}>
              <Text style={styles.techName}>Supabase</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techName}>Ably</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techName}>React Native</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techName}>Clerk Auth</Text>
            </View>
          </View>
          <Text style={styles.techDescription}>
            Enterprise-grade real-time infrastructure with PostgreSQL database and ultra-low latency messaging.
          </Text>
        </View>

        {/* CTA Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Your First Session</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>Join thousands of focused teams worldwide</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  heroContent: {
    alignItems: "center",
    maxWidth: 400,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 20,
    color: "#6B7280",
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: "center",
    gap: 8,
  },
  ctaButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 24,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  viewsSection: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  viewCard: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  viewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  viewName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  viewDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  techSection: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  techStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  techBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  techName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
  },
  techDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
    gap: 12,
  },
  startButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
})
