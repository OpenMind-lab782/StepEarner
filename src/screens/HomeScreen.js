import React,{useEffect,useState,useCallback} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView} from 'react-native';
import {Pedometer} from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

const STEPS_PER_FIT=1000;

const getMotivation=(steps)=>{
  if(steps===0)return 'Walk and earn FIT!';
  if(steps<2000)return 'Great start! Keep going!';
  if(steps<5000)return 'Warming up! On your way to 5K.';
  if(steps<8000)return 'Halfway hero! Push to 10,000!';
  if(steps<10000)return 'Almost there! Crush your goal!';
  if(steps<15000)return 'Goal crushed! Keep earning FIT!';
  return 'Legend mode! Top StepEarner today!';
};
export default function HomeScreen({navigation}){
  const [steps,setSteps]=useState(0);
  const [status,setStatus]=useState('loading');
  const [fitBalance,setFitBalance]=useState(0);
  const [fitToday,setFitToday]=useState(0);
  const [strideMode,setStrideMode]=useState('auto');
  const [weeklySteps,setWeeklySteps]=useState([0,0,0,0,0,0,0]);
  const [recentActivity,setRecentActivity]=useState([]);

  const strideM=0.762;
  const meters=parseFloat((steps*strideM).toFixed(1));
  const km=parseFloat((meters/1000).toFixed(2));
  const miles=parseFloat((meters/1609.34).toFixed(2));
  const feet=parseFloat((meters*3.28084).toFixed(1));
  const calories=Math.round(steps*0.04);
  const fitEarnedCalc=Math.floor(steps/STEPS_PER_FIT);
  const loadWeekly=useCallback(async()=>{
    try{
      const now=new Date();const results=[];
      for(let i=6;i>=0;i--){
        const d=new Date(now);d.setDate(d.getDate()-i);
        const start=new Date(d);start.setHours(0,0,0,0);
        const end=new Date(d);end.setHours(23,59,59,999);
        try{const r=await Pedometer.getStepCountAsync(start,end);results.push(r?r.steps||0:0);}catch{results.push(0);}
      }
      setWeeklySteps(results);
    }catch(e){}
  },[]);

  const logActivity=useCallback(async(todaySteps,fit)=>{
    try{
      const today=new Date().toDateString();
      const stored=await AsyncStorage.getItem('activity_log');
      let log=stored?JSON.parse(stored):[];
      const idx=log.findIndex(l=>l.date===today);
      const entry={date:today,steps:todaySteps,fit,km:parseFloat((todaySteps*0.762/1000).toFixed(2)),cal:Math.round(todaySteps*0.04)};
      if(idx>=0)log[idx]=entry;else log.unshift(entry);
      log=log.slice(0,7);
      await AsyncStorage.setItem('activity_log',JSON.stringify(log));
      setRecentActivity(log);
    }catch(e){}
  },[]);
  useEffect(()=>{
    let sub;let watchBase=0;let watchDelta=0;
    const getStepsToday=async()=>{
      const now=new Date();const start=new Date(now);start.setHours(0,0,0,0);
      try{const r=await Pedometer.getStepCountAsync(start,now);
        if(r!=null){setSteps(s=>Math.max(s,r.steps||0));await updateFit(r.steps||0);}
      }catch(e){console.log('step err',e);}
    };
    const updateFit=async(todaySteps)=>{
      try{
        const today=new Date().toDateString();
        const stored=await AsyncStorage.getItem('fit_data');
        let d=stored?JSON.parse(stored):{balance:0,lastDate:'',lastSteps:0};
        if(d.lastDate!==today){d.lastDate=today;d.lastSteps=0;}
        const newFit=Math.floor(todaySteps/STEPS_PER_FIT);
        const prevFit=Math.floor((d.lastSteps||0)/STEPS_PER_FIT);
        if(newFit>prevFit){d.balance+=(newFit-prevFit);}
        if((todaySteps||0)>=(d.lastSteps||0)){d.lastSteps=todaySteps||0;}
        await AsyncStorage.setItem('fit_data',JSON.stringify(d));
        setFitBalance(d.balance);setFitToday(newFit);
        await logActivity(todaySteps,newFit);
      }catch(e){console.log('fit err',e);}
    };
    const init=async()=>{
      const perm=await Pedometer.requestPermissionsAsync();
      if(perm.status!=='granted'){setStatus('permission denied');return;}
      const avail=await Pedometer.isAvailableAsync();
      if(avail===false){setStatus('not available');return;}
      setStatus('active');
      try{
        const st=await AsyncStorage.getItem('fit_data');
        if(st){const d=JSON.parse(st);setFitBalance(d.balance||0);const tod=new Date().toDateString();if(d.lastDate===tod){watchBase=d.lastSteps||0;setSteps(d.lastSteps||0);}}
        const al=await AsyncStorage.getItem('activity_log');
        if(al)setRecentActivity(JSON.parse(al));
      }catch(e){}
      await getStepsToday();await loadWeekly();
      sub=Pedometer.watchStepCount((res)=>{watchDelta+=(res&&res.steps>0?res.steps:1);const wt=watchBase+watchDelta;setSteps(s=>Math.max(s,wt));updateFit(wt);getStepsToday();});
    };
    init();
    return()=>{if(sub)sub.remove();};
  },[loadWeekly,logActivity]);
  const goal=10000;
  const pct=Math.round(Math.min(steps/goal,1)*100);
  const maxW=Math.max(...weeklySteps,1);
  const dayLabels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const orderedDays=[];
  for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);orderedDays.push(dayLabels[d.getDay()]);}

  return(
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.title}>StepEarner</Text>
        <View style={s.fitBadge}><Text style={s.fitText}>{fitBalance} FIT</Text></View>
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
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Rewards')}><Text style={s.bi}>Rewards</Text></TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Leaderboard')}><Text style={s.bi}>Ranks</Text></TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.navigate('Profile')}><Text style={s.bi}>Profile</Text></TouchableOpacity>
      </View>
      <View style={s.motivCard}><Text style={s.motivText}>{getMotivation(steps)}</Text></View>
      <Text style={s.sectionTitle}>TODAYS STATS</Text>
      <View style={s.strideRow}>
        {['auto','fixed','custom'].map(m=>(
          <TouchableOpacity key={m} style={[s.strideBtn,strideMode===m&&s.strideBtnActive]} onPress={()=>setStrideMode(m)}>
            <Text style={[s.strideTxt,strideMode===m&&s.strideTxtActive]}>{m==='auto'?'Auto':m==='fixed'?'Standard':'Custom'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.statsGrid}>
        <View style={s.statCard}><Text style={s.statVal}>{feet.toLocaleString()}</Text><Text style={s.statLbl}>FEET</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{meters.toLocaleString()}</Text><Text style={s.statLbl}>METERS</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{km}</Text><Text style={s.statLbl}>KM</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{miles}</Text><Text style={s.statLbl}>MILES</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{calories.toLocaleString()}</Text><Text style={s.statLbl}>CALORIES</Text></View>
        <View style={s.statCard}><Text style={[s.statVal,{color:Colors.neonGreen}]}>{fitEarnedCalc}</Text><Text style={s.statLbl}>FIT TODAY</Text></View>
      </View>
      <Text style={s.sectionTitle}>WEEKLY STEPS</Text>
      <View style={s.chartCard}>
        <View style={s.chartBars}>
          {weeklySteps.map((v,i)=>{
            const h=Math.max((v/maxW)*100,4);
            const isToday=i===6;
            return(
              <View key={i} style={s.barCol}>
                <Text style={s.barVal}>{v>=1000?(v/1000).toFixed(1)+'k':v>0?v:''}</Text>
                <View style={s.barTrack}><View style={[s.barFill,{height:h+'%',backgroundColor:isToday?Colors.neonGreen:Colors.bgElevated}]}/></View>
                <Text style={[s.barDay,isToday&&{color:Colors.neonGreen,fontWeight:'700'}]}>{orderedDays[i]}</Text>
              </View>
            );
          })}
        </View>
        <Text style={s.chartNote}>Weekly total: {weeklySteps.reduce((a,b)=>a+b,0).toLocaleString()} steps</Text>
      </View>
      <Text style={s.sectionTitle}>RECENT ACTIVITY</Text>
      <View style={s.actCard}>
        {recentActivity.length===0?<Text style={s.emptyTxt}>No activity yet — start walking</Text>:recentActivity.slice(0,5).map((a,i)=>(
          <View key={i} style={[s.actRow,i<Math.min(recentActivity.length,5)-1&&s.actBorder]}>
            <View><Text style={s.actDate}>{a.date}</Text><Text style={s.actSub}>{a.km} km · {a.cal} kcal</Text></View>
            <View style={s.actRight}><Text style={s.actSteps}>{(a.steps||0).toLocaleString()}</Text><Text style={s.actFit}>+{a.fit} FIT</Text></View>
          </View>
        ))}
      </View>
      <Text style={s.sectionTitle}>HOW TO EARN MORE FIT</Text>
      <View style={s.earnCard}>
        {[{icon:'👣',title:'Walk 1,000 steps',desc:'Earn 1 FIT token'},{icon:'🎯',title:'Hit 10,000 steps',desc:'Earn 10 FIT daily'},{icon:'🔥',title:'7-day streak',desc:'Streak multiplier bonus'},{icon:'🏅',title:'Top Leaderboard',desc:'Weekly rank rewards'},{icon:'📲',title:'Refer a friend',desc:'Earn 50 FIT per referral'}].map((item,i)=>(
          <View key={i} style={[s.earnRow,i<4&&s.earnBorder]}>
            <Text style={s.earnIcon}>{item.icon}</Text>
            <View style={s.earnInfo}><Text style={s.earnTitle}>{item.title}</Text><Text style={s.earnDesc}>{item.desc}</Text></View>
          </View>
        ))}
      </View>
      <View style={{height:32}}/>
    </ScrollView>
  );
}

const s=StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.bgDark},
  content:{padding:20},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:24},
  title:{fontSize:24,fontWeight:'800',color:Colors.textPrimary},
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
  btn:{flex:1,backgroundColor:Colors.bgCard,borderRadius:16,padding:14,alignItems:'center',borderWidth:1,borderColor:Colors.border},
  bi:{fontSize:13,color:Colors.textSecondary},
  motivCard:{backgroundColor:Colors.bgCard,borderRadius:16,padding:16,marginBottom:20,borderLeftWidth:3,borderLeftColor:Colors.neonGreen},
  motivText:{fontSize:14,color:Colors.textPrimary,lineHeight:22},
  sectionTitle:{fontSize:11,fontWeight:'700',color:Colors.textSecondary,letterSpacing:2,marginBottom:10,marginTop:4},
  strideRow:{flexDirection:'row',gap:8,marginBottom:12},
  strideBtn:{flex:1,padding:8,borderRadius:10,backgroundColor:Colors.bgCard,borderWidth:1,borderColor:Colors.border,alignItems:'center'},
  strideBtnActive:{borderColor:Colors.neonGreen,backgroundColor:Colors.neonGreen+'20'},
  strideTxt:{fontSize:12,color:Colors.textMuted},
  strideTxtActive:{color:Colors.neonGreen,fontWeight:'700'},
  statsGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:20},
  statCard:{width:'30%',backgroundColor:Colors.bgCard,borderRadius:16,padding:14,alignItems:'center',borderWidth:1,borderColor:Colors.border,flexGrow:1},
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
  actCard:{backgroundColor:Colors.bgCard,borderRadius:20,marginBottom:20,overflow:'hidden'},
  actRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:16},
  actBorder:{borderBottomWidth:1,borderBottomColor:Colors.border},
  actDate:{fontSize:13,color:'#fff',fontWeight:'600'},
  actSub:{fontSize:11,color:Colors.textMuted,marginTop:2},
  actRight:{alignItems:'flex-end'},
  actSteps:{fontSize:15,color:'#fff',fontWeight:'700'},
  actFit:{fontSize:12,color:Colors.neonGreen,fontWeight:'600'},
  emptyTxt:{color:Colors.textMuted,fontSize:13,padding:16,textAlign:'center'},
  earnCard:{backgroundColor:Colors.bgCard,borderRadius:20,marginBottom:8,overflow:'hidden'},
  earnRow:{flexDirection:'row',alignItems:'center',padding:16,gap:14},
  earnBorder:{borderBottomWidth:1,borderBottomColor:Colors.border},
  earnIcon:{fontSize:22},
  earnInfo:{flex:1},
  earnTitle:{fontSize:14,color:'#fff',fontWeight:'600'},
  earnDesc:{fontSize:12,color:Colors.textMuted,marginTop:2},
});
