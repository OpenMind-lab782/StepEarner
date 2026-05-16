import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Platform} from 'react-native';
import {Colors,TOKEN_SYMBOL} from '../theme';
import {useApp} from '../context/AppContext';
export default function HomeScreen({navigation}){
  const {todaySteps,wallet,streak,settings}=useApp();
  const goal=settings?.dailyGoal||10000;
  const pct=Math.min(Math.round((todaySteps/goal)*100),100);
  return(
    <View style={s.c}>
      <View style={s.header}>
        <Text style={s.title}>StepEarner 🏃</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('Wallet')}>
          <Text style={s.bal}>💎 {wallet.balance.toFixed(0)} {TOKEN_SYMBOL}</Text>
        </TouchableOpacity>
      </View>
      <View style={s.ring}>
        <Text style={s.steps}>{todaySteps.toLocaleString()}</Text>
        <Text style={s.lbl}>STEPS TODAY</Text>
        <Text style={s.sub}>{pct}% of {goal.toLocaleString()} goal</Text>
        <View style={s.pb}><View style={[s.pf,{width:`${pct}%`}]}/></View>
      </View>
      <View style={s.row}>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Marketplace')}><Text style={s.bi}>🛍️</Text><Text style={s.bl}>Rewards</Text></TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Leaderboard')}><Text style={s.bi}>🏆</Text><Text style={s.bl}>Ranks</Text></TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Profile')}><Text style={s.bi}>👤</Text><Text style={s.bl}>Profile</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const s=StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg,padding:16,paddingTop:Platform.OS==='android'?48:60},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:24},
  title:{fontSize:22,fontWeight:'900',color:Colors.textPrimary},
  bal:{fontSize:14,fontWeight:'700',color:Colors.gold,backgroundColor:Colors.bgCard,padding:10,borderRadius:999},
  ring:{backgroundColor:Colors.bgCard,borderRadius:24,padding:24,alignItems:'center',marginBottom:16,borderWidth:1,borderColor:Colors.neonGreen+'30'},
  steps:{fontSize:64,fontWeight:'900',color:'#fff'},
  lbl:{fontSize:11,color:Colors.textSecondary,letterSpacing:3},
  sub:{fontSize:13,color:Colors.textMuted,marginBottom:12},
  pb:{width:'100%',height:8,backgroundColor:Colors.bgElevated,borderRadius:999},
  pf:{height:8,backgroundColor:Colors.neonGreen,borderRadius:999},
  row:{flexDirection:'row',gap:8},
  btn:{flex:1,backgroundColor:Colors.bgCard,borderRadius:16,padding:16,alignItems:'center',borderWidth:1,borderColor:Colors.border},
  bi:{fontSize:22},bl:{fontSize:11,color:Colors.textSecondary},
});
row:{flexDirection:'row',gap:8},
  btn:{flex:1,backgroundColor:Colors.bgCard,borderRadius:16,padding:16,alignItems:'center',borderWidth:1,borderColor:Colors.border},
  bi:{fontSize:22},bl:{fontSize:11,color:Colors.textSecondary},
});
