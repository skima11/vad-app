// app/(tabs)/boost.tsx
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { claimBoostReward } from "../firebase/user";

export default function Boost({ visible, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleWatchAd = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    setMessage("");

    // ✅ SIMULATED AD (replace with real ad later)
    setTimeout(async () => {
      const reward = await claimBoostReward(auth.currentUser!.uid);

      if (reward === 0) {
        setMessage("Daily boost limit reached (3/3).");
      } else {
        setMessage(`+${reward.toFixed(1)} VAD added!`);
      }

      setLoading(false);
    }, 2500); // simulates full ad watch
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Boost Earnings</Text>
          <Text style={styles.sub}>Watch ads to earn +0.5 VAD</Text>

          <View style={styles.rewardBox}>
            <Text style={styles.reward}>+0.5 VAD</Text>
            <Text style={styles.limit}>Max 3/day</Text>
          </View>

          <Pressable
            onPress={handleWatchAd}
            disabled={loading}
            style={styles.watchBtn}
          >
            <Text style={styles.watchText}>
              {loading ? "Watching Ad..." : "Watch Ad"}
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
    borderColor: "#8B5CF6",
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  sub: { color: "#9FA8C7", marginTop: 6, fontSize: 13 },

  rewardBox: {
    marginTop: 18,
    backgroundColor: "rgba(139,92,246,0.15)",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  reward: { color: "#8B5CF6", fontSize: 28, fontWeight: "900" },
  limit: { color: "#9FA8C7", fontSize: 12 },

  watchBtn: {
    marginTop: 18,
    backgroundColor: "#8B5CF6",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  watchText: { color: "#fff", fontWeight: "800" },

  message: {
    marginTop: 14,
    color: "#34D399",
    textAlign: "center",
    fontWeight: "700",
  },

  closeBtn: { marginTop: 20, alignItems: "center" },
  closeText: { color: "#9FA8C7" },
});
