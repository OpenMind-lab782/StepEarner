import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Alert,Platform} from 'react-native';
import {Colors,TOKEN_SYMBOL} from '../theme';
import {useApp} from '../context/AppContext';
export default function WalletScreen(){
  const {wallet}=useApp();
  return(
    <View style={s.c}>
      <Text style={s.title}>My Wallet 💎</Text>
      <View style={s.card}>
        <Text style={s.lbl}>BALANCE</Text>
        <Text style={s.amt}>{wallet.balance.toFixed(2)} {TOKEN_SYMBOL}</Text>
        <Text style={s.usd}>≈ ${(wallet.balance*0.01).toFixed(2)} USD</Text>
        <View style={s.row}>
          <View style={s.stat}><Text style={[s.sv,{color:Colors.neonGreen}]}>{wallet.totalEarned.toFixed(0)}</Text><Text style={s.sl}>Earned</Text></View>
          <View style={s.stat}><Text style={[s.sv,{color:Colors.neonPink}]}>{wallet.totalSpent.toFixed(0)}</Text><Text style={s.sl}>Spent</Text></View>
        </View>
        <TouchableOpacity style={s.btn} onPress={()=>Alert.alert('Withdraw','Min 500 FIT to withdraw.')}><Text style={s.bt}>💸 Withdraw Tokens</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const s=StyleSheet.create({
  c:{flex:1,backgroundColor:Colors.bg,padding:20,paddingTop:Platform.OS==='android'?60:80},
  title:{fontSize:28,fontWeight:'900',color:'#fff',marginBottom:16},
  card:{backgroundColor:Colors.bgCard,borderRadius:24,padding:24,borderWidth:1,borderColor:Colors.neonGreen+'30'},
  lbl:{fontSize:11,color:Colors.textSecondary,letterSpacing:3,marginBottom:8},
  amt:{fontSize:48,fontWeight:'900',color:'#fff',marginBottom:4},
  usd:{fontSize:14,color:Colors.textMuted,marginBottom:20},
  row:{flexDirection:'row',gap:12,marginBottom:20},
  stat:{flex:1,backgroundColor:Colors.bgElevated,borderRadius:12,padding:12,alignItems:'center'},
  sv:{fontSize:20,fontWeight:'700'},sl:{fontSize:11,color:Colors.textMuted},
  btn:{backgroundColor:Colors.neonGreen,borderRadius:12,padding:16,alignItems:'center'},
  bt:{color:Colors.bg,fontWeight:'700',fontSize:16},
});
btn:{backgroundColor:Colors.neonGreen,borderRadius:12,padding:16,alignItems:'center'},
  bt:{color:Colors.bg,fontWeight:'700',fontSize:16},
});
