import React,{useEffect,useState} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {Pedometer} from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

const STEPS_PER_FIT=1000;

export default function HomeScreen({navigation}){
  const [steps,setSteps]=useState(0);
  const [status,setStatus]=useState('loading');
  const [fitBalance,setFitBalance]=useState(0);
  const [fitToday,setFitToday]=useState(0);

  useEffect(()=>{
    let sub;
    const getStepsToday=async()=>{
      const now=new Date();
      const start=new Date(now);
      start.setHours(0,0,0,0);
      try{
        const r=await Pedometer.getStepCountAsync(start,now);
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
        setFitBalance(d.balance);
        setFitToday(newFit);
      }catch(e){console.log('fit err',e);}
    };
    const init=async()=>{
      const perm=await Pedometer.requestPermissionsAsync();
      if(perm.status!=='granted'){setStatus('permission denied');return;}
      const avail=await Pedometer.isAvailableAsync();
      if(!avail){setStatus('not available');return;}
      setStatus('active');
      try{
        const st=await AsyncStorage.getItem('fit_data');
        if(st){const d=JSON.parse(st);setFitBalance(d.balance||0);const tod=new Date().toDateString();if(d.lastDate===tod){setSteps(d.lastSteps||0);}}
      }catch(e){}
      await getStepsToday();
      sub=Pedometer.watchStepCount(()=>{getStepsToday();});
    };
    init();
    return()=>{if(sub)sub.remove();};
  },[]);

  const goal=10000;
  const pct=Math.round(Math.min(steps/goal,1)*100);

  return(
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>StepEarner</Text>
        <View style={s.fitBadge}><Text style={s.fitText}>{fitBalance} FIT</Text></View>
      </View>
      <View style={s.card}>
        <View style={s.ring}>
          <Text style={s.steps}>{steps}</Text>
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
    </View>
  );
}

const s=StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.bgDark,padding:20},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:24},
  title:{fontSize:24,fontWeight:'800',color:Colors.textPrimary},
  fitBadge:{backgroundColor:Colors.bgCard,borderRadius:20,paddingHorizontal:14,paddingVertical:6,borderWidth:1,borderColor:Colors.neonGreen+'50'},
  fitText:{fontSize:14,fontWeight:'700',color:Colors.neonGreen},
  card:{backgroundColor:Colors.bgCard,borderRadius:24,padding:24,marginBottom:20},
  ring:{alignItems:'center',marginBottom:12},
  steps:{fontSize:64,fontWeight:'900',color:'#fff'},
  lbl:{fontSize:11,color:Colors.textSecondary,letterSpacing:3},
  sub:{fontSize:13,color:Colors.textMuted,marginBottom:8},
  pb:{width:'100%',height:8,backgroundColor:Colors.bgElevated,borderRadius:999},
  pf:{height:8,backgroundColor:Colors.neonGreen,borderRadius:999},
  stat:{fontSize:11,color:Colors.neonGreen,marginTop:4},
  fitEarned:{fontSize:13,color:Colors.neonGreen,textAlign:'center',fontWeight:'600',marginTop:8},
  row:{flexDirection:'row',gap:8},
  btn:{flex:1,backgroundColor:Colors.bgCard,borderRadius:16,padding:16,alignItems:'center',borderWidth:1,borderColor:Colors.border},
  bi:{fontSize:14,color:Colors.textSecondary},
});
