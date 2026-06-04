import React from 'react';
import {View,Text,StyleSheet,ScrollView,Platform} from 'react-native';
import {Colors,TOKEN_SYMBOL} from '../theme';
import {useApp} from '../context/AppContext';
const D=[{n:'StepKing_Alex',a:'👑',s:98241,t:982},{n:'RunQueen_Zara',a:'🏃‍♀️',s:91500,t:915},{n:'IronFeet_Marco',a:'⚡',s:87300,t:873},{n:'Walker_Jin',a:'🎯',s:82100,t:821},{n:'FitBoss_Chen',a:'💪',s:76800,t:768}];
const M=['🥇','🥈','🥉'];
export default function LeaderboardScreen(){
  const {todaySteps,wallet,profile}=useApp();
  const me={n:profile?.name||'FitWalker',a:profile?.avatar||'🏃',s:todaySteps,t:Math.round(wallet.balance||0),isMe:true};
  const list=[...D,me].sort((a,b)=>b.s-a.s).map((p,i)=>({...p,r:i+1}));
  return(
    <View style={s.c}>
      <Text style={s.title}>Leaderboard 🏆</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {list.map(p=>(
          <View key={p.n} style={[s.row,p.isMe&&s.me]}>
            <Text style={s.rank}>{p.r<=3?M[p.r-1]:`#${p.r}`}</Text>
            <Text style={s.av}>{p.a}</Text>
            <View style={s.info}>
              <Text style={[s.name,p.isMe&&{color:Colors.neonGreen}]}>{p.n}{p.isMe?' (You)':''}</Text>
              <Text style={s.steps}>{p.s.toLocaleString()} steps</Text>
            </View>
            <Text style={s.tok}>{p.t} {TOKEN_SYMBOL}</Text>
          </View>
        ))}
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}
const s=StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg,padding:16,paddingTop:Platform.OS==='android'?48:60},
  title:{fontSize:28,fontWeight:'900',color:'#fff',marginBottom:20},
  row:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:Colors.bgCard,borderRadius:16,padding:14,marginBottom:8,borderWidth:1,borderColor:Colors.border},
  me:{borderColor:Colors.neonGreen,backgroundColor:Colors.neonGreen+'15'},
  rank:{fontSize:20,width:36,textAlign:'center'},av:{fontSize:28},
  info:{flex:1},name:{fontSize:14,fontWeight:'600',color:'#fff'},steps:{fontSize:12,color:Colors.textMuted,marginTop:2},
  tok:{fontSize:14,fontWeight:'700',color:Colors.gold},
});
