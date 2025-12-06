// app/(tabs)/watch-earn.tsx
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { claimWatchEarnReward } from "../firebase/user";

export default function WatchEarn({ visible, onClose }: any) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleWatch = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    setMessage("");
    setCompleted(false);

    // ✅ SIMULATED REWARDED AD
    setTimeout(async () => {
      const reward = await claimWatchEarnReward(auth.currentUser!.uid);

      setMessage(`+${reward.toFixed(2)} VAD earned!`);
      setCompleted(true);
      setLoading(false);
    }, 3000); // fake rewarded ad
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Watch & Earn</Text>
          <Text style={styles.sub}>Optional rewarded ad</Text>

          <View style={styles.rewardBox}>
            <Text style={styles.reward}>+0.25 VAD</Text>
            <Text style={styles.limit}>Per full watch</Text>
          </View>

          {!completed && (
            <Pressable
              onPress={handleWatch}
              disabled={loading}
              style={styles.watchBtn}
            >
              <Text style={styles.watchText}>
                {loading ? "Watching..." : "Watch Ad"}
              </Text>
            </Pressable>
          )}

          {completed && (
            <Pressable onPress={onClose} style={styles.doneBtn}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          )}

          {message ? <Text style={styles.message}>{message}</Text> : null}

          {!loading && !completed && (
            <Pressable onPress={onClose} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#0f1320",
    width: "90%",
    borderRadius: 22,
    padding: 26,
    borderWidth: 1,
    borderColor: "#FACC15",
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "900" },
  sub: { color: "#9FA8C7", marginTop: 6, fontSize: 13 },

  rewardBox: {
    marginTop: 18,
    backgroundColor: "rgba(250,204,21,0.12)",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  reward: { color: "#FACC15", fontSize: 26, fontWeight: "900" },
  limit: { color: "#9FA8C7", fontSize: 12 },

  watchBtn: {
    marginTop: 20,
    backgroundColor: "#FACC15",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  watchText: { color: "#000", fontWeight: "900" },

  doneBtn: {
    marginTop: 20,
    backgroundColor: "#34D399",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  doneText: { color: "#000", fontWeight: "900" },

  message: {
    marginTop: 16,
    color: "#FACC15",
    textAlign: "center",
    fontWeight: "800",
  },

  skipBtn: { marginTop: 18, alignItems: "center" },
  skipText: { color: "#9FA8C7" },
});
