import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView} from 'react-native';
import Colors from '../constants/Colors';
import {useApp} from '../context/AppContext';

const getMotivation=(steps)=>{
  if(steps===0)return 'Walk and earn FIT';
  if(steps<2000)return 'Great start, keep going';
  if(steps<5000)return 'Warming up, on your way to 5K';
  if(steps<8000)return 'Halfway hero, push to 10000';
  if(steps<10000)return 'Almost there, crush your goal';
  if(steps<15000)return 'Goal crushed, keep earning FIT';
  return 'Legend mode, top StepEarner today';
};

export default function HomeScreen({navigation}){
  const {todaySteps,wallet,weeklySteps,streak,isPedometerAvailable}=useApp();
  const steps=todaySteps||0;
  const goal=10000;
  const pct=Math.round(Math.min(steps/goal,1)*100);
  const strideM=0.762;
  const meters=parseFloat((steps*strideM).toFixed(1));
  const km=parseFloat((meters/1000).toFixed(2));
  const miles=parseFloat((meters/1609.34).toFixed(2));
  const feet=parseFloat((meters*3.28084).toFixed(1));
  const calories=Math.round(steps*0.04);
  const fitToday=Math.floor(steps/100);
  const status=isPedometerAvailable?'active':'unavailable';
  const maxW=Math.max(...(weeklySteps.map(d=>d.steps)||[0]),1);
  return(
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.title}>StepEarner</Text>
        <View style={s.fitBadge}><Text style={s.fitText}>{wallet.balance.toFixed(0)} FIT</Text></View>
      </View>
      <View style={s.card}>
        <View style={s.ring}>
          <Text style={s.steps}>{steps.toLocaleString()}</Text>
          <Text style={s.lbl}>STEPS TODAY</Text>
          <Text style={s.sub}>{pct}% of 10,000 goal</Text>
          <View style={s.pb}><View style={[s.pf,{width:pct+'%'}]}/></View>
          <Text style={s.stat}>sensor: {status}</Text>
        </View>
        {fitToday>0&&<Text style={s.fitEarned}>+{fitToday} FIT earned today</Text>}
      </View>
      <View style={s.row}>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Marketplace')}><Text style={s.bi}>Rewards</Text></TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Leaderboard')}><Text style={s.bi}>Ranks</Text></TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Profile')}><Text style={s.bi}>Profile</Text></TouchableOpacity>
      </View>
      <View style={s.motivCard}><Text style={s.motivText}>{getMotivation(steps)}</Text></View>
      <Text style={s.sectionTitle}>TODAYS STATS</Text>
      <View style={s.statsGrid}>
        <View style={s.statCard}><Text style={s.statVal}>{feet.toLocaleString()}</Text><Text style={s.statLbl}>FEET</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{meters.toLocaleString()}</Text><Text style={s.statLbl}>METERS</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{km}</Text><Text style={s.statLbl}>KM</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{miles}</Text><Text style={s.statLbl}>MILES</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{calories.toLocaleString()}</Text><Text style={s.statLbl}>CALORIES</Text></View>
        <View style={s.statCard}><Text style={[s.statVal,{color:Colors.neonGreen}]}>{fitToday}</Text><Text style={s.statLbl}>FIT TODAY</Text></View>
      </View>
      <Text style={s.sectionTitle}>WEEKLY STEPS</Text>
      <View style={s.chartCard}>
        <View style={s.chartBars}>
          {weeklySteps.map((d,i)=>{
            const h=Math.max((d.steps/maxW)*100,4);
            const isToday=i===6;
            return(
              <View key={i} style={s.barCol}>
                <Text style={s.barVal}>{d.steps>=1000?(d.steps/1000).toFixed(1)+'k':d.steps>0?d.steps:''}</Text>
                <View style={s.barTrack}><View style={[s.barFill,{height:h+'%',backgroundColor:isToday?Colors.neonGreen:Colors.bgElevated}]}/></View>
                <Text style={[s.barDay,isToday&&{color:Colors.neonGreen,fontWeight:'700'}]}>{d.label}</Text>
              </View>
            );
          })}
        </View>
        <Text style={s.chartNote}>Weekly total: {weeklySteps.reduce((a,d)=>a+d.steps,0).toLocaleString()} steps</Text>
      </View>
      <Text style={s.sectionTitle}>WALLET SUMMARY</Text>
      <View style={s.walletCard}>
        <View style={s.walletRow}>
          <View style={s.walletStat}><Text style={[s.walletVal,{color:Colors.neonGreen}]}>{wallet.balance.toFixed(0)}</Text><Text style={s.walletLbl}>BALANCE</Text></View>
          <View style={s.walletStat}><Text style={s.walletVal}>{wallet.totalEarned.toFixed(0)}</Text><Text style={s.walletLbl}>TOTAL EARNED</Text></View>
          <View style={s.walletStat}><Text style={[s.walletVal,{color:'#f87171'}]}>{wallet.totalSpent.toFixed(0)}</Text><Text style={s.walletLbl}>SPENT</Text></View>
        </View>
        <TouchableOpacity style={s.walletBtn} onPress={()=>navigation.navigate('Wallet')}><Text style={s.walletBtnTxt}>Open Wallet</Text></TouchableOpacity>
      </View>
      <Text style={s.sectionTitle}>HOW TO EARN MORE FIT</Text>
      <View style={s.earnCard}>
        {[{icon:'👣',title:'Walk 1,000 steps',desc:'Earn 10 FIT tokens'},{icon:'🎯',title:'Hit 10,000 steps',desc:'Earn 100 FIT daily'},{icon:'🔥',title:'7-day streak',desc:'Streak multiplier bonus'},{icon:'🏅',title:'Top Leaderboard',desc:'Weekly rank rewards'},{icon:'📲',title:'Refer a friend',desc:'Earn 50 FIT per referral'}].map((item,i)=>(
          <View key={i} style={[s.earnRow,i<4&&s.earnBorder]}>
            <Text style={s.earnIcon}>{item.icon}</Text>
            <View style={s.earnInfo}><Text style={s.earnTitle}>{item.title}</Text><Text style={s.earnDesc}>{item.desc}</Text></View>
          </View>
        ))}
      </View>
      <View style={{height:100}}/>
    </ScrollView>
  );
}
const s=StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.bg},
  content:{padding:20,paddingTop:60},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:24},
  title:{fontSize:24,fontWeight:'800',color:'#fff'},
  fitBadge:{backgroundColor:Colors.bgCard,borderRadius:20,paddingHorizontal:14,paddingVertical:6,borderWidth:1,borderColor:Colors.neonGreen+'50'},
  fitText:{fontSize:14,fontWeight:'700',color:Colors.neonGreen},
  card:{backgroundColor:Colors.bgCard,borderRadius:24,padding:24,marginBottom:16},
  ring:{alignItems:'center',marginBottom:12},
  steps:{fontSize:64,fontWeight:'900',color:'#fff'},
  lbl:{fontSize:11,color:Colors.textSecondary,letterSpacing:3},
  sub:{fontSize:13,color:Colors.textMuted,marginBottom:8},
  pb:{width:'100%',height:8,backgroundColor:Colors.bgElevated,borderRadius:999},
  pf:{height:8,backgroundColor:Colors.neonGreen,borderRadius:999},
  stat:{fontSize:11,color:Colors.neonGreen,marginTop:4},
  fitEarned:{fontSize:13,color:Colors.neonGreen,textAlign:'center',fontWeight:'600',marginTop:8},
  row:{flexDirection:'row',gap:8,marginBottom:16},
  btn:{flex:1,backgroundColor:Colors.bgCard,borderRadius:16,padding:14,alignItems:'center',borderWidth:1,borderColor:Colors.bgElevated},
  bi:{fontSize:13,color:Colors.textSecondary},
  motivCard:{backgroundColor:Colors.bgCard,borderRadius:16,padding:16,marginBottom:20,borderLeftWidth:3,borderLeftColor:Colors.neonGreen},
  motivText:{fontSize:14,color:'#fff',lineHeight:22},
  sectionTitle:{fontSize:11,fontWeight:'700',color:Colors.textSecondary,letterSpacing:2,marginBottom:10,marginTop:4},
  statsGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:20},
  statCard:{width:'30%',backgroundColor:Colors.bgCard,borderRadius:16,padding:14,alignItems:'center',borderWidth:1,borderColor:Colors.bgElevated,flexGrow:1},
  statVal:{fontSize:18,fontWeight:'800',color:'#fff'},
  statLbl:{fontSize:9,color:Colors.textMuted,letterSpacing:1,marginTop:4},
  chartCard:{backgroundColor:Colors.bgCard,borderRadius:20,padding:16,marginBottom:20},
  chartBars:{flexDirection:'row',height:120,alignItems:'flex-end',gap:6},
  barCol:{flex:1,alignItems:'center',height:'100%',justifyContent:'flex-end'},
  barVal:{fontSize:8,color:Colors.textMuted,marginBottom:2},
  barTrack:{flex:1,width:'100%',justifyContent:'flex-end'},
  barFill:{width:'100%',borderRadius:4,minHeight:4},
  barDay:{fontSize:10,color:Colors.textMuted,marginTop:4},
  chartNote:{fontSize:11,color:Colors.textMuted,textAlign:'center',marginTop:12},
  walletCard:{backgroundColor:Colors.bgCard,borderRadius:20,padding:16,marginBottom:20,borderWidth:1,borderColor:Colors.neonGreen+'30'},
  walletRow:{flexDirection:'row',marginBottom:16},
  walletStat:{flex:1,alignItems:'center'},
  walletVal:{fontSize:22,fontWeight:'800',color:'#fff'},
  walletLbl:{fontSize:9,color:Colors.textMuted,letterSpacing:1,marginTop:4},
  walletBtn:{backgroundColor:Colors.neonGreen,borderRadius:12,padding:12,alignItems:'center'},
  walletBtnTxt:{color:Colors.bg,fontWeight:'700',fontSize:14},
  earnCard:{backgroundColor:Colors.bgCard,borderRadius:20,marginBottom:8,overflow:'hidden'},
  earnRow:{flexDirection:'row',alignItems:'center',padding:16,gap:14},
  earnBorder:{borderBottomWidth:1,borderBottomColor:Colors.bgElevated},
  earnIcon:{fontSize:22},
  earnInfo:{flex:1},
  earnTitle:{fontSize:14,color:'#fff',fontWeight:'600'},
  earnDesc:{fontSize:12,color:Colors.textMuted,marginTop:2},
});
