import React from 'react';
import {View,Text,StyleSheet,ScrollView,Switch,Alert,Platform} from 'react-native';
import {Colors,TOKEN_SYMBOL} from '../theme';
import {useApp} from '../context/AppContext';
export default function ProfileScreen(){
  const {profile,wallet,streak,settings,updateSettings}=useApp();
  const level=Math.floor((wallet.totalEarned||0)/100)+1;
  return(
    <View style={s.c}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Text style={s.av}>{profile?.avatar||'🏃'}</Text>
          <Text style={s.name}>{profile?.name||'FitWalker'}</Text>
          <Text style={s.lvl}>Level {level} ⭐</Text>
        </View>
        <View style={s.stats}>
          <View style={s.stat}><Text style={[s.sv,{color:Colors.neonOrange}]}>{streak?.current||0}🔥</Text><Text style={s.sl}>Streak</Text></View>
          <View style={s.stat}><Text style={[s.sv,{color:Colors.gold}]}>{(wallet.totalEarned||0).toFixed(0)}</Text><Text style={s.sl}>Earned</Text></View>
          <View style={s.stat}><Text style={[s.sv,{color:Colors.neonCyan}]}>Lv{level}</Text><Text style={s.sl}>Level</Text></View>
        </View>
        <View style={s.sec}>
          <View style={s.row}><Text style={s.rl}>📳 Haptics</Text><Switch value={settings?.haptics!==false} onValueChange={v=>updateSettings({haptics:v})} trackColor={{false:Colors.bgElevated,true:Colors.neonGreen}}/></View>
          <View style={s.row}><Text style={s.rl}>🎯 Goal: {(settings?.dailyGoal||10000)/1000}K steps</Text><Text style={s.rl2} onPress={()=>Alert.alert('Set Goal','',[{text:'5K',onPress:()=>updateSettings({dailyGoal:5000})},{text:'10K',onPress:()=>updateSettings({dailyGoal:10000})},{text:'15K',onPress:()=>updateSettings({dailyGoal:15000})},{text:'Cancel',style:'cancel'}])}>Change ›</Text></View>
          <View style={s.row}><Text style={[s.rl,{color:Colors.neonPink}]} onPress={()=>Alert.alert('Reset','Reset all data?',[{text:'Cancel'},{text:'Reset',style:'destructive'}])}>🗑️ Reset Data</Text></View>
        </View>
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}
const s=StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg,padding:16,paddingTop:Platform.OS==='android'?48:60},
  hero:{backgroundColor:Colors.bgCard,borderRadius:24,padding:24,alignItems:'center',marginBottom:16,borderWidth:1,borderColor:Colors.neonGreen+'20'},
  av:{fontSize:56,marginBottom:8},
  name:{fontSize:24,fontWeight:'900',color:'#fff'},
  lvl:{fontSize:14,color:Colors.neonGreen,marginTop:4},
  stats:{flexDirection:'row',backgroundColor:Colors.bgCard,borderRadius:16,marginBottom:12,borderWidth:1,borderColor:Colors.border},
  stat:{flex:1,alignItems:'center',padding:16},
  sv:{fontSize:16,fontWeight:'700'},sl:{fontSize:11,color:Colors.textMuted,marginTop:2},
  sec:{backgroundColor:Colors.bgCard,borderRadius:16,borderWidth:1,borderColor:Colors.border,overflow:'hidden'},
  row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:16,borderBottomWidth:1,borderBottomColor:Colors.border},
  rl:{fontSize:15,color:'#fff'},rl2:{fontSize:14,color:Colors.neonGreen,fontWeight:'600'},
});
