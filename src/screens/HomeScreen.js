import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Platform} from "react-native";
import {Pedometer} from "expo-sensors";
import Colors from "../constants/Colors";
const GOAL = 10000;
export default function HomeScreen({navigation}) {
  const [steps, setSteps] = useState(0);
  const [fitBal] = useState(0);
  const [status, setStatus] = useState("checking...");
  useEffect(() => {
    let sub;
    const init = async () => {
      const perm = await Pedometer.requestPermissionsAsync();
      if (perm.status !== "granted") {
        setStatus("permission denied");
        return;
      }
      const avail = await Pedometer.isAvailableAsync();
      if (!avail) {
        setStatus("not available");
        return;
      }
      setStatus("active");
      sub = Pedometer.watchStepCount(result => {
        setSteps(result.steps);
      });
    };
    init();
    return () => { if (sub) sub.remove(); };
  }, []);
  const pct = Math.min((steps / GOAL) * 100, 100);
  return (
    <View style={s.c}>
      <View style={s.header}>
        <Text style={s.title}>StepEarner</Text>
        <Text style={s.bal}>{fitBal} FIT</Text>
      </View>
      <View style={s.ring}>
        <Text style={s.steps}>{steps}</Text>
        <Text style={s.lbl}>STEPS TODAY</Text>
        <Text style={s.sub}>{Math.round(pct)}% of 10,000 goal</Text>
        <View style={s.pb}>
          <View style={[s.pf, {width: pct + "%"}]} />
        </View>
        <Text style={s.stat}>sensor: {status}</Text>
      </View>
      <View style={s.row}>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("Rewards")}>
          <Text style={s.bi}>Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("Leaderboard")}>
          <Text style={s.bi}>Ranks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("Profile")}>
          <Text style={s.bi}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg,padding:16,paddingTop:Platform.OS==="android"?48:60},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:24},
  title:{fontSize:22,fontWeight:"900",color:Colors.textPrimary},
  bal:{fontSize:14,fontWeight:"700",color:Colors.gold,backgroundColor:Colors.bgCard,padding:10,borderRadius:999},
  ring:{backgroundColor:Colors.bgCard,borderRadius:24,padding:24,alignItems:"center",marginBottom:16,borderWidth:1,borderColor:Colors.neonGreen+"30"},
  steps:{fontSize:64,fontWeight:"900",color:"#fff"},
  lbl:{fontSize:11,color:Colors.textSecondary,letterSpacing:3},
  sub:{fontSize:13,color:Colors.textMuted,marginBottom:8},
  stat:{fontSize:11,color:Colors.neonGreen,marginTop:4},
  pb:width:"100%",height:8,backgroundColor:Colors.bgElevated,borderRadius:999},
  pf:{height:8,backgroundColor:Colors.neonGreen,borderRadius:999},
  row:{flexDirection:"row",gap:8},
  btn:{flex:1,backgroundColor:Colors.bgCard,borderRadius:16,padding:16,alignItems:"center",borderWidth:1,borderColor:Colors.border},
  bi:{fontSize:14,color:Colors.textSecondary},
});
