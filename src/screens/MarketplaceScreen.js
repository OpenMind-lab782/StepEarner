import React,{useCallback} from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Alert,Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors,TOKEN_SYMBOL} from '../theme';
import {useApp} from '../context/AppContext';
import {spendTokens} from '../utils/storage';
const R=[{id:'1',t:'$5 Amazon',i:'🛍️',c:500},{id:'2',t:'$5 Starbucks',i:'☕',c:500},{id:'3',t:'$5 Bitcoin',i:'₿',c:500},{id:'4',t:'Plant 5 Trees',i:'🌳',c:100},{id:'5',t:'Feed a Family',i:'🍽️',c:200}];
export default function MarketplaceScreen(){
  const {wallet,refreshWallet}=useApp();
  useFocusEffect(useCallback(()=>{refreshWallet();},[refreshWallet]));
  const buy=async(r)=>{
    if(wallet.balance<r.c){Alert.alert('Need more FIT!',`Walk more steps to earn ${r.c} FIT.`);return;}
    Alert.alert('Confirm',`Buy ${r.t} for ${r.c} FIT?`,[{text:'Cancel',style:'cancel'},{text:'Buy',onPress:async()=>{await spendTokens(r.c,r.t);await refreshWallet();Alert.alert('Success!','Check email in 24-48hrs.');}}]);
  };
  return(
    <View style={s.c}>
      <Text style={s.title}>Rewards 🛍️</Text>
      <Text style={s.bal}>💎 {wallet.balance.toFixed(0)} {TOKEN_SYMBOL} available</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {R.map(r=>(
          <TouchableOpacity key={r.id} style={[s.card,wallet.balance<r.c&&s.off]} onPress={()=>buy(r)}>
            <Text style={s.icon}>{r.i}</Text>
            <View style={s.info}><Text style={s.name}>{r.t}</Text><Text style={s.cost}>{r.c} {TOKEN_SYMBOL}</Text></View>
            <Text style={s.arrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{height:100}}/>
      </ScrollView>
    </View>
  );
}
const s=StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg,padding:16,paddingTop:Platform.OS==='android'?48:60},
  title:{fontSize:28,fontWeight:'900',color:'#fff',marginBottom:8},
  bal:{fontSize:15,color:Colors.gold,fontWeight:'700',marginBottom:16},
  card:{backgroundColor:Colors.bgCard,borderRadius:16,padding:16,marginBottom:10,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:Colors.border},
  off:{opacity:0.4},icon:{fontSize:32},
  info:{flex:1},name:{fontSize:15,color:'#fff',fontWeight:'600'},cost:{fontSize:13,color:Colors.neonGreen,marginTop:2},
  arrow:{fontSize:24,color:Colors.textMuted},
});
