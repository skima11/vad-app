// app/(tabs)/daily-claim.tsx
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { claimDailyReward } from "../firebase/user";

export default function DailyClaim({ visible, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClaim = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    setMessage("");

    // ✅ SIMULATED INTERSTITIAL AD
    setTimeout(async () => {
      const reward = await claimDailyReward(auth.currentUser!.uid);

      if (reward === 0) {
        setMessage("Already claimed for today.");
      } else {
        setMessage(`+${reward.toFixed(1)} VAD claimed!`);
      }

      setLoading(false);
    }, 2500); // fake ad
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Daily Claim</Text>
          <Text style={styles.sub}>Claim every 24 hours to build your streak</Text>

          <View style={styles.streakBox}>
            <Text style={styles.streakTitle}>Streak Rewards</Text>
            <Text style={styles.streak}>Day 1 → +0.1</Text>
            <Text style={styles.streak}>Day 2 → +0.2</Text>
            <Text style={styles.streak}>Day 3 → +0.3</Text>
            <Text style={styles.streak}>Day 4 → +0.4</Text>
            <Text style={styles.streak}>Day 5 → +0.5</Text>
            <Text style={styles.streak}>Day 6 → +0.6</Text>
            <Text style={styles.streak}>Day 7 → +2.0</Text>
          </View>

          <Pressable
            onPress={handleClaim}
            disabled={loading}
            style={styles.claimBtn}
          >
            <Text style={styles.claimText}>
              {loading ? "Watching Ad..." : "Claim Now"}
            </Text>
          </Pressable>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#0f1320",
    width: "88%",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#34D399",
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  sub: { color: "#9FA8C7", marginTop: 6, fontSize: 13 },

  streakBox: {
    marginTop: 16,
    backgroundColor: "rgba(52,211,153,0.12)",
    padding: 14,
    borderRadius: 14,
  },
  streakTitle: {
    color: "#34D399",
    fontWeight: "800",
    marginBottom: 6,
  },
  streak: { color: "#9FA8C7", fontSize: 13 },

  claimBtn: {
    marginTop: 18,
    backgroundColor: "#34D399",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  claimText: { color: "#000", fontWeight: "900" },

  message: {
    marginTop: 14,
    color: "#34D399",
    textAlign: "center",
    fontWeight: "800",
  },

  closeBtn: { marginTop: 18, alignItems: "center" },
  closeText: { color: "#9FA8C7" },
});
